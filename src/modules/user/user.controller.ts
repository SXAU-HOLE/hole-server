import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/common/decorator/user.decorator';
import { EditProFileDto } from './dto/profile.dto';
import { Roles } from 'src/common/decorator/roles.decorator';

export type IUser = string;

@Roles()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getProfile(@User() user: IUser) {
    return this.userService.getProfile(user);
  }

  @Post('/profile')
  editProfile(@Body() dto: EditProFileDto, @User() user: IUser) {
    return this.userService.editProfile(dto, user);
  }
}
