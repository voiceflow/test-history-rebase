import { atom } from 'jotai';

import { Step } from './Payment.constants';

export const stepAtom = atom(Step.PLAN);
