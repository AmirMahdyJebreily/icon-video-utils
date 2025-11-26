export interface SizeConfig {
  width: number;
  height: number;
  count?: number;
}

export interface MediaResizerOptions {
  sizes: SizeConfig[];
  quality?: number; // 0-1 for JPEG/WebP
  format?: 'png' | 'jpeg' | 'webp' | 'ico';
  includeZip?: boolean;
  zipFilename?: string;
  onProgress?: (progress: ProgressEvent) => void;
  enhance?: boolean;
  concurrency?: number; // Number of parallel operations
}

export interface ProgressEvent {
  current: number;
  total: number;
  stage: 'loading' | 'processing' | 'encoding' | 'zipping' | 'complete';
  filename?: string;
}

export interface ProcessedImage {
  blob: Blob;
  width: number;
  height: number;
  filename: string;
}

export interface ProcessingResult {
  images: ProcessedImage[];
  zipBlob?: Blob;
  duration: number;
}

export class MediaProcessorError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'MediaProcessorError';
  }
}
