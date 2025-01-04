import { DynamicModule, Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { ConfigurableModuleClass } from './coupon.module-definition';

@Module({
  controllers: [CouponController]
})
export class CouponModule extends ConfigurableModuleClass {

  // 手动定义register方法
  /* static register(options: Record<string, any>): DynamicModule {
    return {
      // 比@Module多出一个module参数
      module: CouponModule,
      controllers: [CouponController],-
      providers: [
        CouponService,
        {
          provide: 'COUPON_MODULE_OPTIONS',
          useValue: options
        }
      ]
    }
  } */

}
