import Button from '@/components/Button';
import { SvgIconContainer } from '@/components/SvgIcon';
import { styled } from '@/hocs';

const EnterFlowButton = styled(Button)`
  display: flex;
  padding: 0px 10px;
  font-size: 10px;
  height: 24px;
  align-items: center;
  color: #132042;
  background: #fff;
  min-width: 75px;
  white-space: nowrap;
  background: linear-gradient(-180deg, rgba(238, 244, 246, 0.85), #eef4f6);
  border: 1px solid #dfe3ed;
  transition: all 0.15s ease;

  &:hover {
    color: #132042;
    background: linear-gradient(180deg, rgba(222, 233, 237, 0.85) 0%, #dee9ed 100%), #ffffff;
  }

  & > * {
    height: inherit;
    width: inherit;
    margin-right: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & ${SvgIconContainer} {
    transition: none;
  }
`;

export default EnterFlowButton;
