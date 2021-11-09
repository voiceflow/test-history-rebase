import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import { useFeature, useSelector } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { HelpMessage, HelpTooltip } from '@/pages/Canvas/managers/Command/components';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { PlatformContext } from '@/pages/Project/contexts';
import { isPlatformWithInvocationName } from '@/utils/typeGuards';

import { InvocationNameSection, StartLabelSection } from './components';
import { COMMANDS_PATH_TYPE } from './constants';

const StartEditor: NodeEditor<Realtime.NodeData.Start> = ({ data, onChange, pushToPath }) => {
  const platform = React.useContext(PlatformContext)!;
  const isRootDiagram = useSelector(Creator.isRootDiagramActiveSelector);
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);

  const componentDefaultLabel = topicsAndComponents.isEnabled ? 'Component starts here' : 'Conversation continues here';

  return (
    <Content>
      {isRootDiagram && isPlatformWithInvocationName(platform) ? (
        <InvocationNameSection />
      ) : (
        <StartLabelSection
          label={data.label || (isRootDiagram ? 'Project starts here' : componentDefaultLabel)}
          onChangeLabel={(label) => onChange({ label })}
        />
      )}

      <EditorSection
        header="Commands"
        isLink
        tooltip={<HelpTooltip />}
        onClick={() => pushToPath?.({ type: COMMANDS_PATH_TYPE, label: 'Commands' })}
        dividers
        tooltipProps={{ title: 'Commands Tutorial', helpMessage: <HelpMessage /> }}
        headerVariant={HeaderVariant.LINK}
      />
    </Content>
  );
};

export default StartEditor;
