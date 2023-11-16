import { Module } from '@nestjs/common';
import { ProductUpdateORM } from '@voiceflow/orm-designer';

import { ProductUpdateService } from './product-update.service';

@Module({
  imports: [ProductUpdateORM.register()],
  exports: [ProductUpdateService],
  providers: [ProductUpdateService],
  controllers: [],
})
export class ProductUpdateModule {}
