import { IsOptional, IsString } from 'class-validator';
import { PaginateQuery } from 'src/common/dto/paginate.dto';

export class ReplyReplyDto {
  @IsString()
  commentId: string;

  @IsString()
  id: string;

  @IsString()
  body: string;
}

export class GetRepliesQuery extends PaginateQuery {
  @IsString()
  id: string;

  // @IsEnum(HoleReplyOrderMode)
  // @IsOptional()
  // order?: HoleReplyOrderMode = HoleReplyOrderMode.favorite

  @IsString()
  @IsOptional()
  replyId?: string;
}
