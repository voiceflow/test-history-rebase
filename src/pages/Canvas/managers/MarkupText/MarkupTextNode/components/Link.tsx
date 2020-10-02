import React from 'react';

import { ClickableText } from '@/components/Text';
import { styled } from '@/hocs';
import { EngineContext } from '@/pages/Canvas/contexts';

type LinkProps = {
  href: string;
};

const ClickableLink = styled(ClickableText)`
  display: inline;
  pointer-events: all;
`;

const Link: React.FC<LinkProps> = ({ href, children }) => {
  const engine = React.useContext(EngineContext)!;

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      const withoutExtraKeys = !(e.metaKey || e.ctrlKey || e.shiftKey);

      if (!engine.markup.isActive || withoutExtraKeys) {
        e.stopPropagation();
        e.preventDefault();
      }

      if (withoutExtraKeys) {
        // not using http/https here since the links can have custom protocols, like zpl://
        const link = href.startsWith('//') || href.includes('://') ? href : `//${href}`;

        window.open(link, '_blank', 'toolbar=0,location=0,menubar=0');
      }
    },
    [href]
  );

  return <ClickableLink onMouseDown={onClick}>{children}</ClickableLink>;
};

export default Link;
