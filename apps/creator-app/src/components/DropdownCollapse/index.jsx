import { Collapse, FlexApart, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';

const HeaderContainer = styled(FlexApart)`
  cursor: pointer;
  padding: 16px 4px;
  font-weight: 600;
`;

const DropdownIcon = styled(SvgIcon)`
  line-height: inherit;

  svg {
    transition: transform 0.15s ease;
    transform: ${(props) => (props.isOpened ? 'rotate(-90deg)' : 'rotate(90deg)')};
  }
`;
class DropdownCollapse extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: true,
    };
  }

  toggle = () => {
    this.setState({
      isOpened: !this.state.isOpened,
    });
  };

  render() {
    return (
      <div>
        <HeaderContainer onClick={() => this.toggle()}>
          {this.props.text}
          <DropdownIcon icon="arrowLeft" color="#BECEDC" size={13} isOpened={this.state.isOpened} />
        </HeaderContainer>
        <Collapse isOpen={this.state.isOpened}>{this.props.children}</Collapse>
      </div>
    );
  }
}
export default DropdownCollapse;
