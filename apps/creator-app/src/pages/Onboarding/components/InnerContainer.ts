import { styled } from '@/hocs/styled';

const InnerContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-bottom: 30px;
  overflow-y: auto;

  border-radius: 5px;
  box-shadow:
    0 1px 3px 0 rgba(17, 49, 96, 0.08),
    0 0 1px 1px rgba(17, 49, 96, 0.08);
  background: white;
`;

export default InnerContainer;
