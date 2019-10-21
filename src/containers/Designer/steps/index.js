import { StepType } from '@/containers/Designer/constants';

import APIStep from './API';
import EndStep from './End';
import IfStep from './If';
import LinkToStep from './LinkTo';
import SetStep from './Set';
import SystemUtterance from './SystemUtterance';
import UserUtterance from './UserUtterance';

const STEP_COMPONENTS = {
  [StepType.SET]: SetStep,
  [StepType.IF]: IfStep,
  [StepType.LINK_TO]: LinkToStep,
  [StepType.API]: APIStep,
  [StepType.END]: EndStep,
  [StepType.SYSTEM_UTTERANCE]: SystemUtterance,
  [StepType.USER_UTTERANCE]: UserUtterance,
};

export default STEP_COMPONENTS;
