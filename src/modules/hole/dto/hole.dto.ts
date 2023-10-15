import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Limit } from 'src/common/constants/limit';
import { PaginateQuery } from 'src/common/dto/paginate.dto';

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

  // @MaxLength(Limit.hole.holeTitleLength, {
  //   message: `标题最长只能有${Limit.hole.holeTitleLength}个字哦`,
  // })
  // @IsString()
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

export enum HoleListMode {
  latest = 'latest',
  hot = 'hot',
}

export class GetHoleListQuery extends PaginateQuery {
  @IsEnum(HoleListMode, { message: '没有这个模式哦' })
  @IsString()
  mode: HoleListMode = HoleListMode.latest;
}
