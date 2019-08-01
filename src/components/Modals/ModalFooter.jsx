import React from 'react';
import styled from 'styled-components';

import { flexEndStyles } from '@/componentsV2/Flex';
import Link from '@/componentsV2/Link';

const FooterContainer = styled.div`
  ${flexEndStyles}
  background: linear-gradient(180deg,rgba(238,244,246,0.85) 0%,#eef4f6 100%),#ffffff;
  padding: 20px 50px;
  height: 100px;
  align-items: center;
  border-bottom-left-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
`;

export const ModalFooter = ({ link, children }) => (
  <FooterContainer>
    <Link href={link}>{children}</Link>
  </FooterContainer>
);
