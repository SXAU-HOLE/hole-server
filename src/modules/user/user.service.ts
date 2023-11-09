import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';
import { EditProFileDto } from './dto/profile.dto';
import { IUser } from './user.controller';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userReop: Repository<User>;

  async getProfile(reqUser: IUser) {
    return await this.userReop.findOne({
      where: {
        studentId: reqUser,
      },
      select: {
        id: true,
        role: true,
        avatar: true,
        username: true,
        studentId: true,
        createAt: true,
      },
    });
  }

  async editProfile(dto: EditProFileDto, reqUser: IUser) {
    if (dto.username) {
      const isExitedUser = await this.userReop.findOne({
        where: { username: dto.username },
      });

      if (isExitedUser) throw new BadRequestException(`用户名已经存在啦`);
    }

    return await this.userReop.update(
      {
        studentId: reqUser,
      },
      {
        ...dto,
      },
    );
  }
}
