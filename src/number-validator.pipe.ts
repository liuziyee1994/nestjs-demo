import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NumberValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    // 用于对get请求参数
    console.log('metadata: ', JSON.stringify(metadata));
    return value;
  }
}
