import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../../common/entity/common.entity';
import { Hole } from '../hole.entity';
import { HoleCategoryEnum } from '../../../common/enums/HoleCategory';


@Entity()
export class HoleCategoryEntity extends CommonEntity {
  @Column()
  name: HoleCategoryEnum;

  @OneToMany(() => Hole, (hole) => hole.category)
  holes: Hole[];
}
