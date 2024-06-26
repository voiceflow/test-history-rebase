import type { FunctionPath } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Section, SortableList } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { stopPropagation } from '@/utils/handler.util';

import { FunctionResourceInput } from '../FunctionResourceInput/FunctionResourceInput.component';
import type { IFunctionPathSection } from './FunctionPathSection.interface';

export const FunctionPathSection: React.FC<IFunctionPathSection> = ({
  title,
  autoFocusKey,
  functionPaths,
  onFunctionPathAdd,
  onDeleteFunctionPath,
  onFunctionPathChange,
  onFunctionPathReorder,
}) => {
  const TEST_ID = tid('function', 'paths');

  const hasPaths = !!functionPaths.length;

  return (
    <>
      <Section.Header.Container
        pt={11}
        pb={hasPaths ? 0 : 11}
        title={title}
        testID={tid(TEST_ID, 'header')}
        variant={hasPaths ? 'active' : 'basic'}
        onHeaderClick={hasPaths ? undefined : onFunctionPathAdd}
      >
        <Section.Header.Button
          iconName="Plus"
          onClick={stopPropagation(onFunctionPathAdd)}
          testID={tid(TEST_ID, 'add')}
        />
      </Section.Header.Container>

      {hasPaths && (
        <Box pb={10} direction="column">
          <SortableList
            items={functionPaths}
            getItemKey={(path) => path.id}
            onItemsReorder={(item: FunctionPath[]) => onFunctionPathReorder(item.map((a) => a.id))}
            renderItem={({ ref, item, dragContainerProps }) => (
              <CMSFormListItem
                ref={ref}
                pt={9}
                pb={7}
                key={item.id}
                onRemove={() => onDeleteFunctionPath(item.id)}
                testID={tid(TEST_ID, 'list-item')}
                {...dragContainerProps}
              >
                <FunctionResourceInput
                  value={item.name}
                  testID={tid('function', 'path')}
                  autoFocus={item.id === autoFocusKey}
                  description={item.label || ''}
                  onValueChange={(name) => onFunctionPathChange(item.id, { name })}
                  namePlaceholder="Enter return value to activate path"
                  onDescriptionChange={(label) => onFunctionPathChange(item.id, { label })}
                  descriptionPlaceholder="Add on-canvas label (optional)"
                />
              </CMSFormListItem>
            )}
          />
        </Box>
      )}
    </>
  );
};
