import React from 'react';

import { flexStyles } from '@/componentsV2/Flex';
import { styled } from '@/hocs';
import { preventDefault } from '@/utils/dom';

import { HEADER_HEIGHT, sectionStyles } from '../styles';

const EditorHeader = ({ path, className }) => (
  <div className={className}>
    {path.map(({ label, onClick }, index) => {
      const fullPath = path
        .slice(0, index + 1)
        .map(({ path: pathPart }) => pathPart)
        .join('/');

      return (
        <React.Fragment key={fullPath}>
          {index !== 0 && <span>/</span>}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="" onClick={preventDefault(onClick)}>
            {label}
          </a>
        </React.Fragment>
      );
    })}
  </div>
);

export default styled(EditorHeader)`
  ${flexStyles}
  ${sectionStyles}
  
  height: ${HEADER_HEIGHT}px;
`;
