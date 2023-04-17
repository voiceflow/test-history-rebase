import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { PromptRef } from '@/components/Prompt/types';
import { MapManagedSimpleAPI, useMapManager } from '@/hooks/mapManager';
import { useActiveProjectTypeConfig } from '@/hooks/platformConfig';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { ListItem, VoiceAddButton } from './components';

interface ChildrenRendererProps {
  isEmpty: boolean;
  mapManager: MapManagedSimpleAPI<Platform.Base.Models.Prompt.Model>;
}

interface PromptsSectionProps {
  title: string;
  active?: boolean;
  prompts: Array<Platform.Base.Models.Prompt.Model>;
  onChange: (prompts: Array<Platform.Base.Models.Prompt.Model>) => Promise<void>;
  minItems?: number;
  children?: React.ReactNode | ((options: ChildrenRendererProps) => React.ReactNode);
  maxItems?: number;
  readOnly?: boolean;
  voiceMulti?: boolean;
  dynamicPlaceholder?: (index: number) => string;
}

export interface PromptsSectionRef {
  getCurrentValues: <T extends Platform.Base.Models.Prompt.Model>() => T[];
}

const PromptsSection = React.forwardRef<PromptsSectionRef, PromptsSectionProps>(
  ({ title, active = true, prompts, minItems, maxItems, onChange, children, readOnly, voiceMulti, dynamicPlaceholder }, ref) => {
    const editor = EditorV2.useEditor();
    const projectConfig = useActiveProjectTypeConfig();
    const [isEmpty, setIsEmpty] = React.useState(() => !prompts.length || prompts.every(projectConfig.utils.prompt.isEmpty));
    const listItemRefs = React.useRef<Record<number, PromptRef | null>>({});

    const mapManager = useMapManager(prompts, onChange, {
      getKey: (item) => item.id,
      minItems,
      maxItems,
    });

    const onListItemEmpty = (index: number) => (isEmpty: boolean) => {
      setIsEmpty(prompts.every((prompt, promptIndex) => (index === promptIndex ? isEmpty : projectConfig.utils.prompt.isEmpty(prompt))));
    };

    const onListItemRef = (index: number) => (ref: PromptRef | null) => {
      listItemRefs.current[index] = ref;
    };

    const isChat = Realtime.Utils.typeGuards.isChatProjectType(editor.projectType);
    const hasPrompts = active && !!mapManager.size;

    const childrenElm = typeof children === 'function' ? children({ isEmpty, mapManager }) : children;

    React.useImperativeHandle(
      ref,
      () => ({
        getCurrentValues: <T extends Platform.Base.Models.Prompt.Model>() =>
          Object.values(listItemRefs.current)
            .map((ref) => ref?.getCurrentValue())
            .filter(Utils.array.isNotNullish) as T[],
      }),
      []
    );

    return (
      <SectionV2.ActionListSection
        title={<SectionV2.Title bold={hasPrompts || !!childrenElm}>{title}</SectionV2.Title>}
        action={
          isChat ? (
            <SectionV2.AddButton
              onClick={() => mapManager.onAdd(Platform.Common.Chat.CONFIG.utils.prompt.factory())}
              disabled={mapManager.isMaxReached}
            />
          ) : (
            <VoiceAddButton items={mapManager.items} multi={voiceMulti} onAdd={mapManager.onAdd} disabled={mapManager.isMaxReached} />
          )
        }
        sticky
        contentProps={{ bottomOffset: !hasPrompts && !childrenElm ? 0 : 2.5 }}
      >
        {hasPrompts &&
          mapManager.map((item, { key, index, isLast, onUpdate, onRemove }) => (
            <Box key={key} pb={isLast ? 0 : 16}>
              <ListItem
                ref={onListItemRef(index)}
                message={item}
                onEmpty={onListItemEmpty(index)}
                onChange={onUpdate}
                onRemove={mapManager.isMinReached ? undefined : onRemove}
                readOnly={readOnly}
                autoFocus={key === mapManager.latestCreatedKey}
                placeholder={dynamicPlaceholder?.(index)}
              />
            </Box>
          ))}

        {childrenElm}
      </SectionV2.ActionListSection>
    );
  }
);

export default PromptsSection;
