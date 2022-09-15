import { LoguxControlOptions } from '../../control';
import AddCanvasTemplateControl from './add';
import CreateCanvasTemplateControl from './create';
import ImportSnapshotControl from './importSnapshot';
import InitializeControl from './initialize';
import PatchCanvasTemplateControl from './patch';
import DeleteCanvasTemplateControl from './remove';

const buildCanvasTemplateActionControls = (options: LoguxControlOptions) => ({
  addCanvasTemplateControl: new AddCanvasTemplateControl(options),
  createCanvasTemplateControl: new CreateCanvasTemplateControl(options),
  patchCanvasTemplateControl: new PatchCanvasTemplateControl(options),
  deleteCanvasTemplateControl: new DeleteCanvasTemplateControl(options),
  importSnapshotControl: new ImportSnapshotControl(options),
  initializeControl: new InitializeControl(options),
});

export default buildCanvasTemplateActionControls;
