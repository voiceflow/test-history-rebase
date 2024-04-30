import React from 'react';

import type { SvgIconTypes } from '@/components/SvgIcon';
import SvgIcon from '@/components/SvgIcon';
import type { TippyTooltipProps } from '@/components/TippyTooltip';
import TippyTooltip from '@/components/TippyTooltip';

import * as S from './styles';

export interface AssistantCardProps {
  image: React.ReactNode;
  action: React.ReactNode;
  title?: React.ReactNode | string;
  subtitle?: React.ReactNode | string;
  isHovered?: boolean;
  isActive?: boolean;
  iconTooltip?: TippyTooltipProps;
  icon?: SvgIconTypes.Icon;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
}

const AssistantCard: React.FC<AssistantCardProps> = ({
  image,
  action,
  iconProps,
  iconTooltip,
  isHovered,
  isActive,
  subtitle,
  title,
  icon,
}) => {
  return (
    <S.OuterContainer>
      <S.CardContainer isHovered={isHovered} active={isActive}>
        {image && <S.CardImageContainer>{image}</S.CardImageContainer>}
        {action && <S.CardActionContainer>{action}</S.CardActionContainer>}

        {icon && (
          <S.IconContainer>
            {iconTooltip ? (
              <TippyTooltip placement="top" offset={[0, 3]} {...iconTooltip}>
                <SvgIcon icon={icon} size={16} {...iconProps} />
              </TippyTooltip>
            ) : (
              <SvgIcon icon={icon} size={16} {...iconProps} />
            )}
          </S.IconContainer>
        )}
      </S.CardContainer>

      {!!(title || subtitle) && (
        <S.InfoContainer>
          {!!title && <S.Title>{title}</S.Title>}
          {!!subtitle && <S.SubTitle>{subtitle}</S.SubTitle>}
        </S.InfoContainer>
      )}
    </S.OuterContainer>
  );
};

export default Object.assign(AssistantCard, {
  Image: S.Image,
  ProjectImage: S.ProjectImage,
});
