import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private readonly configService: ConfigService;

  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'sxaujwtkey', // TODO remove
    });
  }

  async validate(payload: { studentId: string }) {
    const { studentId } = payload;

    const user = await this.userRepo.findOneBy({
      studentId,
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return studentId;
  }
}
