import styled from 'styled-components';

export const SidebarWrapper = styled.div`
  flex-basis: 12rem;
  flex-grow: 1;
  position: relative;
  height: 100vh;

  background-color: ${(props) => props.theme.palette.background.highlight};
  transition: background-color 0.2s ease;

  .settings {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0.5rem 1rem;
    .settings-title {
      color: ${(props) => props.theme.palette.text.secondary};
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
    .settings-user {
      margin-bottom: 0.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .creatorId {
        color: ${(props) => props.theme.palette.primary.main};
      }
    }
    .settings-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .logo {
    margin: 1rem auto;
    text-align: center;
    position: relative;
    padding-bottom: 1.2rem;
    img {
      width: 80%;
    }
    .admin-icon {
      position: absolute;
      bottom: 0;
      right: 1.2rem;
      width: fit-content;
      background-color: ${(props) => props.theme.palette.error.main};
      padding: 2px 6px;
      color: #fff;
      border-radius: 3px;
      font-size: 0.65rem;
    }
  }

  [class^='stack'] > * {
    margin-top: 0;
    margin-bottom: 0;
  }

  .stack-large {
    --space: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    & > * {
      padding: 0.5rem 1rem;
    }

    & > * + * {
      border-top: 1px solid ${(props) => props.theme.palette.divider.light};
    }
  }

  .stack-small {
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 0;

    & > * {
      display: block;
      padding: 0.5rem 1rem 0.5rem 0;
    }

    & > * + * {
      border-top: 1px solid ${(props) => props.theme.palette.divider.light};
      margin-left: 0.75rem;
    }
  }

  .sidebar-header {
    color: ${(props) => props.theme.palette.text.secondary};
    text-transform: uppercase;
  }

  a {
    color: ${(props) => props.theme.palette.text.primary};
    &:hover {
      color: ${(props) => props.theme.palette.primary.main};
      text-decoration: none;
    }
  }

  .is-active {
    color: ${(props) => props.theme.palette.primary.dark};
    border-right: 4px solid ${(props) => props.theme.palette.primary.dark};
    &:hover {
      color: ${(props) => props.theme.palette.primary.dark};
    }
  }
`;
