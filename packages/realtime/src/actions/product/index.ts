import { LoguxControlOptions } from '../../control';
import AddProductControl from './add';
import CreateProductControl from './create';
import PatchProductControl from './patch';
import RemoveProductControl from './remove';
import UpdateProductLocalesControl from './updateLocales';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildProductActionControls = (options: LoguxControlOptions) => ({
  addProductControl: new AddProductControl(options),
  patchProductControl: new PatchProductControl(options),
  createProductControl: new CreateProductControl(options),
  removeProductControl: new RemoveProductControl(options),
  updateProductLocalesControl: new UpdateProductLocalesControl(options),
});

export default buildProductActionControls;

export type ProductActionControlMap = ReturnType<typeof buildProductActionControls>;
