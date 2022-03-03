import { Utils } from '@voiceflow/common';
import { Collapse, Icon, SvgIcon, swallowEvent } from '@voiceflow/ui';
import _isFunction from 'lodash/isFunction';
import React from 'react';
import { CSSProperties } from 'styled-components';

import InfoIcon, { InfoIconProps } from '@/components/InfoIcon';

import { SectionToggleVariant, SectionVariant } from '../constants';
import CollapseTrigger from './CollapseTrigger';
import ContentContainer from './ContentContainer';
import DropdownContainer from './DropdownContainer';
import FixNode from './FixNode';
import HeaderContent from './HeaderContent';
import HeaderLabel, { HeaderVariant } from './HeaderLabel';
import NumberContainer from './NumberContainer';
import Container, { SectionContainerProps } from './SectionContainer';
import Header from './SectionHeader';
import StatusContainer from './StatusContainer';
import StatusContent from './StatusContent';

export type UncontrolledSectionProps = SectionContainerProps & {
  id?: string;
  count?: number;
  prefix?: Icon | React.ReactNode;
  suffix?: Icon | React.ReactNode;
  infix?: Icon | React.ReactNode;
  header?: React.ReactNode;
  toggle?: () => void;
  isLink?: boolean;
  status?: React.ReactNode;
  tooltip?: React.ReactNode;
  variant?: SectionVariant;
  onClick?: React.MouseEventHandler | null;
  children?: React.ReactNode;
  dividers?: boolean;
  isNested?: boolean;
  disabled?: boolean;
  dropdown?: React.ReactNode;
  headerRef?: React.Ref<HTMLElement>;
  className?: string;
  isDragging?: boolean;
  isCollapsed?: boolean;
  headerToggle?: boolean;
  fullWidth?: boolean;
  tooltipProps?: InfoIconProps['tooltipProps'];
  nestedIntend?: boolean;
  collapseVariant?: SectionToggleVariant | null;
  isDividerNested?: boolean;
  isDraggingPreview?: boolean;
  customContentStyling?: CSSProperties;
  customHeaderStyling?: CSSProperties;
  headerVariant?: HeaderVariant;
  contentPrefix?: React.FC | string;
  contentSuffix?: React.FC | string;
  emptyChildren?: boolean;
  truncatedHeader?: boolean;
  hiddenPrefix?: boolean;
  hiddenStatusContent?: boolean;
  backgroundColor?: string;
  headerEnd?: React.ReactNode;
};

const UncontrolledSection: React.ForwardRefRenderFunction<HTMLDivElement, UncontrolledSectionProps> = (
  {
    count,
    prefix,
    suffix,
    infix,
    toggle,
    isLink = false,
    header,
    fullWidth,
    status,
    tooltip,
    variant = SectionVariant.PRIMARY,
    onClick,
    dividers = true,
    isNested = false,
    disabled = false,
    children,
    dropdown,
    className,
    headerRef,
    isDragging,
    isCollapsed,
    headerToggle = false,
    tooltipProps,
    nestedIntend,
    collapseVariant = null,
    isDividerNested = false,
    isDraggingPreview = false,
    isRounded = false,
    customContentStyling,
    customHeaderStyling,
    headerVariant,
    emptyChildren,
    contentPrefix = React.Fragment,
    contentSuffix = React.Fragment,
    truncatedHeader = true,
    hiddenPrefix,
    hiddenStatusContent,
    backgroundColor,
    headerEnd,
    ...props
  },
  ref
) => {
  const hasHeader = !!(prefix || suffix || header || tooltip || dropdown || status || count || collapseVariant || isLink);
  const clickHandler = onClick || (headerToggle ? toggle : undefined);
  const ContentPrefixComponent = contentPrefix;
  const ContentSuffixComponent = contentSuffix;

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <Container
      ref={ref}
      backgroundColor={backgroundColor}
      isDragging={isDragging}
      isDraggingPreview={isDraggingPreview}
      dividers={dividers}
      headerToggle={headerToggle}
      className={className}
      isCollapsed={isCollapsed}
      variant={variant}
      isNested={isNested}
      isDividerNested={isDividerNested}
      isLink={isLink}
      isRounded={isRounded}
      fullWidth={fullWidth}
      {...props}
    >
      {hasHeader && (
        <Header
          ref={headerRef as React.Ref<HTMLDivElement>}
          isDragging={isDragging}
          containerToggle={!!clickHandler}
          onClick={clickHandler}
          style={customHeaderStyling}
          nestedIntend={nestedIntend}
        >
          {(prefix || header || tooltip || dropdown) && (
            <HeaderContent truncated={truncatedHeader} overflowHidden={hiddenPrefix}>
              {prefix && <FixNode overflowHidden={hiddenPrefix} fixNode={prefix} color="#787878" />}
              {header && (
                <HeaderLabel
                  isCollapsed={!!isCollapsed}
                  hasToggle={!!headerToggle}
                  disabled={disabled}
                  variant={headerVariant}
                  sectionVariant={variant}
                >
                  {header}
                </HeaderLabel>
              )}
              {tooltip && <InfoIcon tooltipProps={tooltipProps}>{tooltip}</InfoIcon>}
              {dropdown && (
                <DropdownContainer isCollapsed={isCollapsed} onClick={swallowEvent()}>
                  {dropdown}
                </DropdownContainer>
              )}
            </HeaderContent>
          )}

          {(status || infix || suffix || count || collapseVariant || isLink || headerEnd) && (
            <StatusContent overflowHidden={hiddenStatusContent}>
              {infix && <FixNode fixNode={infix} color="#becedc" />}
              {(isLink || status) && <StatusContainer>{isLink ? <SvgIcon icon="arrowRight" size={10} /> : status}</StatusContainer>}
              {Number.isInteger(count) && <NumberContainer>{count}</NumberContainer>}
              {suffix && <FixNode fixNode={suffix} color="#becedc" />}
              {collapseVariant && (
                <CollapseTrigger
                  disabled={disabled}
                  onToggle={clickHandler ? Utils.functional.noop : toggle}
                  isCollapsed={isCollapsed}
                  variant={collapseVariant}
                />
              )}
              {headerEnd}
            </StatusContent>
          )}
        </Header>
      )}

      {(children || emptyChildren) && (
        <ContentContainer noHeader={!hasHeader} isCollapsed={isCollapsed} sectionToggleVariant={collapseVariant} style={customContentStyling}>
          <ContentPrefixComponent />
          <Collapse isOpen={!isCollapsed}>{_isFunction(children) ? children({ isCollapsed, toggle }) : children}</Collapse>
          <ContentSuffixComponent />
        </ContentContainer>
      )}
    </Container>
  );
};

export default React.forwardRef<HTMLDivElement, UncontrolledSectionProps>(UncontrolledSection);
