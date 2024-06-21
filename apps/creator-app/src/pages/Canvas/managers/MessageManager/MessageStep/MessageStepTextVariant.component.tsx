import { markupToString } from '@realtime-sdk/adapters';
import { ResponseMessage } from '@voiceflow/dtos';
import { Popper, stopPropagation } from '@voiceflow/ui';
import { isMarkupEmpty } from '@voiceflow/utils-designer';
import React from 'react';

import { Markdown } from '@/components/Markdown/Markdown.component';
import { HSLShades } from '@/constants';
import { SlateCanvasPreviewWithVariables } from '@/pages/Canvas/components/Slate/SlateCanvasPreviewWithVariables';
import Step, { StepButton } from '@/pages/Canvas/components/Step';
import {
  ActiveDiagramNormalizedEntitiesAndVariablesContext,
  SlateVariablesMapByIDContext,
} from '@/pages/Canvas/contexts';
import { markupToSlate } from '@/utils/markup.util';

import StepPreview from '../../Text/components/StepPreview';
import { StepItem } from '../../Text/components/types';

export interface IResponseStepTextVariantProps {
  message: ResponseMessage;
  variants: ResponseMessage[];
  nextPortID?: string;
  palette: HSLShades;
  nodeID: string;
}

export const ResponseStepTextVariant = ({
  message,
  variants,
  nextPortID,
  palette,
  nodeID,
}: IResponseStepTextVariantProps) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;
  const entitiesAndVariablesMap = React.useContext(SlateVariablesMapByIDContext)!;
  const value = React.useMemo(() => markupToSlate.fromDB(message.text), [message.text]);

  const items = React.useMemo(
    () =>
      variants.map<StepItem>(({ id, text }) => ({
        id,
        text: markupToString.fromDB(text, { entitiesMapByID: entitiesAndVariablesMap }),
        content: <Markdown>{markupToString.fromDB(text, { entitiesMapByID: entitiesAndVariablesMap })}</Markdown>,
      })),
    [message, variants, entitiesAndVariables.byKey]
  );

  const itemsWithContent = React.useMemo(() => items.filter((item) => item.text), [items]);

  return (
    <Step nodeID={nodeID} dividerOffset={22}>
      <Step.Section v2>
        <Step.Item
          label={isMarkupEmpty(message.text) ? null : <SlateCanvasPreviewWithVariables value={value} />}
          placeholder="Enter agent says"
          portID={nextPortID}
          palette={palette}
          newLineAttachment={
            itemsWithContent.length > 1 && (
              <Popper
                placement="right-start"
                renderContent={({ onClose }) => (
                  <StepPreview onClose={onClose} onOpenEditor={() => null} items={itemsWithContent} />
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
          v2
        />
      </Step.Section>
    </Step>
  );
};
