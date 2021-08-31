import { Node } from '@voiceflow/base-types';
import { Badge, Input, SvgIcon, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import IntentForm from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import { CheckboxGroup, CheckboxOption } from '@/components/RadioGroup';
import Section, { SectionToggleVariant } from '@/components/Section';
import { NamespaceProvider } from '@/contexts';
import * as Intent from '@/ducks/intent';
import { useLinkedState, useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ListItemComponentProps } from '@/pages/Canvas/components/ListEditorContent';
import { getTargetValue } from '@/utils/dom';
import { compose } from '@/utils/functional';
import { getValidHref, isURL } from '@/utils/string';

import HelpTooltip from './HelpTooltip';

export type ButtonsListItemProps = ListItemComponentProps<Node.Buttons.Button, { pushToPath: (path: { type: string; label: string }) => void }>;

const BUTTON_ACTIONS: CheckboxOption<Node.Buttons.ButtonAction>[] = [
  { id: Node.Buttons.ButtonAction.PATH, label: 'Path' },
  { id: Node.Buttons.ButtonAction.INTENT, label: 'Intent' },
  { id: Node.Buttons.ButtonAction.URL, label: 'URL' },
];

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
  const getIntentByID = useSelector(Intent.platformIntentByIDSelector);

  const [url, setUrl] = useLinkedState(item.url ?? '');
  const [name, setName] = useLinkedState(item.name);

  const isNew = latestCreatedKey === itemKey;
  const urlChecked = item.actions.includes(Node.Buttons.ButtonAction.URL);
  const intentChecked = item.actions.includes(Node.Buttons.ButtonAction.INTENT);
  const intent = intentChecked && item.intent ? getIntentByID(item.intent) : null;

  return (
    <EditorSection
      ref={ref}
      header={item.name || `Button ${index + 1}`}
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
            <Input
              value={name}
              onBlur={() => onUpdate({ name })}
              onChange={getTargetValue(setName)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={isNew}
              placeholder="Enter button text"
            />
          </FormControl>

          <FormControl label="Button Action" tooltip={<HelpTooltip />} contentBottomUnits={intentChecked || urlChecked ? 0 : 2.5}>
            <CheckboxGroup isFlat options={BUTTON_ACTIONS} checked={item.actions} onChange={(actions) => onUpdate({ actions })} />
          </FormControl>

          {urlChecked && (
            <Section isNested dividers={intentChecked} isDividerNested isDividerBottom>
              <Input
                value={url}
                onBlur={() => (!url || isURL(url) ? onUpdate({ url }) : toast.error('URL is not valid, please enter valid link'))}
                onChange={getTargetValue(setUrl)}
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

          {intentChecked && (
            <>
              <Section isNested dividers={false}>
                <IntentSelect intent={intent} onChange={({ intent }: { intent: string }) => onUpdate({ intent })} />
              </Section>

              <NamespaceProvider value={['intent', intent?.id ?? 'new']}>
                <IntentForm intent={intent} pushToPath={pushToPath} isNested />
              </NamespaceProvider>
            </>
          )}
        </>
      )}
    </EditorSection>
  );
};

export default compose(React.memo, React.forwardRef)(ButtonsListItem);
