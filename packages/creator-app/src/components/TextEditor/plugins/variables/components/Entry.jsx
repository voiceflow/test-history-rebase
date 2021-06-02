import React from 'react';

import { MenuItem } from '@/components/Menu';
import { css, styled } from '@/hocs';

const Item = styled(MenuItem)`
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
  const substrs = searchValue ? mention.name.split(searchValue) : [];

  if (mention.id === 'EMPTY') {
    return <span {...parentProps} />;
  }

  return (
    <Item {...parentProps} focused={isFocused}>
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
