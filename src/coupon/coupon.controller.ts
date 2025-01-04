import { Controller, Get, Inject } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponModuleOptions, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './coupon.module-definition';

@Controller('coupon')
export class CouponController {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: typeof OPTIONS_TYPE) {}

  @Get()
  getCoupon() {
    console.log('isGlobal: ', this.options.isGlobal);
    return '10% off';
  }
}
