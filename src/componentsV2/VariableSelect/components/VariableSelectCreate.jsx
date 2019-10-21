import React from 'react';

import { FlexCenter } from '@/componentsV2/Flex';
import { PanelType } from '@/containers/CanvasV2/components/CanvasMenu/constants';
import { setActiveCreatorMenu } from '@/ducks/ui';
import { connect, styled } from '@/hocs';

const CreateVariableContainer = styled(FlexCenter)`
  border-top: 1px solid #dce5e8;
  text-align: center;
  color: #5d9df5;
  height: 50px;
`;

const CreateVariable = ({ setActiveCreatorMenu }) => (
  <CreateVariableContainer onClick={() => setActiveCreatorMenu(PanelType.VARIABLE_PANEL)}>Create Variable</CreateVariableContainer>
);

const mapDispatchToProps = {
  setActiveCreatorMenu,
};

export default connect(
  null,
  mapDispatchToProps
)(CreateVariable);
