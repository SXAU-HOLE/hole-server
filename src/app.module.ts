import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfig } from '../config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './common/common.module';
import { User } from './entity/user/user.entity';
import { Hole } from './entity/hole/hole.entity';
import { Tags } from './entity/hole/tags.entity';
import { Reply } from './entity/hole/reply.entity';
import { Comment } from './entity/hole/comment.entity';
import { HoleModule } from './modules/hole/hole.module';
import { OssModule } from './modules/oss/oss.module';
import { HoleCategoryEntity } from './entity/hole/category/HoleCategory.entity';
import { Vote } from './entity/hole/vote.entity';
import { VoteItem } from './entity/hole/VoteItem.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ...config.get('DB_CONFIG'),
          synchronize: true,
          entities: [User, Hole, Tags, Comment, Reply, HoleCategoryEntity,Vote,VoteItem],
        } as TypeOrmModuleOptions;
      },
    }),
    AuthModule,
    UserModule,
    CommonModule,
    HoleModule,
    OssModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
