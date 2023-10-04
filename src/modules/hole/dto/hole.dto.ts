import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Limit } from 'src/common/constants/limit';

export class CreateHoleDto {
  @MaxLength(Limit.hole.holeBodyMaxLength, {
    message: `最多只能有${Limit.hole.holeBodyMaxLength}个字哦`,
  })
  @IsString()
  body: string;

  @ArrayMaxSize(Limit.hole.holeMaxImgLength, {
    message: `最多只能上传${Limit.hole.holeMaxImgLength}张图片哦`,
  })
  @IsArray()
  imgs: string[];

  @MaxLength(Limit.hole.holeTitleLength, {
    message: `标题最长只能有${Limit.hole.holeTitleLength}个字哦`,
  })
  @IsString()
  title?: string;

  @ArrayMaxSize(Limit.hole.holeTagsMaxLength, {
    message: `最多只能创建${Limit.hole.holeTagsMaxLength}个标签哦`,
  })
  @IsArray()
  tags: string[] = [];
}

export class GetHoleDetailQuery {
  // TODO IsHoleExists()
  id: number;
}

export class DeleteHoleDto extends GetHoleDetailQuery {}
