import { LoguxControlOptions } from '@/legacy/control';

import AddDomainControl from './add';
import AddManyDomainsControl from './addMany';
import CreateDomainControl from './create';
import DeleteWithNewVersionControl from './deleteWithNewVersion';
import DuplicateDomainControl from './duplicate';
import PatchDomainControl from './patch';
import RemoveDomainControl from './remove';
import TopicAddControl from './topicAdd';
import TopicConvertFromComponentControl from './topicConvertFromComponent';
import TopicCreateControl from './topicCreate';
import TopicMoveDomainControl from './topicMoveDomain';
import TopicRemoveControl from './topicRemove';
import TopicReorderControl from './topicReorder';

const buildDomainActionControls = (options: LoguxControlOptions) => ({
  // crud
  addDomainControl: new AddDomainControl(options),
  patchDomainControl: new PatchDomainControl(options),
  removeDomainControl: new RemoveDomainControl(options),
  createDomainControl: new CreateDomainControl(options),
  addManyDomainsControl: new AddManyDomainsControl(options),
  duplicateDomainControl: new DuplicateDomainControl(options),
  deleteWithNewVersionControl: new DeleteWithNewVersionControl(options),

  // topics
  topicAddControl: new TopicAddControl(options),
  topicCreateControl: new TopicCreateControl(options),
  topicRemoveControl: new TopicRemoveControl(options),
  topicReorderControl: new TopicReorderControl(options),
  topicConvertFromComponentControl: new TopicConvertFromComponentControl(options),
  topicMoveDomainControl: new TopicMoveDomainControl(options),
});

export default buildDomainActionControls;
