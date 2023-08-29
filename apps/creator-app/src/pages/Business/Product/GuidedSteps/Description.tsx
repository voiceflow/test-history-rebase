import { Box, Button, ButtonVariant, Label } from '@voiceflow/ui';
import React from 'react';

import TextInput from '@/components/Form/TextInput';
import TextArea from '@/components/TextArea';
import { useInputValue } from '@/hooks';

import { ProductContext } from '../../contexts';
import { NextButtonContainer } from './components';

export interface DescriptionFormProps {
  advanceStep: VoidFunction;
}

const DescriptionForm: React.FC<DescriptionFormProps> = ({ advanceStep }) => {
  const { product, setProductProperty } = React.useContext(ProductContext)!;

  const [name, setName, saveName] = useInputValue(product.name, setProductProperty('name'));
  const [summary, setSummary, saveSummary] = useInputValue(product.summary, setProductProperty('summary'));
  const [description, setDescription, saveDescription] = useInputValue(product.description, setProductProperty('description'));

  return (
    <Box>
      <Box mb={24}>
        <Label>Product Name</Label>
        <TextInput
          maxLength={50}
          name="name"
          placeholder="Enter a name for your product"
          value={name}
          onChange={setName}
          onBlur={saveName}
          required
          error="Name is required"
        />
      </Box>

      <Box mb={24}>
        <Label mt="1em">Short Description</Label>
        <TextInput
          name="summary"
          placeholder="Enter a short description for your product"
          value={summary}
          onChange={setSummary}
          onBlur={saveSummary}
          required
          error="Description is required"
        />
      </Box>

      <Box mb={24}>
        <Label mt="1em">Detailed Description</Label>
        <TextArea
          minRows={3}
          name="description"
          placeholder="Describe the products functionality and any prerequisites"
          value={description}
          onChange={setDescription}
          onBlur={saveDescription}
        />
      </Box>

      <NextButtonContainer>
        <Button variant={ButtonVariant.SECONDARY} onClick={advanceStep}>
          Next
        </Button>
      </NextButtonContainer>
    </Box>
  );
};

export default DescriptionForm;
