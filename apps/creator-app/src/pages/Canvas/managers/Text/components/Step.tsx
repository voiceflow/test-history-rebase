import { BaseModels, BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { serializeToMarkdown } from '@voiceflow/slate-serializer/markdown';
import { serializeToText } from '@voiceflow/slate-serializer/text';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { Markdown } from '@/components/Markdown/Markdown.component';
import { SlateEditorAPI } from '@/components/SlateEditable';
import Step, { Item, Section, StepButton } from '@/pages/Canvas/components/Step';
import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import StepPreview from './StepPreview';
import type { StepItem } from './types';

const TextStep: ConnectedStep<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = ({
  ports,
  data,
  palette,
  engine,
}) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const items = React.useMemo(
    () =>
      data.texts.map<StepItem>(({ id, content }) => ({
        id,
        text: serializeToText(content, { variablesMap: entitiesAndVariables.byKey }),
        content: SlateEditorAPI.isNewState(content) ? (
          ''
        ) : (
          <Markdown>{serializeToMarkdown(content, { variablesMap: entitiesAndVariables.byKey })}</Markdown>
        ),
      })),
    [data.texts, entitiesAndVariables.byKey]
  );

  const itemsWithContent = React.useMemo(() => items.filter((item) => item.text), [items]);

  const nextPortID = ports.out.builtIn[BaseModels.PortType.NEXT];

  return (
    <Step nodeID={data.nodeID}>
      <Section v2>
        {data.canvasVisibility === BaseNode.Utils.CanvasNodeVisibility.ALL_VARIANTS ? (
          items.map(({ id, content }, index) => (
            <Item
              v2
              key={id}
              label={content}
              portID={index === items.length - 1 ? nextPortID : null}
              palette={palette}
              placeholder="Add text reply"
              multilineLabel
              labelLineClamp={100}
            />
          ))
        ) : (
          <Item
            v2
            label={items[0]?.content}
            portID={nextPortID}
            palette={palette}
            placeholder="Enter text reply"
            multilineLabel
            labelLineClamp={100}
            newLineAttachment={
              itemsWithContent.length > 1 && (
                <Popper
                  placement="right-start"
                  renderContent={({ onClose }) => (
                    <StepPreview onClose={onClose} onOpenEditor={() => engine.setActive(data.nodeID)} items={items} />
                  )}
                >
                  {({ onToggle, ref, isOpened }) => (
                    <StepButton
                      ref={ref}
                      icon="randomV2"
                      style={{ marginTop: 0, marginBottom: 0 }}
                      onClick={stopPropagation(onToggle)}
                      isActive={isOpened}
                    />
                  )}
                </Popper>
              )
            }
          />
        )}
      </Section>
    </Step>
  );
};

export default TextStep;
