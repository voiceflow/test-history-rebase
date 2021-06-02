import styled from 'styled-components';

import Button from '@/components/Button';

export const BetaProgramWrapper = styled.div``;

export const BetaDescription = styled.div`
  font-size: 24px;
  line-height: 1.35;
`;

export const BetaDescriptionTitle = styled.h1`
  font-size: 64px;
`;

export const BetaProgramDescription = styled.div`
  text-align: center;
  max-width: 90%;
  margin: 1rem auto;
`;

export const BetaHelperText = styled.div`
  text-align: center;
  font-size: 16px;
  max-width: 50%;
  margin: 3rem auto;
  color: ${(props) => props.theme.palette.secondary.dark};
`;

export const BetaImage = styled.img`
  max-width: 40%;
  margin: 2rem auto;
`;

export const BetaContentGroup = styled.div`
  width: fit-content;
  margin: 3rem auto;
  padding: 2rem 2rem calc(2rem - 12px) 2rem;
  background-color: ${(props) => props.theme.palette.background.highlight};
  border-radius: 5px;

  .enter-text {
    text-align: left;
    font-size: 12px;
    line-height: 12px;
    color: ${(props) => props.theme.palette.grey.light};
  }

  .spacer {
    height: 12px;
  }
`;

export const BetaCreator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  margin-bottom: 12px;
  .beta-user-icon {
    height: 48px;
    width: 48px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const BetaCreatorDetails = styled.div`
  margin-left: 12px;
  & > div:first-child {
    font-size: 18px;
  }
`;

export const AddToBetaButton = styled(Button)``;

export const BetaForm = styled.div`
  & > * + * {
    margin-top: 0.75rem;
  }
`;

export const BetaUsersListWrapper = styled.div`
  .search-header {
    & > * + * {
      margin-left: 16px;
    }
  }
`;

export const BetaUsersFullList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  & > * {
    flex-basis: calc(100% / 3 - 40px);
    max-width: calc(100% / 3 - 40px);
  }
  @media only screen and (min-width: 1400px) {
    & > * {
      flex-basis: calc(100% / 4 - 40px);
      max-width: calc(100% / 4 - 40px);
    }
  }
`;

export const BetaUsersListSearch = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  input {
    border-radius: 5px !important;
  }
  & > * + * {
    margin-top: 1rem;
  }
`;
