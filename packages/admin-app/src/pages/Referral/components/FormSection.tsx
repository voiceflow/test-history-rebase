import { Box, BoxFlex, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';
import { Col, FormGroup, Label } from 'reactstrap';

export interface FormSectionProps {
  labelFor: string;
  label: string;
  mandatory?: boolean;
  optional?: boolean;
  tooltip?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ label, labelFor, mandatory = false, optional = false, tooltip, children }) => (
  <FormGroup row>
    <Label for={labelFor} sm={2}>
      <BoxFlex>
        {label}
        {mandatory && ' (Required)'}
        {optional && ' (Optional)'}
        {tooltip && (
          <TippyTooltip title={tooltip}>
            <Box ml={8}>
              <SvgIcon icon="info" size={12} color="#6E849A" />
            </Box>
          </TippyTooltip>
        )}
      </BoxFlex>
    </Label>
    <Col sm={10}>{children}</Col>
  </FormGroup>
);

export default FormSection;
