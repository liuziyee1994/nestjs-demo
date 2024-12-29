import { SetMetadata } from '@nestjs/common';

// 封装
export const Metadata = (metadataValue: any) => SetMetadata('metadata', metadataValue);
