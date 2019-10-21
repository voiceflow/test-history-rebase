import React from 'react';
import { Collapse } from 'reactstrap';

import List from '@/components/ExpandingList/components/ExpandingListItems';
import SvgIcon from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';

import { Container, DropdownArrowContainer, Header, Indicator } from './components';

function ExpandingListSection({ isExpanded, onToggle, label, color, children }) {
  const listEl = React.useRef();

  return (
    <Container listEl={listEl.current}>
      <Header onClick={onToggle}>
        <Flex>
          <DropdownArrowContainer isExpanded={isExpanded}>
            <SvgIcon icon="caretDown" size={9} />
          </DropdownArrowContainer>
          {label}
        </Flex>
        <Indicator color={color} />
      </Header>
      <Collapse isOpen={isExpanded}>
        <List ref={listEl}>{children}</List>
      </Collapse>
    </Container>
  );
}

export default ExpandingListSection;
