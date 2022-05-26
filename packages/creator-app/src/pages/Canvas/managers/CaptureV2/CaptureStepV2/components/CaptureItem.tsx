import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation, Text } from '@voiceflow/ui';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { HSLShades } from '@/constants';
import ListItem from '@/pages/Canvas/components/NoMatchAndNoReplyStepCopyList/components/Item';
import ListContainer from '@/pages/Canvas/components/NoMatchAndNoReplyStepCopyList/components/ListContainer';
import { Attachment, Item } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../../constants';

export interface CaptureItemProps {
  slot?: Realtime.IntentSlot & { slot?: Realtime.Slot };
  label?: React.ReactNode;
  isLast: boolean;
  isFirst: boolean;
  nextPortID: string;
  palette: HSLShades;
}

export const CaptureItem: React.FC<CaptureItemProps> = ({ slot, label, isFirst, isLast, nextPortID = null, palette }) => {
  const icon = isFirst ? NODE_CONFIG.icon : null;
  const portID = isLast ? nextPortID : null;

  const name = slot?.slot?.name;
  const prompt = slot?.dialog.prompt[0] as any;
  const content = React.useMemo<string | null>(() => (prompt?.content && SlateEditorAPI.serialize(prompt.content)) || prompt?.text || null, [prompt]);

  if (!slot?.id || !slot?.slot) {
    return (
      <Item
        icon={icon}
        iconColor={palette[600]}
        portID={portID}
        palette={palette}
        wordBreak
        withNewLines
        placeholder="Select entity to capture"
        label={label}
      />
    );
  }

  return (
    <Popper
      placement="right"
      renderContent={({ onClose }) => (
        <ListContainer>
          <ListItem label="Entity Reprompt" onClick={onClose}>
            {content}
          </ListItem>
        </ListContainer>
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Item
          icon={icon}
          iconColor={palette[700]}
          palette={palette}
          label={
            name ? (
              <>
                Capture <Text style={{ wordBreak: 'keep-all' }}>{`{${name}}`}</Text>
              </>
            ) : (
              ''
            )
          }
          portID={portID}
          wordBreak
          withNewLines
          attachment={content && <Attachment ref={ref} icon="noMatch" isActive={isOpened} onClick={stopPropagation(onToggle)} />}
        />
      )}
    </Popper>
  );
};

export default CaptureItem;
