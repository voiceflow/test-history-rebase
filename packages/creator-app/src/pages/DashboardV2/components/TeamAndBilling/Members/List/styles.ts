import { Input as UIInput, SvgIcon, Table, User } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled(Table.Container)`
  border: #eaeff4 solid 1px;
  border-radius: 8px;
  overflow: hidden;
  min-width: auto;
`;

export const Header = styled.header`
  background-color: #eef4f6;
  padding: 16px 32px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Filters = styled.section`
  background-color: #eef4f6;
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: space-between;
`;

export const Input = styled(UIInput)`
  width: 230px;
`;

export const Body = styled.div``;

export const NoResults = styled.div`
  height: 84px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #eaeff4;
`;

export const Row = styled.div`
  display: flex;
  border-top: 1px solid #eaeff4;
  padding: 16px 32px;
  gap: 16px;
  align-items: center;
`;
export const Info = styled.div`
  margin-right: auto;
`;
export const Name = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

export const Avatar = styled(User)`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  ${SvgIcon.Container} {
    width: 18px !important;
    height: 18px !important;
  }
`;

export const Badge = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  color: #3d82e2;
  font-weight: 700;
  margin-left: 8px;

  border-radius: 11px;
  box-shadow: 0px 1px 0px rgba(19, 33, 68, 0.12), 0px 0px 1px rgba(19, 33, 68, 0.2);
  background-color: #ffffff;
  display: inline-flex;
  padding: 3px 8px;
`;

export const Email = styled.div`
  color: #62778c;
  font-size: 13px;
`;
