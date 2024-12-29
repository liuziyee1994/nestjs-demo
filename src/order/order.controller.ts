import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleDestroy, OnModuleInit, OnApplicationBootstrap, UseGuards, UseInterceptors, UnauthorizedException, Optional, Inject, SetMetadata, Header, Headers, Ip, Session, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { TimeInterceptor } from 'src/time.interceptor';
import { GetAndMetadata } from 'src/decorator/get-and-metadata.decorator';
import { Metadata } from 'src/decorator/metadata.decorator';

@Controller('order')
@SetMetadata('roles', ['user'])
// @UseInterceptors(TimeInterceptor)
export class OrderController implements OnModuleInit, OnApplicationBootstrap {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService) {}

  // 容器没有这个对象的话会创建一个出来
  @Optional()
  @Inject('foobar')
  private readonly foobar: Record<string, any>;

  // 生命周期函数
  onModuleInit() {
    console.log('OrderController onModuleInit');
  }

  onApplicationBootstrap() {
    console.log('OrderController onApplicationBootstrap');
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  
  // @Get()
  // @UseInterceptors(TimeInterceptor)
  // @UseGuards(new LoginGuard())
  @GetAndMetadata('', {id: 'findAll', url: '/order'})
  findAll(@Session() session, @Headers('Accept') accept: string, @Headers() headers: Record<string, any>) {
    // throw new UnauthorizedException('无访问权限');
    
    /* if (!session.count) {
      session.count = 0;
    }
    return ++session.count; */

    console.log('accept请求头: ', accept);
    console.log('全部请求头: ', headers);
    return this.userService.findAll({ page: 1, limit: 10 });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
