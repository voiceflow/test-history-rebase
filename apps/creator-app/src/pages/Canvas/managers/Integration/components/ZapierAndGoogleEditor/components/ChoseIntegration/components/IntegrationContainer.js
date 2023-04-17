import { styled } from '@/hocs/styled';

const IntegrationContainer = styled.button`
  flex: 1;
  height: 11em;
  border: 1px solid #eaeff4;
  border-radius: 7px;
  margin: 6px;
  padding: 10px;
  transition: all 0.12s, ease;
  position: relative;
  box-sizing: border-box;

  &:hover {
    border-color: transparent;
    box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.06), 0 2px 4px 0 rgba(17, 49, 96, 0.12);
  }
`;

export default IntegrationContainer;
