import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { QueryFailedError, Repository, TypeORMError } from 'typeorm';
import { Log } from '../log/log.entity';
import { GetUsersReq } from './model/req/getusers.req';
import { conditionUtils } from '../utils/orm.helper';

@Injectable()
export class UserService {
  constructor(
    // @Autowired
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
  ) {
  }

  findAll(getUsersReq: GetUsersReq) {
    const { page, limit, username, gender, role } = getUsersReq;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    /*return this.userRepository.find({
      select: {
        id: true,
        username: true,
        profile: {
          id: true,
          gender: true,
        },
      },
      relations: {
        profile: true,
        roles: true,
      },
      where: {
        username,
        // where profile.gender = #{gender} and role.id = #{role}
        profile: {
          gender,
        },
        roles: {
          id: role,
        }
      },
      skip,
      take,
    });*/

    let queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'role');

    const conditions = {
      'user.username': username,
      'profile.gender': gender,
      'role.id': role,
    };
    queryBuilder = conditionUtils<User>(queryBuilder, conditions);

    return queryBuilder.skip(skip).take(take)
      // 对数据做过处理(分组或起别名)的话,用getRawMany,原样返回或者选取字段(不起别名)的话,用getMany
      .getMany();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    try {
      const userTemp = this.userRepository.create(user);
      return this.userRepository.save(userTemp);
    } catch (error) {
      // todo:catch代码块没有生效
      if (error instanceof QueryFailedError) {
        // if (errno !=null && errno.equals(1062))
        if (error.driverError.errno && error.driverError.errno === 1062) {
          throw new TypeORMError('该用户名已注册');
        } else {
          throw error;
        }
      } {
        throw error;
      }
    }
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        // 关联查询profile表的数据
        profile: true,
      },
    });
  }

  async findLogs(id: number) {
    const user = await this.findOne(id);
    return this.logRepository.find({
      where: { user },
      relations: {
        // 关联查询user表的数据
        user: true,
      },
    });
  }

  findLogsGroupByResult(id: number) {
    // log左联user
    // 指定log表的别名
    return this.logRepository.createQueryBuilder('log')
      .select('log.result', 'code')
      .addSelect('count("log.id")', 'times')
      // log类的user在这里指代的是user表,指定user表的别名
      .leftJoinAndSelect('log.user', 'user')
      // .leftJoinAndSelect(User, 'user', 'user.id = log.userId')
      .where('user.id = :id', { id: id })
      .groupBy('log.result')
      .orderBy('code', 'DESC')
      .addOrderBy('times', 'DESC')
      .limit(5)
      .getRawMany();

    // user左联log 报错
    /*return this.userRepository.createQueryBuilder('user')
      .select('log.result', 'code')
      .addSelect('count("log.id")', 'times')
      .leftJoinAndSelect('user.logs', 'log')
      .where('user.id = :id', { id: id })
      .groupBy('log.result')
      .orderBy('code', 'DESC')
      .addOrderBy('times', 'DESC')
      .limit(5)
      .getRawMany();*/
  }
}
