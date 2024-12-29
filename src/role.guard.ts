import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderService } from './order/order.service';
import { UserService } from './user/user.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  // @Inject(UserService)
  // private readonly userService: UserService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // ExecutionContext是ArgumentHost的子类
    const request = context.switchToHttp().getRequest();
    console.log(`拦截url: ${request.url}`);

    const requiredRoles = this.reflector.get('role', context.getHandler());

    if (!requiredRoles) {
      return true;
    }

    const {user} = request;
    console.log('user:', user);
    // user.roles为null或者undefiend的话,?.会短路并返回undefined
    return requiredRoles.some((role) => user && user.roles?.includes(role));
  }
}
