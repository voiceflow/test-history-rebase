import composeRef from '@seznam/compose-react-refs';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { OverflowText, SectionV2, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import type {
  DragPreviewComponentProps,
  ItemComponentProps,
  MappedItemComponentHandlers,
} from '@/components/DraggableList';
import { SlateTextInput } from '@/components/SlateInputs';
import VariablesInput from '@/components/VariablesInput';
import { Diagram } from '@/ducks';
import { useActiveProjectTypeConfig, useAutoScrollNodeIntoView } from '@/hooks';
import { useImageDimensions } from '@/hooks/file.hook';
import { useSelector } from '@/hooks/store.hook';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { transformVariablesToReadable } from '@/utils/slot';
import { isDialogflowPlatform } from '@/utils/typeGuards';

import Buttons from './Buttons';

export interface CarouselStepDraggableCardrops
  extends ItemComponentProps<Realtime.NodeData.Carousel.Card>,
    DragPreviewComponentProps,
    MappedItemComponentHandlers<Realtime.NodeData.Carousel.Card> {
  editor: NodeEditorV2Props<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts>;
  latestCreatedKey: string | undefined;
}

const CarouselStepDraggableCard: React.ForwardRefRenderFunction<HTMLElement, CarouselStepDraggableCardrops> = (
  {
    item,
    index,
    editor,
    itemKey,
    onUpdate,
    isDragging,
    onContextMenu,
    connectedDragRef,
    latestCreatedKey,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const dimensions = useImageDimensions({ url: item.imageUrl });
  const autofocus = latestCreatedKey === itemKey || editor.data.cards.length === 1;
  const [sectionRef, scrollIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({
    condition: autofocus,
    options: { block: 'end' },
  });
  const isDF = isDialogflowPlatform(editor.platform);
  const config = useActiveProjectTypeConfig();
  const entitiesAndVariables = useSelector(Diagram.active.allSlotsAndVariablesNormalizedSelector);

  const onChange =
    <Key extends keyof Realtime.NodeData.Carousel.Card>(field: Key) =>
    (value: Realtime.NodeData.Carousel.Card[Key]) =>
      onUpdate({
        [field]: value,
      });

  return (
    <EditorV2.PersistCollapse namespace={['cardItem', item.id]} defaultCollapsed={!autofocus}>
      {({ collapsed, onToggle }) => (
        <>
          {index !== 0 && !isDraggingPreview && <SectionV2.Divider />}

          <SectionV2.Sticky disabled={collapsed || isDragging || isDraggingPreview}>
            {({ sticked }) => (
              <SectionV2.CollapseSection
                ref={composeRef(ref, sectionRef) as React.Ref<HTMLDivElement>}
                header={
                  <SectionV2.Header
                    ref={connectedDragRef}
                    sticky
                    sticked={sticked && !collapsed && !isDraggingPreview && !isDragging}
                  >
                    <SectionV2.Title bold={!collapsed}>
                      <OverflowText>
                        {transformVariablesToReadable(item.title, entitiesAndVariables.byKey) || `Card ${index + 1}`}
                      </OverflowText>
                    </SectionV2.Title>

                    <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                  </SectionV2.Header>
                }
                onToggle={onToggle}
                onEntered={() => scrollIntoView({ block: 'nearest' })}
                collapsed={collapsed}
                isDragging={isDragging}
                onContextMenu={onContextMenu}
                containerToggle
                isDraggingPreview={isDraggingPreview}
                isContextMenuOpen={isContextMenuOpen}
              >
                {isDragging || isDraggingPreview ? null : (
                  <>
                    <SectionV2.Content topOffset={0.5} bottomOffset={3}>
                      <FormControl>
                        <UploadV2.Image
                          rootDropAreaProps={{ pb: '4px' }}
                          renderInput={VariablesInput.renderInput}
                          value={item.imageUrl}
                          onChange={onChange('imageUrl')}
                          ratio={dimensions?.ratio}
                        />
                      </FormControl>
                      <FormControl>
                        <VariablesInput
                          value={item.title}
                          placeholder="Enter card title, { to add variable"
                          onBlur={({ text }) => onChange('title')(text.trim())}
                        />
                      </FormControl>
                      <FormControl contentBottomUnits={0}>
                        <SlateTextInput
                          value={item.description}
                          onBlur={onChange('description')}
                          options={config.project.chat.toolbarOptions}
                          placeholder="Enter card description, { to add variable"
                        />
                      </FormControl>
                    </SectionV2.Content>
                    {!isDF && (
                      <>
                        <SectionV2.Divider inset />
                        <Buttons.Section buttons={item.buttons} cardID={item.id} editor={editor} onUpdate={onUpdate} />
                      </>
                    )}
                  </>
                )}
              </SectionV2.CollapseSection>
            )}
          </SectionV2.Sticky>
        </>
      )}
    </EditorV2.PersistCollapse>
  );
};

export default React.forwardRef(CarouselStepDraggableCard);
