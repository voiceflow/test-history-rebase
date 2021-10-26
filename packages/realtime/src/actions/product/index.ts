import { LoguxControlOptions } from '../../control';
import AddProductControl from './add';
import PatchProductControl from './patch';
import RemoveProductConrol from './remove';
import UpdateProductLocalesConrol from './updateLocales';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildProductActionControls = (options: LoguxControlOptions) => ({
  addProductControl: new AddProductControl(options),
  patchProductControl: new PatchProductControl(options),
  removeProductControl: new RemoveProductConrol(options),
  updateProductLocalesConrol: new UpdateProductLocalesConrol(options),
});

export default buildProductActionControls;

export type ProductActionControlMap = ReturnType<typeof buildProductActionControls>;
