import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Log } from '../log/log.entity';
import { Role } from '../role/role.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Log, (logs) => logs.user)
  logs: Log[];

  @ManyToMany(() => Role, (roles) => roles.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
