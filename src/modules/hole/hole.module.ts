import { Module } from '@nestjs/common';
import { HoleService } from './hole.service';
import { HoleController } from './hole.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Hole } from 'src/entity/hole/hole.entity';
import { Tags } from 'src/entity/hole/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Hole,Tags])],
  controllers: [HoleController],
  providers: [HoleService],
})
export class HoleModule {}
