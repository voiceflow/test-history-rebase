import { Utils } from '@voiceflow/common';
import { Collapse, SvgIcon, SvgIconTypes, swallowEvent, TutorialInfoIcon, TutorialInfoIconProps } from '@voiceflow/ui';
import React from 'react';
import { CSSProperties } from 'styled-components';

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
  prefix?: SvgIconTypes.Icon | React.ReactNode;
  suffix?: SvgIconTypes.Icon | React.ReactNode;
  infix?: SvgIconTypes.Icon | React.ReactNode;
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
  tooltipProps?: TutorialInfoIconProps['tooltipProps'];
  nestedIntend?: boolean;
  collapseVariant?: SectionToggleVariant | null;
  isDividerNested?: boolean;
  isDraggingPreview?: boolean;
  customContentStyling?: CSSProperties;
  customHeaderStyling?: CSSProperties;
  headerVariant?: HeaderVariant;
  contentPrefix?: React.ReactNode;
  contentSuffix?: React.ReactNode;
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
    contentPrefix,
    contentSuffix,
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
              {tooltip && <TutorialInfoIcon tooltipProps={tooltipProps}>{tooltip}</TutorialInfoIcon>}
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
          {contentPrefix}

          <Collapse isOpen={!isCollapsed}>{Utils.functional.isFunction(children) ? children({ isCollapsed, toggle }) : children}</Collapse>

          {contentSuffix}
        </ContentContainer>
      )}
    </Container>
  );
};

export default React.forwardRef<HTMLDivElement, UncontrolledSectionProps>(UncontrolledSection);
