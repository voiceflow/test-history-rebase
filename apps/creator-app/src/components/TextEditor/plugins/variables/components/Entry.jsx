import { Menu } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs/styled';

const Item = styled(Menu.Item)`
  ${({ focused }) =>
    focused &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff !important;
    `}

  &:hover {
    background: none;
  }

  b {
    text-decoration: underline;
  }
`;

export default function Entry({ theme, mention, isFocused, searchValue, className, ...parentProps }) {
  const ref = React.useRef(null);

  const substrs = searchValue ? mention.name.split(searchValue) : [];

  React.useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isFocused]);

  if (mention.id === 'EMPTY') {
    return <span {...parentProps} />;
  }

  return (
    <Item {...parentProps} ref={ref} focused={isFocused} className={isFocused ? 'focused' : ''}>
      {substrs.length < 2
        ? mention.name
        : substrs.map((str, i) =>
            i === 0 ? (
              str
            ) : (
              <React.Fragment key={`${str}${i}`}>
                <b>{searchValue}</b>
                {str}
              </React.Fragment>
            )
          )}
    </Item>
  );
}
