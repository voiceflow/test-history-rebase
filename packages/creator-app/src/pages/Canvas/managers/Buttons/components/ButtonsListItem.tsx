import { Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, BoxFlex, Input, Link, SvgIcon, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import DividerLine from '@/components/DividerLine';
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
import { useFeature, useLinkedState, useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ListItemComponentProps } from '@/pages/Canvas/components/ListEditorContent';
import { withTargetValue } from '@/utils/dom';
import { transformVariablesToReadable } from '@/utils/slot';
import { getValidHref, isAnyLink } from '@/utils/string';

import { BUTTON_OPTIONS, ButtonAction } from '../constants';
import HelpTooltip from './HelpTooltip';

const IntentSelectComponent = IntentSelect as React.FC<any>;
const VariablesInputComponent = VariablesInput as React.FC<any>;

export type ButtonsListItemProps = ListItemComponentProps<
  Node.Buttons.Button,
  {
    pushToPath: (path: { type: string; label: string }) => void;
    openIntents: Realtime.Intent[];
  }
>;

const ButtonsListItem: React.ForwardRefRenderFunction<HTMLDivElement, ButtonsListItemProps> = (
  {
    item,
    index,
    itemKey,
    onUpdate,
    isOnlyItem,
    isDragging,
    pushToPath,
    openIntents,
    onContextMenu,
    latestCreatedKey,
    connectedDragRef,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const getIntentByID = useSelector(IntentV2.getPlatformIntentByIDSelector);

  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const [url, setUrl] = useLinkedState(item.url ?? '');

  const isNew = latestCreatedKey === itemKey;
  const urlChecked = item.actions.includes(Node.Buttons.ButtonAction.URL);
  const isPathChecked = item.actions.includes(Node.Buttons.ButtonAction.PATH);
  const isIntentChecked = item.actions.includes(Node.Buttons.ButtonAction.INTENT);
  const isGoToIntent = isIntentChecked && !isPathChecked;

  const checkedOption = isGoToIntent ? ButtonAction.GO_TO_INTENT : ButtonAction.FOLLOW_PATH;
  const intent = item.intent ? getIntentByID(item.intent) : null;

  const onUpdateButtonAction = (action: ButtonAction) => {
    let nextActions = item.actions;

    if (action === ButtonAction.GO_TO_INTENT) {
      nextActions = Utils.array.withoutValue(nextActions, Node.Buttons.ButtonAction.PATH);
    } else {
      nextActions = [...nextActions, Node.Buttons.ButtonAction.PATH];
    }

    onUpdate({ intent: null, actions: Utils.array.unique([...nextActions, Node.Buttons.ButtonAction.INTENT]) });
  };

  const onToggleURL = () => {
    const nextActions = urlChecked
      ? Utils.array.withoutValue(item.actions, Node.Buttons.ButtonAction.URL)
      : [...item.actions, Node.Buttons.ButtonAction.URL];

    onUpdate({ actions: nextActions });
  };

  return (
    <EditorSection
      ref={ref}
      header={transformVariablesToReadable(item.name) || `Button ${index + 1}`}
      prefix={<Badge>{index + 1}</Badge>}
      headerRef={connectedDragRef}
      namespace={['buttonsListItem', item.id]}
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
            <VariablesInputComponent
              value={item.name}
              onBlur={({ text }: { text: string }) => onUpdate({ name: text.trim() })}
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
              <Input
                value={url}
                onBlur={() => (!url || isAnyLink(url) ? onUpdate({ url }) : toast.error('URL is not valid, please enter valid link'))}
                onChange={withTargetValue(setUrl)}
                placeholder="Enter URL"
                rightAction={
                  url ? (
                    <TippyTooltip title="Open link in new tab">
                      <SvgIcon icon="openLink" color="#6e849a" clickable onClick={() => window.open(getValidHref(url), '_blank')} />
                    </TippyTooltip>
                  ) : (
                    <></> // needs this to do not rerender nested input
                  )
                }
              />
            </Section>
          )}

          <Section isNested dividers={false}>
            <IntentSelectComponent
              intent={intent}
              intents={isGoToIntent && topicsAndComponents.isEnabled && isTopicsAndComponentsVersion ? openIntents : undefined}
              onChange={({ intent }: { intent: string }) => onUpdate({ intent })}
              clearable={isGoToIntent}
              creatable={!isGoToIntent}
              placeholder={isGoToIntent ? 'Behave as user triggered intent' : 'Attach intent to path (optional)'}
              renderEmpty={
                isGoToIntent
                  ? ({ close, search }: { search: string; close: VoidFunction }) => (
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
