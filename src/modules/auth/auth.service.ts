import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender, User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { encryptPassword } from './auth.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @Inject()
  private readonly configService: ConfigService;

  login(dto: LoginDTO) {
    return dto;
  }

  async register(dto: RegisterDTO) {
    const isStudentIdExist = await this.userRepo.findOneBy({
      studentId: dto.studentId,
    });

    if (isStudentIdExist) {
      throw new BadRequestException('该用户已经注册过啦~~');
    }

    const isUsernameExist = await this.userRepo.findOneBy({
      username: dto.username,
    });

    if (isUsernameExist) {
      throw new BadRequestException('换个名字吧，有人比你抢先一步了哦~~');
    }

    const isSXAUPasswordVerified = await this.verifySXAUPassword(
      dto.studentId,
      dto.sxauPassword,
    );

    if (!isSXAUPasswordVerified) {
      throw new BadRequestException('信息门户密码错误');
    }

    const password = await encryptPassword(dto.password);
    const sxauPassword = await encryptPassword(dto.sxauPassword);

    const user = this.userRepo.create({
      ...dto,
      password,
      sxauPassword,
      gender: Gender.Mele, // TODO change gender
    });

    const avatarApiUrl = this.configService.get('AVATAR_URL');
    user.avatar = `${avatarApiUrl}${user.username}`;

    return await this.userRepo.save(user);
  }

  /**
   * TODO 验证信息门户
   */
  async verifySXAUPassword(studentId: string, password: string) {
    return true;
  }
}
