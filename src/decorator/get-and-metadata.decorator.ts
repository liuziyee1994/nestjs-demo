import { applyDecorators, Get, SetMetadata } from '@nestjs/common';
import { Metadata } from './metadata.decorator';

// 组合
export const GetAndMetadata = (path: string, metadataValue: any) => {
    if (path === '' || path === '/') {
        return applyDecorators(Get(), Metadata(metadataValue));
    } else {
        return applyDecorators(Get(path), Metadata(metadataValue));
    }
}
