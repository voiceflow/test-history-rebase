import React from 'react';

import Container from './components/TabContainer';

export { Container };

const Tab = ({ href, ...props }) => <Container {...props} {...(href && { href, as: 'a' })} />;

export default Tab;
