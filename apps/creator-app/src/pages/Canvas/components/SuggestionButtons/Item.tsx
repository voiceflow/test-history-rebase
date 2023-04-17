import { BaseButton } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { Badge, Box, UIOnlyMenuItemOption } from '@voiceflow/ui';
import numberToWords from 'number-to-words/src';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import IntentSelect from '@/components/IntentSelect';
import { SectionToggleVariant } from '@/components/Section';
import VariablesInput, { VariablesInputRef } from '@/components/VariablesInput';
import * as IntentV2 from '@/ducks/intentV2';
import { useActiveProjectPlatform, useSelector, useSetup } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { getPlatformValue } from '@/utils/platform';
import { transformVariablesToReadable } from '@/utils/slot';
import { isGooglePlatform } from '@/utils/typeGuards';

export type ItemProps = ItemComponentProps<BaseButton.IntentButton> &
  MappedItemComponentHandlers<BaseButton.IntentButton> &
  DragPreviewComponentProps & {
    isOnlyItem: boolean;
    dividedIntents: Array<Platform.Base.Models.Intent.Model | UIOnlyMenuItemOption>;
    latestCreatedKey?: string;
    formControlProps?: { contentBottomUnits?: number };
  };

const Item: React.ForwardRefRenderFunction<HTMLElement, ItemProps> = (
  {
    item,
    index,
    itemKey,
    onUpdate,
    isOnlyItem,
    isDragging,
    onContextMenu,
    dividedIntents,
    formControlProps,
    latestCreatedKey,
    connectedDragRef,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: item.payload.intentID });

  const isNew = latestCreatedKey === itemKey;
  const platform = useActiveProjectPlatform();
  const variablesInputRef = React.useRef<VariablesInputRef>(null);
  const updateName = React.useCallback(({ text: name }: { text: string }) => onUpdate({ name }), [onUpdate]);
  const updateIntent = React.useCallback(({ intent }: { intent: string | null }) => onUpdate({ payload: { intentID: intent } }), [onUpdate]);

  useSetup(() => {
    if (isNew || isOnlyItem) {
      requestAnimationFrame(() => {
        variablesInputRef.current?.focus();
      });
    }
  });

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <EditorSection
      ref={ref as React.RefObject<HTMLDivElement>}
      header={
        transformVariablesToReadable(item.name) ||
        `${getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chip' }, 'Button')} ${numberToWords.toWords(index + 1)}`
      }
      prefix={<Badge>{index + 1}</Badge>}
      headerRef={connectedDragRef}
      namespace={['buttonItem', itemKey]}
      isDragging={isDragging}
      initialOpen={isNew || isOnlyItem}
      headerToggle
      onContextMenu={onContextMenu}
      collapseVariant={!isDragging && !isDraggingPreview ? SectionToggleVariant.ARROW : null}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isContextMenuOpen}
    >
      {isDragging || isDraggingPreview ? null : (
        <FormControl {...formControlProps}>
          <Box mb={isGooglePlatform(platform) ? 0 : 16}>
            <VariablesInput
              ref={variablesInputRef}
              value={item.name}
              onBlur={updateName}
              placeholder={`Enter ${getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'chip' }, 'button')} name`}
            />
          </Box>

          {!isGooglePlatform(platform) && (
            <IntentSelect
              icon="user"
              intent={intent}
              options={dividedIntents}
              onChange={updateIntent}
              clearable
              iconProps={{ color: '#5589eb' }}
              creatable={false}
              placeholder="Behave as user triggered intent"
            />
          )}
        </FormControl>
      )}
    </EditorSection>
  );
};

export default React.forwardRef(Item);
