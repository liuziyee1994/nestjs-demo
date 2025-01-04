import { forwardRef, Global, Module, OnApplicationBootstrap, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ModuleRef } from '@nestjs/core';
import { LogModule } from 'src/log/log.module';

@Module({
  // 先创建OrderModule,然后再把LogModule的引用转发过来
  imports: [forwardRef(() => LogModule)],
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
