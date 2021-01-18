import React from 'react';
import { Tooltip } from 'react-tippy';

import Box from '@/components/Box';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import Dropdown from '@/components/Dropdown';
import BaseHeader from '@/components/Header';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { FadeDownDelayedContainer } from '@/styles/animations';

import MenuContainer from './MenuContainer';

const PartialBaseHeader = BaseHeader as React.FC<Partial<React.ComponentProps<typeof BaseHeader>>>;

type HeaderProps = {
  name?: string;
};

const Header: React.FC<HeaderProps> = ({ name }) => (
  <PartialBaseHeader
    withLogo
    withUserMenu={false}
    disableLogoClick
    centerRenderer={() => name || 'Loading...'}
    rightRenderer={() => (
      <Box className="mr-3">
        <Dropdown
          menu={
            <MenuContainer>
              <FadeDownDelayedContainer>
                <div className="mb-3">
                  <h6 className="text-muted">Share testable link</h6>
                  <small className="text-dull">
                    Anyone with this link will be able to simulate this flow from within their browser by using their voice or text input.
                  </small>
                </div>
                <ClipBoard name="link" value={window.location.href} id="shareLink" />
              </FadeDownDelayedContainer>
            </MenuContainer>
          }
          placement="bottom-end"
          selfDismiss
        >
          {(ref, onToggle, isOpen) => (
            <Tooltip className="top-nav-icon" title="Share" position="bottom" distance={16}>
              <IconButton variant={IconButtonVariant.ACTION} active={isOpen} large icon="share" onClick={onToggle} size={16} ref={ref} />
            </Tooltip>
          )}
        </Dropdown>
      </Box>
    )}
  />
);

export default Header;
