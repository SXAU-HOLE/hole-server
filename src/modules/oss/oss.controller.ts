import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { OssService } from './oss.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadList(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.ossService.uploadList(files);
  }
}
