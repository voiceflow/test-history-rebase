import { Box, Button, SectionV2, withTargetValue } from '@voiceflow/ui';
import React from 'react';

import TextArea from '@/components/TextArea';

import { INPUT_WIDTH } from '../constants';

interface CertificateFieldProps {
  editCertificate: boolean;
  certificate: string;
  onChange: (certificate: string) => void;
  onEditCertificate: VoidFunction;
}

const CertificateField: React.FC<CertificateFieldProps> = ({ editCertificate, certificate, onChange, onEditCertificate }) => {
  return (
    <SectionV2.SimpleSection>
      <Box.FlexAlignStart fullWidth>
        {editCertificate ? (
          <>
            <Box.FlexAlignStart width={INPUT_WIDTH} flexDirection="column">
              <Box mb={10}>
                <SectionV2.Title bold secondary>
                  X.509 Certificate
                </SectionV2.Title>
              </Box>

              <TextArea minRows={4} maxRows={4} value={certificate} placeholder="Paste X.509 certificate" onChange={withTargetValue(onChange)} />
            </Box.FlexAlignStart>

            <Box flex={1} ml={24} mt={25}>
              <SectionV2.Description secondary>Your valid X.509 Certificate from a certification authority.</SectionV2.Description>
            </Box>
          </>
        ) : (
          <>
            <Box.FlexAlignStart fullWidth flexDirection="column">
              <SectionV2.Title bold>X.509 Certificate</SectionV2.Title>

              <SectionV2.Description mt={4} block secondary>
                {certificate}
              </SectionV2.Description>
            </Box.FlexAlignStart>
            <Button onClick={onEditCertificate} variant={Button.Variant.SECONDARY}>
              Update
            </Button>
          </>
        )}
      </Box.FlexAlignStart>
    </SectionV2.SimpleSection>
  );
};

export default CertificateField;
