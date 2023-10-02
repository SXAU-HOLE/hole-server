import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/entity/user/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (roles: Role[] = [Role.Admin, Role.User]) =>
  SetMetadata(ROLES_KEY, roles);
