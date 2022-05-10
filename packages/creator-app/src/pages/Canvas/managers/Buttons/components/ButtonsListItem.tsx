import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Badge, Box, BoxFlex, Link, preventDefault, SvgIcon, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import DividerLine from '@/components/DividerLine';
import GoToIntentSelect from '@/components/GoToIntentSelect';
import IntentForm from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant } from '@/components/Section';
import VariablesInput from '@/components/VariablesInput';
import * as Documentation from '@/config/documentation';
import { FeatureFlag } from '@/config/features';
import { NamespaceProvider } from '@/contexts';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { compose } from '@/hocs';
import { useFeature, useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ListItemComponentProps } from '@/pages/Canvas/components/ListEditorContent';
import { transformVariablesToReadable } from '@/utils/slot';
import { containsSlotOtVariable, getValidHref, isAnyLink } from '@/utils/string';

import { BUTTON_OPTIONS, ButtonAction } from '../constants';
import HelpTooltip from './HelpTooltip';

export type ButtonsListItemProps = ListItemComponentProps<BaseNode.Buttons.Button, { pushToPath: (path: { type: string; label: string }) => void }>;

const ButtonsListItem: React.ForwardRefRenderFunction<HTMLDivElement, ButtonsListItemProps> = (
  {
    item,
    index,
    itemKey,
    onUpdate,
    isOnlyItem,
    isDragging,
    pushToPath,
    onContextMenu,
    latestCreatedKey,
    connectedDragRef,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: item.intent });

  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const isNew = latestCreatedKey === itemKey;
  const urlChecked = item.actions.includes(BaseNode.Buttons.ButtonAction.URL);
  const isPathChecked = item.actions.includes(BaseNode.Buttons.ButtonAction.PATH);
  const isIntentChecked = item.actions.includes(BaseNode.Buttons.ButtonAction.INTENT);
  const isGoToIntent = isIntentChecked && !isPathChecked;

  const checkedOption = isGoToIntent ? ButtonAction.GO_TO_INTENT : ButtonAction.FOLLOW_PATH;

  const onUpdateButtonAction = (action: ButtonAction) => {
    let nextActions = item.actions;

    if (action === ButtonAction.GO_TO_INTENT) {
      nextActions = Utils.array.withoutValue(nextActions, BaseNode.Buttons.ButtonAction.PATH);
    } else {
      nextActions = [...nextActions, BaseNode.Buttons.ButtonAction.PATH];
    }

    onUpdate({ intent: null, actions: Utils.array.unique([...nextActions, BaseNode.Buttons.ButtonAction.INTENT]) });
  };

  const onToggleURL = () => {
    const nextActions = urlChecked
      ? Utils.array.withoutValue(item.actions, BaseNode.Buttons.ButtonAction.URL)
      : [...item.actions, BaseNode.Buttons.ButtonAction.URL];

    onUpdate({ actions: nextActions });
  };

  const { id, url, name } = item;

  return (
    <EditorSection
      ref={ref}
      header={transformVariablesToReadable(name) || `Button ${index + 1}`}
      prefix={<Badge>{index + 1}</Badge>}
      headerRef={connectedDragRef}
      namespace={['buttonsListItem', id]}
      isDragging={isDragging}
      initialOpen={isNew || isOnlyItem}
      headerToggle
      onContextMenu={onContextMenu}
      collapseVariant={!isDragging && !isDraggingPreview ? SectionToggleVariant.ARROW : null}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isContextMenuOpen}
    >
      {isDragging || isDraggingPreview ? null : (
        <>
          <FormControl contentBottomUnits={2.5}>
            <VariablesInput
              value={name}
              onBlur={({ text }) => onUpdate({ name: text.trim() })}
              fullWidth
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={isNew}
              placeholder="Enter button text"
            />
          </FormControl>

          <FormControl label="Button Action" tooltip={<HelpTooltip />} contentBottomUnits={0}>
            <BoxFlex>
              <RadioGroup options={BUTTON_OPTIONS} checked={checkedOption} onChange={onUpdateButtonAction} />

              <DividerLine isVertical height={18} offset={18} />

              <Checkbox isFlat checked={urlChecked} onChange={onToggleURL}>
                URL
              </Checkbox>
            </BoxFlex>
          </FormControl>

          {urlChecked && (
            <Section isNested isDividerNested isDividerBottom>
              <VariablesInput
                value={url ?? ''}
                onBlur={({ text }) =>
                  !text || containsSlotOtVariable(text) || isAnyLink(text)
                    ? onUpdate({ url: text })
                    : toast.error('URL is not valid, please enter valid link')
                }
                placeholder="Enter URL or Variable using '{'"
                rightAction={
                  url && isAnyLink(url) ? (
                    <TippyTooltip title="Open link in new tab">
                      <SvgIcon icon="openLink" color="#6e849a" clickable onClick={preventDefault(() => window.open(getValidHref(url), '_blank'))} />
                    </TippyTooltip>
                  ) : (
                    <></> // needs this to do not rerender nested input
                  )
                }
              />
            </Section>
          )}

          <Section isNested dividers={false}>
            {topicsAndComponents.isEnabled && isGoToIntent && isTopicsAndComponentsVersion ? (
              <GoToIntentSelect
                onChange={(data) => onUpdate({ intent: data?.intentID ?? null, diagramID: data?.diagramID ?? null })}
                intentID={item.intent}
                diagramID={item.diagramID}
                placeholder="Behave as user triggered intent"
              />
            ) : (
              <IntentSelect
                intent={intent}
                onChange={({ intent }) => onUpdate({ intent, diagramID: null })}
                clearable={isGoToIntent}
                creatable={!isGoToIntent}
                placeholder={isGoToIntent ? 'Behave as user triggered intent' : 'Attach intent to path (optional)'}
                renderEmpty={
                  isGoToIntent
                    ? ({ close, search }) => (
                        <Box flex={1} textAlign="center">
                          {!search ? 'No open intents exists in your project. ' : 'No open intents found. '}
                          <Link href={Documentation.OPEN_INTENT} onClick={close}>
                            Learn more
                          </Link>
                        </Box>
                      )
                    : undefined
                }
              />
            )}
          </Section>

          {!isGoToIntent && (
            <NamespaceProvider value={['intent', intent?.id ?? 'new']}>
              <IntentForm intent={intent} pushToPath={pushToPath} isNested />
            </NamespaceProvider>
          )}
        </>
      )}
    </EditorSection>
  );
};

export default compose(React.memo, React.forwardRef)(ButtonsListItem);
