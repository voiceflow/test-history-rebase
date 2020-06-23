import React from 'react';

import { ClickableText } from '@/components/Text';
import { styled } from '@/hocs';
import { CANVAS_MARKUP_ENABLED_CLASSNAME } from '@/pages/Canvas/constants';

type LinkProps = {
  href: string;
};

const ClickableLink = styled(ClickableText)`
  display: inline;
  pointer-events: all;
`;

const Link: React.FC<LinkProps> = ({ href, children }) => {
  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      const withoutExtraKeys = !(e.metaKey || e.ctrlKey || e.shiftKey);

      if (!document.getElementsByClassName(CANVAS_MARKUP_ENABLED_CLASSNAME) || withoutExtraKeys) {
        e.stopPropagation();
        e.preventDefault();
      }

      if (withoutExtraKeys) {
        window.open(href, '_blank', 'toolbar=0,location=0,menubar=0');
      }
    },
    [href]
  );

  return <ClickableLink onMouseDown={onClick}>{children}</ClickableLink>;
};

export default Link;
