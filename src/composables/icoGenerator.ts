// icoGenerator.ts
export class IcoGenerator {
  async generateIco(images: Blob[]): Promise<Blob> {
    // ICO file structure
    const header = new ArrayBuffer(6);
    const headerView = new DataView(header);
    
    // ICO header
    headerView.setUint16(0, 0, true); // Reserved
    headerView.setUint16(2, 1, true); // Type: ICO
    headerView.setUint16(4, images.length, true); // Number of images

    const iconDirs: ArrayBuffer[] = [];
    const imageBuffers: ArrayBuffer[] = [];
    let offset = 6 + (images.length * 16); // Header + directory entries

    for (const blob of images) {
      const arrayBuffer = await blob.arrayBuffer();
      const pngData = new Uint8Array(arrayBuffer);
      
      // Extract dimensions from PNG
      const width = this.getPngWidth(pngData);
      const height = this.getPngHeight(pngData);
      
      // Icon directory entry
      const dir = new ArrayBuffer(16);
      const dirView = new DataView(dir);
      dirView.setUint8(0, width === 256 ? 0 : width); // Width
      dirView.setUint8(1, height === 256 ? 0 : height); // Height
      dirView.setUint8(2, 0); // Color palette
      dirView.setUint8(3, 0); // Reserved
      dirView.setUint16(4, 1, true); // Color planes
      dirView.setUint16(6, 32, true); // Bits per pixel
      dirView.setUint32(8, pngData.length, true); // Image size
      dirView.setUint32(12, offset, true); // Image offset

      iconDirs.push(dir);
      imageBuffers.push(arrayBuffer);
      offset += pngData.length;
    }

    // Combine all parts
    const totalSize = 6 + (images.length * 16) + imageBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const result = new Uint8Array(totalSize);
    let position = 0;

    // Write header
    result.set(new Uint8Array(header), position);
    position += 6;

    // Write directory entries
    for (const dir of iconDirs) {
      result.set(new Uint8Array(dir), position);
      position += 16;
    }

    // Write image data
    for (const imgBuf of imageBuffers) {
      result.set(new Uint8Array(imgBuf), position);
      position += imgBuf.byteLength;
    }

    return new Blob([result], { type: 'image/x-icon' });
  }

  private getPngWidth(data: Uint8Array): number {
    return (data[16] << 24) | (data[17] << 16) | (data[18] << 8) | data[19];
  }

  private getPngHeight(data: Uint8Array): number {
    return (data[20] << 24) | (data[21] << 16) | (data[22] << 8) | data[23];
  }
}
