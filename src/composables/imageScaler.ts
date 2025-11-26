import { MediaProcessorError } from "./types";

// imageScaler.ts
export class ImageScaler {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: false 
    });
    
    if (!ctx) {
      throw new MediaProcessorError(
        'Failed to get canvas context',
        'CANVAS_CONTEXT_ERROR'
      );
    }
    
    this.ctx = ctx;
  }

  async scaleImage(
    img: HTMLImageElement,
    width: number,
    height: number,
    quality: number = 0.95,
    format: 'png' | 'jpeg' | 'webp' = 'png',
    enhance: boolean = true
  ): Promise<Blob> {
    this.canvas.width = width;
    this.canvas.height = height;

    // Enable high-quality scaling
    if (enhance) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }

    // Draw scaled image
    this.ctx.drawImage(img, 0, 0, width, height);

    // Apply sharpening for downscaled images
    if (enhance && (width < img.width || height < img.height)) {
      this.applySharpen();
    }

    return this.canvasToBlob(format, quality);
  }

  private applySharpen(): void {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;

    // Sharpen kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    const output = new Uint8ClampedArray(data);

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * w + (x + kx)) * 4 + c;
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              sum += data[idx] * kernel[kernelIdx];
            }
          }
          output[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, sum));
        }
      }
    }

    imageData.data.set(output);
    this.ctx.putImageData(imageData, 0, 0);
  }

  private canvasToBlob(format: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const mimeType = `image/${format}`;
      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new MediaProcessorError(
              'Failed to convert canvas to blob',
              'BLOB_CONVERSION_ERROR'
            ));
          }
        },
        mimeType,
        quality
      );
    });
  }

  cleanup(): void {
    this.canvas.width = 0;
    this.canvas.height = 0;
  }
}
