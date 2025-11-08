import {
  Controller,
  Post,
  Delete,
  Get,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadResponseDto } from './dto/upload.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    this.logger.log(
      `Uploading single file: ${file?.originalname || 'unknown file'}`,
      'UploadController',
    );

    const result = await this.uploadService.uploadFile(file);

    this.logger.log(
      `Single file uploaded successfully: ${result?.data?.filePath || 'no path'}`,
      'UploadController',
    );

    return result;
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadResponseDto> {
    this.logger.log(
      `Uploading ${files?.length || 0} files...`,
      'UploadController',
    );

    const result = await this.uploadService.uploadMultipleFiles(files);

    this.logger.log(
      `Uploaded ${files?.length || 0} files successfully`,
      'UploadController',
    );

    return result;
  }

  @Delete()
  async deleteFile(
    @Query('filePath') filePath: string,
  ): Promise<UploadResponseDto> {
    if (!filePath) {
      this.logger.warn(
        'Delete file request missing filePath query parameter',
        'UploadController',
      );
      throw new BadRequestException('filePath query parameter required');
    }

    this.logger.log(`Deleting file: ${filePath}`, 'UploadController');

    const result = await this.uploadService.deleteFile(filePath);

    this.logger.log(
      `File deleted successfully: ${filePath}`,
      'UploadController',
    );

    return result;
  }

  @Get('url')
  async getFileUrl(
    @Query('filePath') filePath: string,
  ): Promise<{ url: string }> {
    if (!filePath) {
      this.logger.warn(
        'Get file URL request missing filePath query parameter',
        'UploadController',
      );
      throw new BadRequestException('filePath query parameter required');
    }

    this.logger.log(`Getting file URL for: ${filePath}`, 'UploadController');

    const url = await this.uploadService.getFileUrl(filePath);

    this.logger.log(
      `File URL retrieved successfully for: ${filePath}`,
      'UploadController',
    );

    return { url };
  }
}
