import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { isString } from 'class-validator';
import { Strategy } from 'passport-local';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  constructor() {
    super({
      usernameField: 'studentId',
      passwordField: 'password',
    });
  }

  async validate(studentId: string, password: string): Promise<any> {
    if (!isString(studentId) || !isString(password)) {
      throw new NotAcceptableException('学号或密码格式错误');
    }

    const user = await this.userRepo.findOne({
      where: { studentId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return true;
  }
}
