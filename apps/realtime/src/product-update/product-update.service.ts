import { Inject, Injectable } from '@nestjs/common';
import { ProductUpdateORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class ProductUpdateService extends MutableService<ProductUpdateORM> {
  constructor(
    @Inject(ProductUpdateORM)
    protected readonly orm: ProductUpdateORM
  ) {
    super();
  }
}
