import { styled } from '@/hocs';

const PhonePreviewContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 250px;
  height: 460px;
  border-radius: 25px;
  padding: 45px 10px;
  background: #000;
  box-sizing: border-box;

  &::before,
  &::after {
    position: absolute;
    background: #333;
  }

  &::before {
    top: 22px;
    height: 5px;
    width: 60px;
    border-radius: 10px;
    content: '';
  }

  &::after {
    height: 30px;
    width: 30px;
    bottom: 8px;
    border-radius: 50%;
    content: '';
  }
`;

export default PhonePreviewContainer;
