import { FlexApart, FlexCenter, Text } from '@voiceflow/ui';
import React from 'react';

import ProjectSelectionFooter from './ProjectSelectionFooter';
import ProjectSelectionFooterLink from './ProjectSelectionFooterLink';

interface StageEmptyProps {
  description: string;
  footerSubmitText: string;
  onFooterClick: () => void;
}

const StageEmpty: React.FC<StageEmptyProps> = ({ onFooterClick, footerSubmitText, description }) => {
  return (
    <FlexApart style={{ height: '264px', flexDirection: 'column' }}>
      <FlexCenter fullWidth style={{ padding: '32px 32px 0 24px', alignItems: 'center', height: '100%' }}>
        <Text textAlign="center" mb={20} fontSize={15} lineHeight="22px" color="#132144">
          {description}.
        </Text>
      </FlexCenter>
      <ProjectSelectionFooter>
        <ProjectSelectionFooterLink onClick={onFooterClick}>{footerSubmitText}</ProjectSelectionFooterLink>
      </ProjectSelectionFooter>
    </FlexApart>
  );
};

export default StageEmpty;
