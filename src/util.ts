import fs from 'fs/promises';
import path from 'path';

export async function checkAndReadFile(imagePath: string): Promise<{
  imageBytes: Buffer;
  contentType: string;
}> {
  const fileExists = await fs
    .access(imagePath)
    .then(() => true)
    .catch(() => false);
  if (!fileExists) {
    throw new Error(`File does not exist: ${imagePath}`);
  }

  const fileExtension = path.extname(imagePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
    throw new Error('Only JPG, JPEG, and PNG files are supported!');
  }

  const image = await fs.readFile(imagePath);

  return {
    imageBytes: image,
    contentType: fileExtension === '.jpg' || fileExtension === '.jpeg' ? 'image/jpeg' : 'image/png',
  };
}

export function validateImagePaths(imagePaths: string[]): void {
  if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
    throw new Error('Image paths must be an array with at least one image.');
  }
}
