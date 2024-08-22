import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-cbc';
  private secretKey = crypto.randomBytes(32);
  private iv = crypto.randomBytes(16);

  encrypt(filePath: string): Promise<Buffer> {
    const readStream = fs.createReadStream(filePath);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
    const chunks = [];

    return new Promise((resolve, reject) => {
      readStream.on('data', chunk => {
        const encryptedChunk = cipher.update(chunk);
        chunks.push(encryptedChunk);
      });

      readStream.on('end', () => {
        const encryptedData = Buffer.concat(chunks);
        const finalData = Buffer.concat([encryptedData, cipher.final()]);
        resolve(finalData);
      });

      readStream.on('error', reject);
    });
  }
}
