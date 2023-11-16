import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ForgetPasswordDTO, LoginDTO, RegisterDTO } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender, User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';
import { encryptPassword, verifyPassword } from './auth.utils';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createResponse } from 'src/utils/create';
import axios from 'axios';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @Inject()
  private readonly configService: ConfigService;

  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDTO) {
    const { password, studentId } = dto;

    const user = await this.userRepo.findOne({
      where: { studentId: studentId },
      select: { password: true },
    });
    const isVerified = await verifyPassword(user.password, password);

    if (!isVerified) {
      throw new BadRequestException('账号或密码错误');
    }

    const token = this.signToken(studentId);

    return {
      access_token: token,
      message: '登录成功！',
    };
  }

  async register(dto: RegisterDTO) {
    const { studentId, username, sxauPassword } = dto;

    const isStudentIdExist = await this.userRepo.findOneBy({
      studentId,
    });

    if (isStudentIdExist) {
      throw new BadRequestException('该用户已经注册过啦~~');
    }

    const isUsernameExist = await this.userRepo.findOneBy({
      username,
    });

    if (isUsernameExist) {
      throw new BadRequestException('换个名字吧，有人比你抢先一步了哦~~');
    }

    const isSXAUPasswordVerified = await this.verifySXAUPassword(
      studentId,
      sxauPassword,
    );

    if (!isSXAUPasswordVerified) {
      throw new BadRequestException('信息门户密码错误');
    }

    const enPassword = await encryptPassword(dto.password);
    const enSxauPassword = await encryptPassword(dto.sxauPassword);

    const user = this.userRepo.create({
      ...dto,
      password: enPassword,
      sxauPassword: enSxauPassword,
      gender: Gender.Mele, // TODO change gender
    });

    const avatarApiUrl = this.configService.get('AVATAR_URL');
    user.avatar = `${avatarApiUrl}${user.username}`;

    await this.userRepo.save(user);

    const token = this.signToken(studentId);

    return {
      access_token: token,
      message: '登录成功！',
    };
  }

  async forget(dto: ForgetPasswordDTO) {
    const { studentId, password, sxauPassword } = dto;

    const user = await this.userRepo.findOneBy({
      studentId,
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const isSXAUPasswordVerified = await this.verifySXAUPassword(
      studentId,
      sxauPassword,
    );

    if (!isSXAUPasswordVerified) {
      throw new BadRequestException('信息门户密码错误');
    }

    user.password = await encryptPassword(password);
    user.sxauPassword = await encryptPassword(sxauPassword);

    await this.userRepo.save(user);

    return createResponse('重置密码成功');
  }

  signToken(studentId: string) {
    return this.jwtService.sign({ studentId });
  }

  /**
   * TODO 验证信息门户
   */
  async verifySXAUPassword(studentId: string, password: string) {
    const url = `${this.configService.get('SXAU_URL')}/mobile/login`;

    try {
      const { data } = await axios({
        method: 'POST',
        url,
        params: {
          username: studentId,
          password,
        },
      });

      if (data.code === '1') return true;
    } catch {
      throw new BadRequestException('请联系管理员，服务器故障啦~');
    }

    return false;
  }
}
