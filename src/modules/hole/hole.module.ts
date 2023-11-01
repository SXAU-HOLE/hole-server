import { Module } from '@nestjs/common';
import { HoleService } from './hole.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Hole } from 'src/entity/hole/hole.entity';
import { Tags } from 'src/entity/hole/tags.entity';
import { Comment } from 'src/entity/hole/comment.entity';
import { HoleController } from './hole.controller';
import { Reply } from 'src/entity/hole/reply.entity';
import { HoleCategoryEntity } from '../../entity/hole/category/HoleCategory.entity';
import { HoleRepoService } from './service/hole.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Hole,
      Tags,
      Comment,
      Reply,
      HoleCategoryEntity,
    ]),
  ],
  controllers: [HoleController],
  providers: [HoleService, HoleRepoService],
})
export class HoleModule {}
