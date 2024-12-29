import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TimeInterceptor implements NestInterceptor {

  @Inject(Reflector)
  private readonly reflector: Reflector;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    // context可以获取controller和handler
    console.log(`controller: ${context.getClass()}, handler: ${context.getHandler()}`);

    const handlerMetadata = this.reflector.get('metadata', context.getHandler());

    if (handlerMetadata) {
      console.log("handlerMetadata: ", handlerMetadata);
    }

    return next.handle().pipe(
      // complete回调
      tap(() => {
        console.log('接口耗时: ', Date.now() - startTime);
      })
    );
  }
}
