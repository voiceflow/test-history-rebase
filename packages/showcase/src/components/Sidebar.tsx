import { defaultMenuLabelRenderer, Input, Popper, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import Example from '@/components/Example';
import Section from '@/components/Section';

import * as examples from '../examples';

const List = styled.ul`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: 240px;
  height: 100%;
  padding: 0;
  margin: 0;
  border-right: 1px solid #e6e6e6;
  overflow-x: hidden;
  overflow-y: auto;

  li {
    list-style: none;
  }
`;

const Link = styled(NavLink)`
  display: flex;
  width: 100%;
  height: 32px;
  padding: 0 1.5em;
  box-sizing: border-box;
  align-items: center;
  color: #212121;
  text-decoration: none;

  &.active {
    color: #00bcd4;
  }

  ${SvgIcon.Container} {
    margin-left: 0.8em;
  }
`;

const Sidebar: React.FC = () => {
  const [search, setSearch] = React.useState('');

  const sections = React.useMemo(
    () => (!search ? Object.entries(examples) : Object.entries(examples).filter(([key]) => key.includes(search))),
    [search, examples]
  );

  return (
    <List>
      <li style={{ padding: '1em 1.5em 1em 1em', position: 'sticky', top: 0, backgroundColor: '#f9f9f9', borderBottom: '1px solid #e6e6e6' }}>
        <Input value={search} onChangeText={setSearch} placeholder="Search example" />
      </li>

      <li>
        <Link to="/list">List All</Link>
      </li>

      {sections.length ? (
        sections.map(([path, section]) => (
          <li key={path}>
            <Popper
              maxWidth="calc(100vw - 260px)"
              maxHeight="90vh"
              placement="right"
              renderContent={() => (
                <Section key={path} title={section.title} path={section.path} inline>
                  {section.examples.map((example) => (
                    <Example key={example.title} title={example.title}>
                      <example.component />
                    </Example>
                  ))}
                </Section>
              )}
            >
              {({ ref, onToggle, onClose }) => (
                <Link ref={ref} to={`/${path}`} onClick={onClose} onMouseLeave={onClose}>
                  {defaultMenuLabelRenderer(
                    section.title,
                    search,
                    () => section.title,
                    () => section.title
                  )}
                  <SvgIcon icon="eye" onMouseEnter={onToggle} color="inherit" />
                </Link>
              )}
            </Popper>
          </li>
        ))
      ) : (
        <li>
          <Text display="block" textAlign="center" color="gray">
            Not found
          </Text>
        </li>
      )}
    </List>
  );
};

export default Sidebar;
