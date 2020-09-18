import React from 'react';

import IntentForm, { HelpTooltip as IntentTooltip, LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import Section, { SectionVariant } from '@/components/Section';
import * as Diagram from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { withHeaderActions } from '@/pages/Canvas/components/EditorSidebar/hocs';
import { compose } from '@/utils/functional';

import { Flow, HelpTooltip as FlowTooltip } from '../Flow/components';
import { HelpMessage, HelpTooltip } from './components';

function CommandEditor({ data, diagram, goToDiagram, platform, intent, onChange, pushToPath, diagramByID }) {
  const onChangeData = React.useCallback((payload) => onChange({ [platform]: { ...data[platform], ...payload } }), [onChange, platform, data]);
  const selectedFlowID = data[platform].diagramID;

  useDidUpdateEffect(() => {
    if (selectedFlowID) {
      const selectedFlow = diagramByID(selectedFlowID);
      if (selectedFlow.name) {
        onChange({ name: selectedFlow.name });
      }
    }
  }, [selectedFlowID]);

  return (
    <Content
      footer={
        <Controls
          options={[
            {
              label: 'Enter Flow',
              onClick: goToDiagram,
              variant: 'primary',
              disabled: !diagram,
            },
          ]}
          tutorial={{
            blockType: data.type,
            content: <HelpTooltip />,
            helpTitle: 'Having trouble?',
            helpMessage: <HelpMessage />,
          }}
          anchor="What are commands?"
        />
      }
    >
      <Section variant={SectionVariant.TERTIARY} header="Flow" tooltip={<FlowTooltip />}>
        <Flow data={{ ...data, ...data[platform] }} diagram={diagram} onChange={onChangeData} isCommand enterOnCreate={false} />
      </Section>

      <Section variant={SectionVariant.TERTIARY} header="Intent" tooltip={<IntentTooltip />}>
        <IntentSelect intent={intent} onChange={({ intent }) => onChangeData({ intent })} />
      </Section>
      <IntentForm intent={intent} pushToPath={pushToPath} />
      <LegacyMappings intent={intent} mappings={data[platform].mappings} onDelete={() => onChangeData({ mappings: [] })} />
    </Content>
  );
}

const mapStateToProps = {
  diagrams: Diagram.allDiagramsSelector,
  platform: Skill.activePlatformSelector,
  diagramByID: Diagram.diagramByIDSelector,
  getIntentByID: Intent.platformIntentByIDSelector,
};

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagram,
};

const mergeProps = ({ platform, getIntentByID, diagramByID }, { goToDiagram }, { data }) => {
  const platformData = data[platform];

  return {
    intent: platformData.intent && getIntentByID(platformData.intent),
    diagram: platformData.diagramID && diagramByID(platformData.diagramID),
    goToDiagram: () => goToDiagram(platformData.diagramID),
    diagramByID,
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  // TODO: remove this when duplicate functionality is implemented and we can use defaults
  withHeaderActions([
    {
      value: 'delete_block',
      label: 'Delete',
      onClick: ({ data, engine }) => engine.node.remove(data.nodeID),
    },
  ])
)(CommandEditor);
