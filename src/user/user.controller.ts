import {
  Body,
  Controller, Delete,
  Get,
  Inject,
  LoggerService, Param, Patch,
  Post,
  Query, UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GetUsersReq } from './model/req/getusers.req';
import { TypeormFilter } from '../filter/typeorm.filter';

@Controller('user')
// 绑定过滤器
// @UseFilters(TypeormFilter)
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  @Get()
  getUsers(@Query() getUsersReq: GetUsersReq): any {
    // todo:接收到的get参数是string类型,要对number类型的字段做校验
    console.log("getUsers req data:", getUsersReq);
    return this.userService.findAll(getUsersReq);
  }

  @Post()
  addUser(@Body() dto: any): any {
    const user = dto as User;
    return this.userService.create(user);
  }

  // 如果该接口定义在在getUser接口后面,同时路由是/profile,就会把路径里的profile看作路径参数,匹配到getUser接口,可以把它放在前面来规避
  // @Get('/profile')
  @Get('/profile/:id')
  getUserProfile(@Param('id') id: number, @Query('hello') query: any): any {
    console.log('getUserProfile id:', id);
    console.log('getUserProfile req params:', query);
    return this.userService.findProfile(id);
  }

  // 路径参数
  @Get('/:id')
  getUser(@Param('id') id: number): any {
    return this.userService.findOne(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() dto: any): any {
    const user = dto as User;
    return this.userService.update(id, user);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number): any {
    return this.userService.remove(id);
  }

  // todo:放在log模块
  @Get('/logs/:id')
  getUserLogs(@Param('id') id: number): any {
    return this.userService.findLogs(id);
  }

  @Get('/logs/group/:id')
  async getUserLogsGroupByResult(@Param('id') id: number): Promise<any> {
    const res = await this.userService.findLogsGroupByResult(id);
    return res.map(o => ({
      code: o.code,
      times: o.times,
    }));
  }
}
