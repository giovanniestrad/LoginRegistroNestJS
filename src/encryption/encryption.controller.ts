import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EncryptionService } from './encryption.service';
import { Express } from 'express';
import * as fs from 'fs';

@Controller('encryption')
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { message: 'No file uploaded' };
    }

    try {
      const encryptedData = await this.encryptionService.encrypt(file.path);
      const outputFilePath = `encrypted_${file.originalname}`;
      fs.writeFileSync(outputFilePath, encryptedData);
      return { message: 'File encrypted successfully', path: outputFilePath };
    } catch (error) {
      return { message: 'Error encrypting file', error: error.message };
    }
  }
}