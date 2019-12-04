import { MemberIcon } from '@/components/User';
import { styled, units } from '@/hocs';

const LockedEditorOverlayContainer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: ${units(3)}px ${units(6.5)}px;
  text-align: center;
  color: #62778c;
  font-size: 15px;
  z-index: 10;
  background: #ffffffaa;

  ${MemberIcon} {
    margin-bottom: ${units(2)}px;
    box-shadow: 0px 2px 4px rgba(17, 49, 96, 0.16);
  }
`;

export default LockedEditorOverlayContainer;
