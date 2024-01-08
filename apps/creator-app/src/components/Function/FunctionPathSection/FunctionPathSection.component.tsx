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
  return (
    <Box py={11} direction="column">
      <Section.Header.Container title={title} variant={functionPaths?.length ? 'active' : 'basic'}>
        <Section.Header.Button iconName="Plus" onClick={() => onFunctionPathAdd()} />
      </Section.Header.Container>

      {functionPaths?.map((functionPath, index) => (
        <CMSFormListItem mb={10} key={index} onRemove={() => onDeleteFunctionPath(functionPath.id)}>
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
  );
};
