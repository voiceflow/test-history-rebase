import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const InputGroupText = styled(Flex)`
  padding: 0.375rem 0.75rem;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  border-radius: 0.25rem;
  height: 42px;
  color: #62778c;
  font-weight: 600;
  background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #fff;
  background-color: #fff;
  border: 1px solid #d5dae7;
  cursor: pointer;
`;

export default InputGroupText;
