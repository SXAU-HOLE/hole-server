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
import { Vote } from '../../entity/hole/vote.entity';
import { VoteItem } from '../../entity/hole/VoteItem.entity';
import { VoteService } from './service/vote.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Hole,
      Tags,
      Comment,
      Reply,
      HoleCategoryEntity,
      Vote,
      VoteItem
    ]),
  ],
  controllers: [HoleController],
  providers: [HoleService, HoleRepoService, VoteService],
})
export class HoleModule {}
