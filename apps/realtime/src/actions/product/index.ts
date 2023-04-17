import { LoguxControlOptions } from '../../control';
import AddProductControl from './add';
import AddManyProductControl from './addMany';
import CreateProductControl from './create';
import PatchProductControl from './patch';
import RemoveProductControl from './remove';
import UpdateProductLocalesControl from './updateLocales';

const buildProductActionControls = (options: LoguxControlOptions) => ({
  addProductControl: new AddProductControl(options),
  patchProductControl: new PatchProductControl(options),
  createProductControl: new CreateProductControl(options),
  removeProductControl: new RemoveProductControl(options),
  addManyProductsControl: new AddManyProductControl(options),
  updateProductLocalesControl: new UpdateProductLocalesControl(options),
});

export default buildProductActionControls;
