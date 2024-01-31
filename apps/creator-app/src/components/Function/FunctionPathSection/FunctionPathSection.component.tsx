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
  const hasPaths = !!functionPaths.length;

  return (
    <>
      <Box pt={11} pb={hasPaths ? 0 : 11}>
        <Section.Header.Container
          variant={hasPaths ? 'active' : 'basic'}
          title={title}
          onHeaderClick={hasPaths ? undefined : onFunctionPathAdd}
          testID="function__paths"
        >
          <Section.Header.Button iconName="Plus" onClick={stopPropagation(onFunctionPathAdd)} testID="function__paths" />
        </Section.Header.Container>
      </Box>

      {hasPaths && (
        <Box pb={10} direction="column">
          {functionPaths.map((functionPath, index) => (
            <CMSFormListItem pt={9} pb={7} key={index} onRemove={() => onDeleteFunctionPath(functionPath.id)} testID="function__paths__list-item">
              <FunctionResourceInput
                value={functionPath.name}
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
