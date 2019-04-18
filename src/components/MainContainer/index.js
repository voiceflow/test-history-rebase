import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { useScrollHelpers } from 'hooks/scroll';

import { ScrollContextProvider } from 'contexts';

export default function MainContainer(props) {
  const {
    children,
    onScroll,
    className,
    visibleScroll,
    headerRenderer,
    enableScrollbarOffset,
  } = props;

  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers({ enableScrollbarOffset });

  return (
    <ScrollContextProvider value={scrollHelpers}>
      <div className={cn('main-container', className)}>
        <div className="main-container-header">{headerRenderer && headerRenderer()}</div>

        <div
          ref={bodyRef}
          onScroll={onScroll}
          className={cn('main-container-body', { 'h-ovy-s': visibleScroll })}
        >
          <div ref={innerRef} className="main-container-body-inner">
            {children}
          </div>
        </div>
      </div>
    </ScrollContextProvider>
  );
}

MainContainer.propTypes = {
  children: PropTypes.any,
  onScroll: PropTypes.func,
  className: PropTypes.string,
  visibleScroll: PropTypes.bool,
  headerRenderer: PropTypes.func,
  enableScrollbarOffset: PropTypes.bool,
};
