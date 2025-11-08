import {
  Controller,
  Post,
  Delete,
  Get,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadResponseDto } from './dto/upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    return this.uploadService.uploadFile(file);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadResponseDto> {
    return this.uploadService.uploadMultipleFiles(files);
  }

  @Delete()
  async deleteFile(
    @Query('filePath') filePath: string,
  ): Promise<UploadResponseDto> {
    if (!filePath) {
      throw new BadRequestException('filePath query parameter required');
    }
    return this.uploadService.deleteFile(filePath);
  }

  @Get('url')
  async getFileUrl(
    @Query('filePath') filePath: string,
  ): Promise<{ url: string }> {
    if (!filePath) {
      throw new BadRequestException('filePath query parameter required');
    }
    const url = await this.uploadService.getFileUrl(filePath);
    return { url };
  }
}
