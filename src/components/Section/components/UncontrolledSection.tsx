import _ from 'lodash';
import React from 'react';
import { Collapse } from 'reactstrap';
import { CSSProperties } from 'styled-components';

import InfoIcon from '@/components/InfoIcon';
import SvgIcon, { Icon } from '@/components/SvgIcon';
import { swallowEvent } from '@/utils/dom';

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
  headerRef?: React.Ref<HTMLDivElement>;
  className?: string;
  isDragging?: boolean;
  isCollapsed?: boolean;
  headerToggle?: boolean;
  tooltipProps?: any; // TODO: replace with real props
  collapseVariant?: SectionToggleVariant | null;
  isDividerNested?: boolean;
  isDraggingPreview?: boolean;
  customContentStyling?: CSSProperties;
  customHeaderStyling?: CSSProperties;
  headerVariant?: HeaderVariant;
  contentPrefix?: React.FC | string;
  contentSuffix?: React.FC | string;
  emptyChildren?: boolean;
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
    ...props
  },
  ref
) => {
  const hasHeader = !!(prefix || suffix || header || tooltip || dropdown || status || count || collapseVariant || isLink);
  const clickHandler = onClick || (headerToggle ? toggle : undefined);
  const ContentPrefixComponent = contentPrefix;
  const ContentSuffixComponent = contentSuffix;

  return (
    <Container
      ref={ref}
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
      {...props}
    >
      {hasHeader && (
        <Header ref={headerRef} isDragging={isDragging} containerToggle={!!clickHandler} onClick={clickHandler} style={customHeaderStyling}>
          {(prefix || header || tooltip || dropdown) && (
            <HeaderContent>
              {prefix && <FixNode fixNode={prefix} color="#787878" />}
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

          {(status || infix || suffix || count || collapseVariant || isLink) && (
            <StatusContent>
              {infix && <FixNode fixNode={infix} color="#becedc" />}
              {(isLink || status) && <StatusContainer>{isLink ? <SvgIcon icon="arrowRight" size={10} /> : status}</StatusContainer>}
              {!!count && Number.isInteger(count) && <NumberContainer>{count}</NumberContainer>}
              {suffix && <FixNode fixNode={suffix} color="#becedc" />}
              {collapseVariant && <CollapseTrigger onToggle={clickHandler ? _.noop : toggle} isCollapsed={isCollapsed} variant={collapseVariant} />}
            </StatusContent>
          )}
        </Header>
      )}
      {(children || emptyChildren) && (
        <ContentContainer noHeader={!hasHeader} style={customContentStyling}>
          <ContentPrefixComponent />
          <Collapse isOpen={!isCollapsed}>{_.isFunction(children) ? children({ isCollapsed, toggle }) : children}</Collapse>
          <ContentSuffixComponent />
        </ContentContainer>
      )}
    </Container>
  );
};

export default React.forwardRef<HTMLDivElement, UncontrolledSectionProps>(UncontrolledSection);
