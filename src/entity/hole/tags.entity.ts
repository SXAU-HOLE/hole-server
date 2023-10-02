import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Hole } from './hole.entity';

@Entity()
export class Tags extends CommonEntity {
  @Column()
  body: string;

  @ManyToMany(() => Hole, (hole) => hole.tags)
  holes: Hole[];
}
