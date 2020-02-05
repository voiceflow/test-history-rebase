import React from 'react';

import IntentForm, { HelpTooltip as IntentTooltip, LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import Section from '@/componentsV2/Section';
import { withHeaderActions } from '@/containers/CanvasV2/components/EditSidebar/hocs';
import { Content, Controls } from '@/containers/CanvasV2/components/Editor/components';
import * as Diagram from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { compose } from '@/utils/functional';

import { Flow, HelpTooltip as FlowTooltip } from '../Flow/components';
import { HelpMessage, HelpTooltip } from './components';

function CommandEditor({ data, diagram, goToDiagram, platform, intent, onChange, pushToPath }) {
  const onChangeData = React.useCallback((payload) => onChange({ [platform]: { ...data[platform], ...payload } }), [onChange, platform, data]);

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
      <Section variant="tertiary" header="Flow" tooltip={<FlowTooltip />}>
        <Flow data={{ ...data, ...data[platform] }} diagram={diagram} onChange={onChangeData} isCommand />
      </Section>

      <Section variant="tertiary" header="Intent" tooltip={<IntentTooltip />}>
        <IntentSelect intent={intent} onChange={onChangeData} />
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
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  ),
  // TODO: remove this when duplicate functionality is implemented and we can use defaults
  withHeaderActions([
    {
      value: 'delete_block',
      label: 'Delete',
      onClick: ({ data, engine }) => engine.node.remove(data.nodeID),
    },
  ])
)(CommandEditor);
