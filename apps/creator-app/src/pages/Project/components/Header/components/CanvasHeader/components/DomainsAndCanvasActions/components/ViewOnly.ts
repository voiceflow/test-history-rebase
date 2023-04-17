import { styled } from '@/hocs/styled';

const ViewOnly = styled.div`
  position: relative;
  top: 1px;
  color: #62778c;
  font-size: 13px;

  &:after {
    display: inline-block;
    width: 4px;
    height: 4px;
    position: relative;
    top: -2px;
    border-radius: 2px;
    background-color: #becedc;
    margin: 0 12px;
    content: '';
  }
`;

export default ViewOnly;
