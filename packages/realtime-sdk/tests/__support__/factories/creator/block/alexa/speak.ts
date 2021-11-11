import { Node } from '@voiceflow/alexa-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Voice from '../voice';

export const SpeakStepData = extend<ReturnType<typeof Voice.SpeakStepData>, Node.Speak.StepData>(Voice.SpeakStepData, {});

export const SpeakNodeData = extend<ReturnType<typeof Voice.SpeakNodeData>, NodeData.Speak>(Voice.SpeakNodeData, {});
