import React from 'react';

import IntentForm, { HelpTooltip, LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import OverflowMenu from '@/componentsV2/OverflowMenu';
import Section from '@/componentsV2/Section';
import { NamespaceProvider } from '@/contexts';
import * as Intent from '@/ducks/intent';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { Content, Controls } from '@/pages/Canvas/components/Editor';

import CanFulfillForm from './components/canfulfill';

const DEFAULT_INTENT = {
  id: '',
  inputs: [],
  name: '',
  platform: '',
  slots: {},
};

function IntentEditor({ intent, data, platform, onChange, pushToPath }) {
  const updatePlatform = React.useCallback(
    (payload) => {
      onChange({
        ...data,
        [platform]: {
          ...data[platform],
          ...payload,
        },
      });
    },
    [data, onChange, platform]
  );

  return (
    <Content
      footer={() => (
        /* TODO: bulk import */
        <Controls
          menu={null && <OverflowMenu placement="top-end" options={[{ label: 'Bulk import utterances' }]} />}
          tutorial={{ content: <HelpTooltip />, blockType: data.type }}
        />
      )}
    >
      <Section>
        <IntentSelect intent={intent} onChange={updatePlatform} />
      </Section>
      <NamespaceProvider value={['intent', intent?.id]}>
        <IntentForm intent={intent} pushToPath={pushToPath} />
      </NamespaceProvider>
      <LegacyMappings intent={intent} mappings={data[platform].mappings} onDelete={() => updatePlatform({ mappings: [] })} />
      <CanFulfillForm intentID={intent?.id} />
    </Content>
  );
}

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  getIntentByID: Intent.platformIntentByIDSelector,
};

const mergeProps = ({ platform, getIntentByID }, _, { data }) => ({
  intent: data[platform].intent ? getIntentByID(data[platform].intent) : DEFAULT_INTENT,
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(IntentEditor);
