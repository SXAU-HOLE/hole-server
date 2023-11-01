import { CommonEntity } from 'src/common/entity/common.entity';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';

interface LikeableDTO {
  id: string | number;
}

export interface ILikeableEntity extends CommonEntity {
  favoriteCount: number;

  favoriteUsers: User[];

  user: User;
}

export interface IProcessLikeOptions {
  entity: ILikeableEntity;

  repo: Repository<any>;

  reqUser: string;

  dto: LikeableDTO;

  property: string;
}
