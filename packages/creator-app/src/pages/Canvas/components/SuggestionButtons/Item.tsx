import { IntentButton } from '@voiceflow/general-types';
import numberToWords from 'number-to-words/src';
import React from 'react';

import Badge from '@/components/Badge';
import Box from '@/components/Box';
import { DragPreviewComponentProps, ItemComponentProps, MappedItemComponentHandlers } from '@/components/DraggableList';
import IntentSelect from '@/components/IntentSelect';
import { SectionToggleVariant } from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import { PlatformType } from '@/constants';
import * as IntentDuck from '@/ducks/intent';
import { connect } from '@/hocs';
import { useSetup } from '@/hooks';
import { Intent } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { PlatformContext } from '@/pages/Skill/contexts';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';
import { getPlatformValue } from '@/utils/platform';
import { transformVariablesToReadable } from '@/utils/slot';
import { isGooglePlatform } from '@/utils/typeGuards';

const AnyIntentSelect: React.FC<any> = IntentSelect;
const VariablesInputComponent: React.FC<any> = VariablesInput;

export type ItemProps = ItemComponentProps<IntentButton> &
  MappedItemComponentHandlers<IntentButton> &
  DragPreviewComponentProps & {
    isOnlyItem: boolean;
    dividedIntents: (Intent | { id: string; name: string; menuItemProps: { divider: boolean } })[];
    latestCreatedKey?: string;
    formControlProps?: { contentBottomUnits?: number };
  };

const Item: React.ForwardRefRenderFunction<HTMLDivElement, ItemProps & ConnectedItemProps> = (
  {
    item,
    index,
    intent,
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
  const isNew = latestCreatedKey === itemKey;
  const platform = React.useContext(PlatformContext)!;
  const variablesInputRef = React.useRef<{ focus: () => void }>(null);
  const updateName = React.useCallback(({ text: name }: { text: string }) => onUpdate({ name }), [onUpdate]);
  const updateIntent = React.useCallback(({ intent }: { intent: string | null }) => onUpdate({ payload: { intentID: intent } }), [onUpdate]);

  useSetup(() => {
    if (isNew || isOnlyItem) {
      requestAnimationFrame(() => {
        variablesInputRef.current?.focus();
      });
    }
  });

  return (
    <EditorSection
      ref={ref}
      header={
        transformVariablesToReadable(item.name) ||
        `${getPlatformValue(platform, { [PlatformType.GOOGLE]: 'Chip' }, 'Button')} ${numberToWords.toWords(index + 1)}`
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
            <VariablesInputComponent
              ref={variablesInputRef}
              value={item.name}
              onBlur={updateName}
              placeholder={`Enter ${getPlatformValue(platform, { [PlatformType.GOOGLE]: 'chip' }, 'button')} name`}
            />
          </Box>

          {!isGooglePlatform(platform) && (
            <AnyIntentSelect
              icon="user"
              intent={intent}
              intents={dividedIntents}
              clearable={false}
              onChange={updateIntent}
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

const mapStateToProps = {
  intent: IntentDuck.platformIntentByIDSelector,
};

const mergeProps = (...[{ intent: getIntentByID }, , { item }]: MergeArguments<typeof mapStateToProps, {}, ItemProps>) => {
  return {
    intent: item.payload.intentID ? getIntentByID(item.payload.intentID) : null,
  };
};

type ConnectedItemProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default compose(connect(mapStateToProps, null, mergeProps, { forwardRef: true }), React.forwardRef)(Item) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<ItemProps> & React.RefAttributes<HTMLElement>
>;
