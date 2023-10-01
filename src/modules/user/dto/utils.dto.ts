import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidatorConstraint } from 'class-validator';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUsernameExistConstraint {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  async validate(studentId: string) {
    const user = await this.userRepo.findOne({
      where: {
        studentId,
      },
    });

    if (!user) {
      throw new NotFoundException('该用户不存在');
    }

    return true;
  }
}

// export const IsUsernameExist = createClassValidator(IsUsernameExistConstraint);
