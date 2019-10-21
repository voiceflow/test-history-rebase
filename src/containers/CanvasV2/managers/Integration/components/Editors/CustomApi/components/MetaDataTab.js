import { styled } from '@/hocs';

const MetaDataTab = styled.div`
  font-size: 15px;
  display: inline;
  padding: 4px 24px;
  padding-bottom: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;

  border-bottom: ${(props) => (props.active ? '2px solid #5d9df5' : '2px solid transparent')};
  color: ${(props) => (props.active ? '#5d9df5' : '#949db0')};

  :hover {
    color: #848da0;
  }
`;

export default MetaDataTab;
