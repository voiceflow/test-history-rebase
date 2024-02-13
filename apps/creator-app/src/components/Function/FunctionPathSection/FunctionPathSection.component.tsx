import { tid } from '@voiceflow/style';
import { Box, Section } from '@voiceflow/ui-next';
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
}) => {
  const TEST_ID = tid('function', 'paths');

  const hasPaths = !!functionPaths.length;

  return (
    <>
      <Box pt={11} pb={hasPaths ? 0 : 11}>
        <Section.Header.Container
          testID={tid(TEST_ID, 'header')}
          title={title}
          variant={hasPaths ? 'active' : 'basic'}
          onHeaderClick={hasPaths ? undefined : onFunctionPathAdd}
        >
          <Section.Header.Button iconName="Plus" onClick={stopPropagation(onFunctionPathAdd)} testID={tid(TEST_ID, 'add')} />
        </Section.Header.Container>
      </Box>

      {hasPaths && (
        <Box pb={10} direction="column">
          {functionPaths.map((functionPath, index) => (
            <CMSFormListItem pt={9} pb={7} key={index} onRemove={() => onDeleteFunctionPath(functionPath.id)} testID={tid(TEST_ID, 'list-item')}>
              <FunctionResourceInput
                value={functionPath.name}
                testID={tid('function', 'path')}
                autoFocus={functionPath.id === autoFocusKey}
                description={functionPath.label || ''}
                onValueChange={(name) => onFunctionPathChange(functionPath.id, { name })}
                namePlaceholder="Enter return value to activate path"
                onDescriptionChange={(label) => onFunctionPathChange(functionPath.id, { label })}
                descriptionPlaceholder="Add on-canvas label (optional)"
              />
            </CMSFormListItem>
          ))}
        </Box>
      )}
    </>
  );
};
