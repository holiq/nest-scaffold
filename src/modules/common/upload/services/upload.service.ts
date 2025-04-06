import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

@Injectable()
export class UploadService {
  async upload(
    file: Express.Multer.File,
    destinationFolder: string,
    allowedMimes: string[] = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/octet-stream',
    ],
  ) {
    if (!file) throw new BadRequestException('No file provided');

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
    }

    const fullDest = path.resolve(destinationFolder);
    if (!fs.existsSync(fullDest)) {
      fs.mkdirSync(fullDest, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const filename = `${randomBytes(8).toString('hex')}${ext}`;
    const finalPath = path.join(fullDest, filename);

    fs.writeFileSync(finalPath, file.buffer);

    return {
      filename,
      destination: finalPath,
      mime: file.mimetype,
    };
  }

  async delete(fileName: string): Promise<void> {
    if (fs.existsSync(fileName)) {
      fs.rmSync(fileName);
    }
  }
}
