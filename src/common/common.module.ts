import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class CommonModule {}
