import { Box, defaultMenuLabelRenderer, Input, Popper, SectionV2, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import Example from '@/components/Example';
import Section, { Row } from '@/components/Section';
import { Section as SectionType } from '@/examples/utils';

import * as examples from '../examples';

const List = styled.ul`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: 320px;
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
  height: 34px;
  padding: 0 16px;
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

const SearchContainer = styled.li`
  padding: 16px;
  position: sticky;
  top: 0;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e6e6e6;
`;

interface SectionWithRoutePath extends SectionType {
  routePath: string;
}

interface GroupedSection {
  [key: string]: SectionWithRoutePath | GroupedSection;
}

const isSection = (value: unknown): value is SectionWithRoutePath => !!value && typeof value === 'object' && 'path' in value && 'examples' in value;

const Sidebar: React.FC = () => {
  const [search, setSearch] = React.useState('');

  const sections = React.useMemo(() => {
    const sorted = Object.entries(examples)
      .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
      .sort(([_a, sectionA], [_b, sectionB]) => {
        if (sectionA.title.includes('/') && !sectionB.title.includes('/')) return -1;
        if (!sectionA.title.includes('/') && sectionB.title.includes('/')) return 1;

        return sectionA.title.localeCompare(sectionB.title);
      });

    const result: GroupedSection = {};

    sorted.forEach(([path, section]) => {
      const parts = section.title.split('/');
      let current = result;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = { ...section, routePath: path };
        } else {
          current[part] ??= {};
          current = current[part] as GroupedSection;
        }
      });
    });

    return Object.entries(result);
  }, [search, examples]);

  const renderGroupedSection = (path: string, section: SectionWithRoutePath | GroupedSection) => (
    <li key={path}>
      {isSection(section) ? (
        <Popper
          maxWidth="calc(100vw - 260px)"
          maxHeight="90vh"
          placement="right"
          renderContent={() => (
            <Section key={path} title={section.title} description={section.description} path={section.path} inline>
              <Row>
                {section.examples.flat().map((example, index) => (
                  <Example key={index} title={example.title}>
                    <example.component />
                  </Example>
                ))}
              </Row>
            </Section>
          )}
        >
          {({ ref, onToggle, onClose }) => (
            <Link ref={ref} to={`/${section.routePath}`} onClick={onClose} onMouseLeave={onClose}>
              {defaultMenuLabelRenderer(
                path,
                search,
                () => path,
                () => path
              )}
              <SvgIcon icon="eye" onMouseEnter={onToggle} color="inherit" />
            </Link>
          )}
        </Popper>
      ) : (
        <SectionV2.CollapseSection
          minHeight={32}
          header={({ collapsed, onToggle }) => (
            <SectionV2.Header onClick={onToggle} bottomUnit={1} topUnit={1} rightUnit={2} leftUnit={2}>
              <Box.Flex gap={4}>
                <SvgIcon icon="folder" />
                <SectionV2.Title bold={!collapsed}>{path}</SectionV2.Title>
              </Box.Flex>
            </SectionV2.Header>
          )}
        >
          <Box pl={8}>{Object.entries(section).map(([p, s]) => renderGroupedSection(p, s))}</Box>
        </SectionV2.CollapseSection>
      )}
    </li>
  );

  return (
    <List>
      <SearchContainer>
        <Input value={search} onChangeText={setSearch} placeholder="Search example" />
      </SearchContainer>

      <li>
        <Link to="/list">List All</Link>
      </li>

      {sections.length ? (
        sections.map(([path, section]) => renderGroupedSection(path, section))
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
