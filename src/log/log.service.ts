import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class LogService {
    constructor(@Inject(forwardRef(() => OrderService)) private readonly OrderService: OrderService) {}
}
