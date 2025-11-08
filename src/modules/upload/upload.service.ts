/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';
import { UploadResponseDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
  private readonly bucketName: string;

  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>(
      'SUPABASE_BUCKET_NAME',
      'uploads',
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }

    try {
      const supabase = this.supabaseService.getClient();

      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new BadRequestException(`Upload gagal: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        message: 'File berhasil diupload',
        data: {
          fileName: file.originalname,
          fileUrl: urlData.publicUrl,
          filePath: data.path,
          fileSize: file.size,
          mimeType: file.mimetype,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Error saat upload file: ${error.message}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
  ): Promise<UploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Tidak ada file yang diupload');
    }

    try {
      const uploadPromises = files.map((file) => this.uploadFile(file));
      const results = await Promise.all(uploadPromises);

      return {
        success: true,
        message: `${results.length} file berhasil diupload`,
        data: results.map((r) => r.data) as any,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error saat upload multiple files: ${error.message}`,
      );
    }
  }

  async deleteFile(filePath: string): Promise<UploadResponseDto> {
    try {
      const supabase = this.supabaseService.getClient();

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new BadRequestException(`Hapus file gagal: ${error.message}`);
      }

      return {
        success: true,
        message: 'File berhasil dihapus',
      };
    } catch (error) {
      throw new BadRequestException(`Error saat hapus file: ${error.message}`);
    }
  }

  getFileUrl(filePath: string): string {
    const supabase = this.supabaseService.getClient();
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}
