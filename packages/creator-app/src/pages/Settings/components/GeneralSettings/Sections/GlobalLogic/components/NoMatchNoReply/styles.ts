import { Flex, Input } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`;

export const TextContainer = styled.div`
  height: 42px;
`;

export const SubSectionTitle = styled.b`
  font-size: 15px;
  line-height: 1;
  font-weight: 600;
  color: #132144;
`;

export const SubSectionDescription = styled.p`
  margin-top: 4px;
  font-size: 13px;
  color: #62778c;
  line-height: normal;
  margin-bottom: 0;
`;

export const DelayTrigger = styled.span<{ onClick?: VoidFunction; active?: boolean }>`
  color: ${({ active }) => (active ? '#3876cb' : '#3d82e2')};
  border-bottom: 1px dotted #3d82e2;
  margin: 0 2px;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};

  &:hover {
    color: #3876cb;
  }
`;

export const DelayInput = styled(Input)`
  width: 200px;
`;
