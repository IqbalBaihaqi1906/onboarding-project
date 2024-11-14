import { SetMetadata } from '@nestjs/common';

export const PUBLIC = 'isOptional';
export const Public = () => {
  return SetMetadata(PUBLIC, true);
};
