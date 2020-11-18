import { styled } from '@/hocs';

import { importantStyles } from '../styles';
import Container from './Container';

const SuccessContainer = styled(Container)`
  ${importantStyles}
  background-color: #fff;
  cursor: pointer;
  background-size: cover;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1;
  text-align: center;
  border-color: #fff;
  position: relative;
  z-index: 1;
  background-image: linear-gradient(180deg, rgba(93, 157, 245, 0.12) 0%, rgba(44, 133, 255, 0.16) 100%);
  background: rgb(245, 93, 118);
  background: linear-gradient(-180deg, rgba(39, 151, 69, 0.08) 0%, rgba(39, 151, 69, 0.16) 100%);
  &:before {
    background: rgb(245, 93, 118);
    background: linear-gradient(-180deg, rgba(39, 151, 69, 0.04) 0%, rgba(39, 151, 69, 0.08) 100%);
  }
  &:active {
    color: rgba(110, 132, 154, 0.8);
    border-color: rgba(39, 151, 69, 0.5);
    transition: opacity 0.12s linear, border-color 0.16s linear, box-shadow 0.12s linear;
    box-shadow: none;
  }
`;

export default SuccessContainer;
