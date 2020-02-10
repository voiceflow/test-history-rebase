import _ from 'lodash';
import React from 'react';
import { Collapse } from 'reactstrap';

import InfoIcon from '@/components/InfoIcon';
import SvgIcon from '@/components/SvgIcon';
import { useToggle } from '@/hooks';
import { useDidUpdateEffect } from '@/hooks/lifecycle';
import { swallowEvent } from '@/utils/dom';

import {
  Container,
  ContentContainer,
  DropdownContainer,
  Header,
  HeaderContent,
  HeaderLabel,
  NumberContainer,
  PrefixContainer,
  StatusContainer,
  StatusContent,
} from './components';
import CollapseTrigger from './components/CollapseTrigger';
import { SectionVariant } from './constants';

export * from './components';
export * from './constants';

// eslint-disable-next-line react/display-name
export const UncontrolledSection = React.forwardRef(
  (
    {
      count,
      prefix,
      suffix,
      isCollapsed,
      toggle,
      isLink = false,
      header,
      status,
      tooltip,
      variant = SectionVariant.primary,
      onClick,
      dividers = true,
      isNested = false,
      collapseVariant = null,
      children,
      dropdown,
      className,
      headerRef,
      isDragging,
      headerToggle = false,
      tooltipProps,
      isDividerNested = false,
      isDraggingPreview = false,
      disabled = false,
      customContentStyling,
      ...props
    },
    ref
  ) => {
    const hasHeader = !!(prefix || suffix || header || tooltip || dropdown || status || count || collapseVariant || isLink);
    const clickHandler = onClick || (headerToggle ? toggle : undefined);

    return (
      <Container
        ref={ref}
        isDragging={isDragging}
        isDraggingPreview={isDraggingPreview}
        dividers={dividers}
        className={className}
        isCollapsed={isCollapsed}
        variant={variant}
        isNested={isNested}
        isDividerNested={isDividerNested}
        isLink={isLink}
        {...props}
      >
        {hasHeader && (
          <Header ref={headerRef} isDragging={isDragging} isNested={isNested} containerToggle={!!clickHandler} onClick={clickHandler}>
            {(prefix || header || tooltip || dropdown) && (
              <HeaderContent>
                {prefix && <PrefixContainer>{_.isString(prefix) ? <SvgIcon color="#787878" icon={prefix} /> : prefix}</PrefixContainer>}
                {header && <HeaderLabel disabled={disabled}>{header}</HeaderLabel>}
                {tooltip && <InfoIcon tooltipProps={tooltipProps}>{tooltip}</InfoIcon>}
                {dropdown && (
                  <DropdownContainer isCollapsed={isCollapsed} onClick={swallowEvent()}>
                    {dropdown}
                  </DropdownContainer>
                )}
              </HeaderContent>
            )}

            {(status || suffix || count || collapseVariant || isLink) && (
              <StatusContent>
                {(isLink || status) && <StatusContainer>{isLink ? <SvgIcon icon="arrowRight" size={10} /> : status}</StatusContainer>}
                {Number.isInteger(count) && <NumberContainer>{count}</NumberContainer>}
                {suffix && <PrefixContainer>{_.isString(suffix) ? <SvgIcon color="#becedc" icon={suffix} /> : suffix}</PrefixContainer>}
                {collapseVariant && (
                  <CollapseTrigger onToggle={clickHandler ? undefined : toggle} isCollapsed={isCollapsed} variant={collapseVariant} />
                )}
              </StatusContent>
            )}
          </Header>
        )}
        {children && (
          <ContentContainer noHeader={!hasHeader} style={customContentStyling}>
            <Collapse isOpen={!isCollapsed}>{_.isFunction(children) ? children({ isCollapsed, toggle }) : children}</Collapse>
          </ContentContainer>
        )}
      </Container>
    );
  }
);

const Section = ({ initialOpen = false, onToggleChange, collapseVariant = null, ...props }, ref) => {
  const [isCollapsed, toggle] = useToggle(!!collapseVariant && !initialOpen);

  useDidUpdateEffect(() => {
    if (onToggleChange) {
      onToggleChange(isCollapsed);
    }
  }, [isCollapsed]);

  return <UncontrolledSection {...props} isCollapsed={isCollapsed} collapseVariant={collapseVariant} toggle={toggle} ref={ref} />;
};

export default React.forwardRef(Section);
