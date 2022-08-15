import { LoguxControlOptions } from '../../control';
import AddCanvasTemplateControl from './add';
import CreateCanvasTemplateControl from './create';
import PatchCanvasTemplateControl from './patch';
import DeleteCanvasTemplateControl from './remove';

const buildCanvasTemplateActionControls = (options: LoguxControlOptions) => ({
  addCanvasTemplateControl: new AddCanvasTemplateControl(options),
  createCanvasTemplateControl: new CreateCanvasTemplateControl(options),
  patchCanvasTemplateControl: new PatchCanvasTemplateControl(options),
  deleteCanvasTemplateControl: new DeleteCanvasTemplateControl(options),
});

export default buildCanvasTemplateActionControls;
