import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Limit } from 'src/common/constants/limit';
import { PaginateQuery } from 'src/common/dto/paginate.dto';

export class CreateCommentDto {
  @IsNumber()
  id: number;

  @Length(
    Limit.hole.holeCommentBodyMinLength,
    Limit.hole.holeCommentBodyMaxLength,
    {
      message: `评论字数最长不能超过${Limit.hole.holeCommentBodyMaxLength}`,
    },
  )
  @IsString()
  body: string;

  @ArrayMaxSize(Limit.hole.holeCommentImgMaxLength, {
    message: `最多只能上传${Limit.hole.holeCommentImgMaxLength}张图片哦`,
  })
  @IsArray()
  imgs?: string[] = [];
}

export enum HoleDetailCommentMode {
  all = 'all',
  author = 'author', //只看作者
}

export enum HoleDetailCommentOrder {
  favorite = 'favorite',
  time = 'time',
}

export class GetHoleCommentDto extends PaginateQuery {
  // @IsNumber()
  // @IsOptional()
  id: number; // 树洞id

  @IsEnum(HoleDetailCommentMode)
  @IsOptional()
  mode: HoleDetailCommentMode = HoleDetailCommentMode.all;

  @IsEnum(HoleDetailCommentOrder)
  @IsOptional()
  order?: HoleDetailCommentOrder = HoleDetailCommentOrder.time;

  @IsOptional()
  commentId?: string;
}
