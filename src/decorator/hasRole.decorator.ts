import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enum/role.enum';

export const HasRole = (...role: Role[]) => SetMetadata('role', role);
