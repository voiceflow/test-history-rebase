import { Nullable } from '@voiceflow/common';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Container, Item, SectionLabel } from './components';

export interface NavLinkItem {
  to: string;
  key?: string;
  label: React.ReactNode;
  exact?: boolean;
}

export interface NavLinkSection {
  key: string;
  label: React.ReactNode;
  items: NavLinkItem[];
}

export interface NavLinkSidebarProps {
  items: Nullable<NavLinkItem | NavLinkSection>[];
}

const isNavLinkSection = (item: Nullable<NavLinkItem | NavLinkSection>): item is NavLinkSection => !!item && 'items' in item;

const NavLinkSidebar: React.OldFC<NavLinkSidebarProps> = ({ items }) => {
  const location = useLocation();

  return (
    <Container>
      {items.map((item) =>
        isNavLinkSection(item) ? (
          <React.Fragment key={item.key}>
            <SectionLabel
              isActive={
                !!matchPath(
                  location.pathname,
                  item.items.map((item) => item.to)
                )
              }
            >
              {item.label}
            </SectionLabel>

            {item.items.map(({ to, key, label, ...props }) => (
              <Item to={to} key={key || to} nested {...props}>
                {label}
              </Item>
            ))}
          </React.Fragment>
        ) : (
          item && (
            <Item key={item.key || item.to} {...item}>
              {item.label}
            </Item>
          )
        )
      )}
    </Container>
  );
};

export default NavLinkSidebar;
