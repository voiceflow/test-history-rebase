import { LoguxControlOptions } from '../../control';
import AddCanvasTemplateControl from './add';
import CreateCanvasTemplateControl from './create';
import InitializeControl from './initialize';
import PatchCanvasTemplateControl from './patch';
import DeleteCanvasTemplateControl from './remove';

const buildCanvasTemplateActionControls = (options: LoguxControlOptions) => ({
  initializeControl: new InitializeControl(options),
  addCanvasTemplateControl: new AddCanvasTemplateControl(options),
  patchCanvasTemplateControl: new PatchCanvasTemplateControl(options),
  createCanvasTemplateControl: new CreateCanvasTemplateControl(options),
  deleteCanvasTemplateControl: new DeleteCanvasTemplateControl(options),
});

export default buildCanvasTemplateActionControls;
