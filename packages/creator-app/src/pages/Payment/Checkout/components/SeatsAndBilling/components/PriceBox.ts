import { styled } from '@/hocs/styled';

const PriceBox = styled.div`
  font-size: 13px;
  position: relative;
  div {
    display: inline-block;
    color: rgba(19, 33, 68, 0.65);
  }
  div:first-child {
    position: relative;
    bottom: 20px;
    margin-right: 3px;
  }
  div:nth-child(2) {
    font-size: 45px;
    font-weight: 600;
  }
  div:nth-child(3) {
    color: #8da2b5;
  }
`;

export default PriceBox;
