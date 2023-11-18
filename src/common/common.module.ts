import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Hole } from 'src/entity/hole/hole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Hole])],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class CommonModule {}
