import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';
import { createResponse } from 'src/utils/create';

@Injectable()
export class OssService {
  @Inject()
  private readonly configService: ConfigService;

  async uploadList(files: Array<Express.Multer.File>) {
    const uploadPromises = files.map((file) => this.upload(file));

    const imgList = await Promise.all(uploadPromises);

    return createResponse('上传成功', imgList);
  }

  async upload(file: Express.Multer.File) {
    const { AccessKey, SecretKey, qn_host, bucket } =
      this.configService.get('QI_NIU');

    const mac = new qiniu.auth.digest.Mac(AccessKey, SecretKey);
    const config = new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z1,
      useCdnDomain: true,
    });
    const fromUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = `${Date.now()}-${file.originalname}`;

    return new Promise((resolve) => {
      const options = {
        scope: bucket,
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);

      fromUploader.put(
        uploadToken,
        key,
        file.buffer,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            throw new BadRequestException(respErr.message);
          }

          if (respInfo.statusCode === 200) {
            resolve(new URL(respBody.key, qn_host).href);
          } else {
            throw new BadRequestException(respInfo);
          }
        },
      );
    });
  }
}
