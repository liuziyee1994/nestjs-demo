import { forwardRef, Inject, Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class OrderService implements OnModuleInit, OnApplicationBootstrap {

  // 先创建OrderService,然后再把LogService的引用转发过来
  constructor(@Inject(forwardRef(() => LogService)) private readonly logService: LogService) {}

  onModuleInit() {
    console.log('OrderService onModuleInit');
  }

  onApplicationBootstrap() {
    console.log('OrderService onApplicationBootstrap');
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
