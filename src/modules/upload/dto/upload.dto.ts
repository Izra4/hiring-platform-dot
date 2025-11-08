export class UploadResponseDto {
  success: boolean;
  message: string;
  data?: {
    fileName: string;
    fileUrl: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
  };
}
