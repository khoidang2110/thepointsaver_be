// tạo function upload file lên cloudinary

import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream'); // thư viện cũ nên import theo kiểu es5

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
      toStream(file.buffer).pipe(upload); // upload file lên cloudinary
    });
  }
}