import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Log } from '../log/log.entity';
import { OrderModule } from 'src/order/order.module';

@Global()
@Module({
  // 必须要导入(把repo实例化并放入容器),才可以注入
  imports: [
    TypeOrmModule.forFeature([User, Log]),
  ],
  controllers: [UserController],
  providers: [
    // class会直接作为token
    UserService,
    {
    // 指定token
    provide: 'userSvc',
    useClass: UserService,
    },
    {
      provide: 'xbox',
      useValue: {
        key: 'halo',
        value: 343
      }
    },
    {
      provide: 'nintendo',
      useFactory(xbox: {key: string, value: string}, userService: UserService) {
        return {
          key: xbox.key,
          value: userService.getFoobar()
        }
      },
      // 指定注入的token
      inject: ['xbox', 'userSvc']
    }
  ],
  exports: [UserService]
})
export class UserModule {
}
