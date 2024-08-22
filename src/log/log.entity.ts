import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  data: string;

  @Column()
  result: number;

  @ManyToOne(() => User, user => user.logs)
  // @JoinColumn用来生成外键字段
  // 这里的user可以指代log表的userId字段,也可以指代user表
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}