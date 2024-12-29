import { Global, Module, OnApplicationBootstrap, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ModuleRef } from '@nestjs/core';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown {
  // 注入当前模块的引用
  constructor(private readonly moduleRef: ModuleRef) {}

  onModuleInit() {
    console.log('OrderMoudle onModuleInit');
  }

  onApplicationBootstrap() {
    console.log('OrderModule onApplicationBootstrap');
  }

  onApplicationShutdown(signal?: string) {
    console.log("shutdown, signal: ", signal);

    const orderService = this.moduleRef.get<OrderService>(OrderService);
    console.log(orderService.findAll());
  }
}
