import { ArrayMaxSize, IsArray, IsEnum, IsString, MaxLength } from "class-validator";
import { Limit } from "src/common/constants/limit";
import { VoteType } from "src/entity/hole/vote.entity";

export class Vote {
  @IsArray()
  @ArrayMaxSize(Limit.hole.holeVoteMaxLength, {
    message: `最多只能创建${Limit.hole.holeVoteMaxLength}个选项哦`,
  })
  @MaxLength(Limit.hole.holeVoteItemLength, {
    each: true,
    message: `每个选项最长只能是${Limit.hole.holeVoteItemLength}个字符哦`,
  })
  items: string[];

  @IsString()
  @MaxLength(Limit.hole.holeVoteTitleMaxLength, {
    message: `标题最长只能是${Limit.hole.holeVoteTitleMaxLength}个字符哦`,
  })
  title: string;

  @IsEnum(VoteType)
  type: VoteType = VoteType.single;
}

export class PostVoteDto {
  @IsString()
  id: string;

  @IsArray()
  ids: string[] = [];
}
