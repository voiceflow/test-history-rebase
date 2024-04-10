import { BaseModels } from '@voiceflow/base-types';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { SectionV2, System } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import * as Settings from '@/components/Settings';
import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, useFeature, useSelector } from '@/hooks';

import IntentConfidence from './IntentConfidence';

const CLASSIFY_DESCRIPTIONS = {
  [BaseModels.Project.ClassifyStrategy.VF_NLU_LLM_HYBRID]: 'Use a large language model to classify users intentions.',
  [BaseModels.Project.ClassifyStrategy.VF_NLU]: "Use Voiceflow's NLU model to classify users intentions",
};

const CLASSIFY_OPTIONS = [
  { id: BaseModels.Project.ClassifyStrategy.VF_NLU_LLM_HYBRID, label: 'Large language model (LLM)' },
  { id: BaseModels.Project.ClassifyStrategy.VF_NLU, label: 'Natural language understanding (NLU)' },
];

const NLUSettings: React.FC = () => {
  const hybridClassifyEnabled = useFeature(FeatureFlag.HYBRID_CLASSIFY).isEnabled;
  const intentClassificationEnabled = useFeature(FeatureFlag.INTENT_CLASSIFICATION).isEnabled;

  const updateNLUSettings = useDispatch(ProjectV2.updateProjectNLUSettings);
  const nluSettings = useSelector(ProjectV2.active.nluSettings);
  const projectID = useSelector(ProjectV2.active.idSelector)!;

  const classifyStrategy = nluSettings?.classifyStrategy || BaseModels.Project.ClassifyStrategy.VF_NLU;
  const isNLUStrategy = classifyStrategy === BaseModels.Project.ClassifyStrategy.VF_NLU;

  return intentClassificationEnabled ? null : (
    <>
      {hybridClassifyEnabled && (
        <>
          <Settings.SubSection header="Intent Classification" splitView>
            <Settings.SubSection.RadioGroupContainer>
              <RadioGroup
                column
                options={CLASSIFY_OPTIONS}
                checked={classifyStrategy}
                onChange={(classifyStrategy) => updateNLUSettings(projectID, { classifyStrategy })}
                activeBar
              />
            </Settings.SubSection.RadioGroupContainer>
            <Settings.SubSection.RadioGroupDescription offset={isNLUStrategy}>
              {CLASSIFY_DESCRIPTIONS[classifyStrategy]} <System.Link.Anchor>Learn more</System.Link.Anchor>
            </Settings.SubSection.RadioGroupDescription>
          </Settings.SubSection>
          {isNLUStrategy && <SectionV2.Divider />}
        </>
      )}
      {isNLUStrategy && <IntentConfidence />}
    </>
  );
};

export default NLUSettings;
