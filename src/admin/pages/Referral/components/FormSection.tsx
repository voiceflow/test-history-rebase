import React from 'react';
import { Col, FormGroup, Label } from 'reactstrap';

import Box, { Flex } from '@/components/Box';
import SvgIcon from '@/components/SvgIcon';
import Tooltip from '@/components/TippyTooltip';

export type FormSectionProps = {
  labelFor: string;
  label: string;
  mandatory?: boolean;
  optional?: boolean;
  tooltip?: string;
};

const FormSection: React.FC<FormSectionProps> = ({ label, labelFor, mandatory = false, optional = false, tooltip, children }) => {
  return (
    <FormGroup row>
      <Label for={labelFor} sm={2}>
        <Flex>
          {label}
          {mandatory && ' (Required)'}
          {optional && ' (Optional)'}
          {tooltip && (
            <Tooltip title={tooltip}>
              <Box ml={8}>
                <SvgIcon icon="info" size={12} color="#6E849A" />
              </Box>
            </Tooltip>
          )}
        </Flex>
      </Label>
      <Col sm={10}>{children}</Col>
    </FormGroup>
  );
};

export default FormSection;
