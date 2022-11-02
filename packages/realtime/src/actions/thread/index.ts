import { LoguxControlOptions } from '@/control';

import AddThreadControl from './add';
import AddCommentControl from './comment/add';
import CreateCommentControl from './comment/create';
import DeleteCommentControl from './comment/delete';
import PatchCommentControl from './comment/patch';
import CreateThreadControl from './create';
import PatchThreadControl from './patch';
import RemoveThreadControl from './remove';
import RemoveManyByDiagramIDsThreadControl from './removeManyByDiagramIDs';

const buildThreadActionControls = (options: LoguxControlOptions) => ({
  // threads
  addThreadControl: new AddThreadControl(options),
  createThreadControl: new CreateThreadControl(options),
  patchThreadControl: new PatchThreadControl(options),
  removeThreadControl: new RemoveThreadControl(options),
  removeManyByDiagramIDsThreadControl: new RemoveManyByDiagramIDsThreadControl(options),

  // comments
  addCommentControl: new AddCommentControl(options),
  createCommentControl: new CreateCommentControl(options),
  deleteCommentControl: new DeleteCommentControl(options),
  patchCommentControl: new PatchCommentControl(options),
});

export default buildThreadActionControls;
