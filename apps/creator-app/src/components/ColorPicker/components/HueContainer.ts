import { styled } from '@/hocs/styled';

const HueContainer = styled.div`
  position: relative;
  height: 8px;
  margin: 4px 24px 20px;
  border-radius: 3px;
  background-color: rgb(255, 0, 0);

  > div > div {
    border-radius: 3px;
  }
`;

export default HueContainer;
