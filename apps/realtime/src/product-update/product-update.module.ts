import { Module } from '@nestjs/common';
import { ProductUpdateORM } from '@voiceflow/orm-designer';

import { ProductUpdateService } from './product-update.service';

@Module({
  exports: [ProductUpdateService],
  providers: [ProductUpdateORM, ProductUpdateService],
  controllers: [],
})
export class ProductUpdateModule {}
