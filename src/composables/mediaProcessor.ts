// mediaProcessor.ts (Main Composable)
import { ref, Ref } from 'vue';
import type {
  MediaResizerOptions,
  ProcessingResult,
  ProcessedImage,
  ProgressEvent
} from './types';
import { MediaProcessorError } from './types';
import { ImageScaler } from './imageScaler';
import { IcoGenerator } from './icoGenerator';
import { ZipManager } from './zipManager';

export function useMediaProcessor() {
  const isProcessing: Ref<boolean> = ref(false);
  const progress: Ref<ProgressEvent | null> = ref(null);
  const error: Ref<MediaProcessorError | null> = ref(null);

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(
          new MediaProcessorError(
            'Failed to load image',
            'IMAGE_LOAD_ERROR'
          )
        );
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(
        new MediaProcessorError(
          'Failed to read file',
          'FILE_READ_ERROR'
        )
      );

      reader.readAsDataURL(file);
    });
  };

  const updateProgress = (
    current: number,
    total: number,
    stage: ProgressEvent['stage'],
    filename?: string
  ) => {
    progress.value = { current, total, stage, filename };
  };

  const processBatch = async <T, R>(
    items: T[],
    processor: (item: T, index: number) => Promise<R>,
    concurrency: number
  ): Promise<R[]> => {
    const results: R[] = [];
    const executing: Promise<void>[] = [];

    for (let i = 0; i < items.length; i++) {
      const promise = processor(items[i], i).then(result => {
        results[i] = result;
      });

      executing.push(promise);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p === promise), 1);
      }
    }

    await Promise.all(executing);
    return results;
  };

  const processImage = async (
    file: File,
    options: MediaResizerOptions
  ): Promise<ProcessingResult> => {
    const startTime = performance.now();
    isProcessing.value = true;
    error.value = null;

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new MediaProcessorError(
          'Invalid file type. Please provide an image file.',
          'INVALID_FILE_TYPE'
        );
      }

      // Load image
      updateProgress(0, 100, 'loading', file.name);
      const img = await loadImage(file);

      // Calculate total tasks
      const totalTasks = options.sizes.reduce((sum, size) => 
        sum + (size.count || 1), 0
      );

      // Process images concurrently
      updateProgress(0, totalTasks, 'processing');
      
      const scaler = new ImageScaler();
      const tasks: Array<() => Promise<ProcessedImage>> = [];
      
      options.sizes.forEach((sizeConfig, idx) => {
        const count = sizeConfig.count || 1;
        for (let i = 0; i < count; i++) {
          tasks.push(async () => {
            const blob = await scaler.scaleImage(
              img,
              sizeConfig.width,
              sizeConfig.height,
              options.quality,
              options.format === 'ico' ? 'png' : options.format,
              options.enhance
            );

            const suffix = count > 1 ? `-${i + 1}` : '';
            const ext = options.format === 'ico' ? 'png' : options.format || 'png';
            const filename = `${file.name.split('.')[0]}-${sizeConfig.width}x${sizeConfig.height}${suffix}.${ext}`;

            return {
              blob,
              width: sizeConfig.width,
              height: sizeConfig.height,
              filename
            };
          });
        }
      });

      const concurrency = options.concurrency || 4;
      let completed = 0;

      const processedImages = await processBatch(
        tasks,
        async (task) => {
          const result = await task();
          completed++;
          updateProgress(completed, totalTasks, 'processing', result.filename);
          if (options.onProgress) {
            options.onProgress(progress.value!);
          }
          return result;
        },
        concurrency
      );

      scaler.cleanup();

      // Generate ICO if requested
      let icoBlob: Blob | undefined;
      if (options.format === 'ico') {
        updateProgress(totalTasks, totalTasks, 'encoding');
        const icoGenerator = new IcoGenerator();
        const blobs = processedImages.map(img => img.blob);
        icoBlob = await icoGenerator.generateIco(blobs);
        
        processedImages.push({
          blob: icoBlob,
          width: 0,
          height: 0,
          filename: `${file.name.split('.')[0]}.ico`
        });
      }

      // Create ZIP if requested
      let zipBlob: Blob | undefined;
      if (options.includeZip) {
        updateProgress(totalTasks, totalTasks, 'zipping');
        
        const zipManager = new ZipManager();
        processedImages.forEach(img => {
          zipManager.addFile(img.filename, img.blob);
        });
        zipManager.addManifest(processedImages);

        zipBlob = await zipManager.generate((percent) => {
          if (options.onProgress) {
            options.onProgress({
              current: percent,
              total: 100,
              stage: 'zipping'
            });
          }
        });
      }

      updateProgress(totalTasks, totalTasks, 'complete');
      
      const duration = performance.now() - startTime;

      return {
        images: processedImages,
        zipBlob,
        duration
      };
    } catch (err) {
      const mediaError = err instanceof MediaProcessorError
        ? err
        : new MediaProcessorError(
            'An unexpected error occurred during processing',
            'UNKNOWN_ERROR',
            err as Error
          );
      
      error.value = mediaError;
      throw mediaError;
    } finally {
      isProcessing.value = false;
    }
  };

  const downloadFile = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = (result: ProcessingResult, zipFilename?: string): void => {
    if (result.zipBlob) {
      downloadFile(result.zipBlob, zipFilename || 'processed-images.zip');
    } else {
      result.images.forEach(img => {
        downloadFile(img.blob, img.filename);
      });
    }
  };

  return {
    isProcessing,
    progress,
    error,
    processImage,
    downloadFile,
    downloadAll
  };
}
