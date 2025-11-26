// zipManager.ts
import JSZip from 'jszip';
import type { ProcessedImage } from './types';

export class ZipManager {
  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  addFile(filename: string, blob: Blob): void {
    this.zip.file(filename, blob);
  }

  addManifest(images: ProcessedImage[]): void {
    const manifest = {
      generated: new Date().toISOString(),
      images: images.map(img => ({
        filename: img.filename,
        width: img.width,
        height: img.height,
        size: img.blob.size
      }))
    };

    this.zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  }

  async generate(onProgress?: (percent: number) => void): Promise<Blob> {
    return this.zip.generateAsync(
      { 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      },
      (metadata) => {
        if (onProgress) {
          onProgress(metadata.percent);
        }
      }
    );
  }

  clear(): void {
    this.zip = new JSZip();
  }
}
