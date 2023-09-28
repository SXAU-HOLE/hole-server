import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { isString } from 'class-validator';
import { Strategy } from 'passport-local';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  constructor() {
    super({});
  }

  async validate(studentId: string, password: string) {
    // if (!isString(studentId)) {
    //   throw new NotAcceptableException('学号格式错误');
    // }

    // const user = await this.userRepo.findOne({
    //   where: { studentId },
    // });

    // if (!user) {
    //   throw new NotFoundException('用户不存在');
    // }

    return 'user';
  }
}
