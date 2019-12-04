import styled from 'styled-components';

const MembersWrapper = styled.div`
  &:not(:empty) {
    margin-right: 20px;

    > div {
      margin-left: 0 !important;
    }
  }
`;

export default MembersWrapper;
