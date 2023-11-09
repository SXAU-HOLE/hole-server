import { IsString, Length } from 'class-validator';
import { Limit } from 'src/common/constants/limit';

export class EditProFileDto {
  // TODO add IsUsernameExist
  // @IsUsernameExist()
  // @Length(Limit.user.minUsernameLength, Limit.user.maxUsernameLength, {
  //   message: `用户名长度只能为${Limit.user.minUsernameLength}-${Limit.user.maxUsernameLength}`,
  // })
  // @IsString()
  username?: string;

  avatar?: string;
}
