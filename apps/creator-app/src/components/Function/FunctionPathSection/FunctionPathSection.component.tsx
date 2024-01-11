import { Box, Section } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';

import { FunctionResourceInput } from '../FunctionResourceInput/FunctionResourceInput.component';
import type { IFunctionPathSection } from './FunctionPathSection.interface';

export const FunctionPathSection: React.FC<IFunctionPathSection> = ({
  title,
  functionPaths,
  onFunctionPathAdd,
  onDeleteFunctionPath,
  onFunctionPathChange,
}) => {
  const pathsSize = !!functionPaths?.length;
  return (
    <>
      <Box py={11} pb={pathsSize ? 0 : 11} direction="column">
        <Section.Header.Container onHeaderClick={pathsSize ? undefined : onFunctionPathAdd} variant={pathsSize ? 'active' : 'basic'} title={title}>
          <Section.Header.Button iconName="Plus" onClick={pathsSize ? onFunctionPathAdd : undefined} />
        </Section.Header.Container>
      </Box>

      {pathsSize && (
        <Box pb={10} direction="column">
          {functionPaths?.map((functionPath, index) => (
            <CMSFormListItem pt={9} pb={7} key={index} onRemove={() => onDeleteFunctionPath(functionPath.id)}>
              <FunctionResourceInput
                value={functionPath.name}
                description={functionPath.label || ''}
                onDescriptionChange={(label) => onFunctionPathChange(functionPath.id, { label })}
                onValueChange={(name) => onFunctionPathChange(functionPath.id, { name })}
                namePlaceholder="Enter return value to activate path"
                descriptionPlaceholder="Add on-canvas label (optional)"
              />
            </CMSFormListItem>
          ))}
        </Box>
      )}
    </>
  );
};
