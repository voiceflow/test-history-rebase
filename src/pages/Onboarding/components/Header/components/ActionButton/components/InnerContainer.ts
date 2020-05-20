import SvgIconContainer from '@/components/SvgIcon/components/SvgIconContainer';
import { styled } from '@/hocs';

const InnerContainer = styled.div`
  height: 100%;
  width: 100%;
  cursor: pointer;
  :hover{
   ${SvgIconContainer} {
    transition: all 0.15s ease; // doing 'color' doesnt work for some reason
    color: #8DA2B5;
   }
`;

export default InnerContainer;
