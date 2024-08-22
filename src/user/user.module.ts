import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Log } from '../log/log.entity';

@Module({
  // 必须要导入(把repo实例化并放入容器),才可以注入
  imports: [
    TypeOrmModule.forFeature([User, Log])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
}
