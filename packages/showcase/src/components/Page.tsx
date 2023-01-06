import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const Container = styled.section`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  @import url('https://fonts.googleapis.com/css?family=Open+Sans:ital,wght@400,500,600,700');

* {
  box-sizing: border-box;
}

*:focus-visible {
  outline: none;
}

body {
  color: #132144 !important;
  font-weight: 400;
  font-size: 15px;
  font-family: 'Open Sans', sans-serif !important;
  background: #f9f9f9 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: #5d9df5;
}

a:hover {
  color: #7eb4ff;
}

ul {
  list-style-type: circle;
  padding-inline-start: 20px;
}

li {
  display: list-item;
  text-align: -webkit-match-parent;
}
`;

const Page: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Container>
    <GlobalStyles />
    {children}
  </Container>
);

export default Page;
