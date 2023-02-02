import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import Dropdown from '@ui/components/Dropdown';
import { AvatarList } from '@ui/components/Members';
import { OptionWithoutValue } from '@ui/components/Menu/types';
import type { SvgIconTypes } from '@ui/components/SvgIcon';
import SvgIcon from '@ui/components/SvgIcon';
import TippyTooltip from '@ui/components/TippyTooltip';
import { UserData } from '@ui/components/User';
import { useToggle } from '@ui/hooks';
import { Nullable, Utils } from '@voiceflow/common';
import React from 'react';

import {
  CardActionContainer,
  CardContainer,
  CardImageContainer,
  IconContainer,
  InfoContainer,
  MembersContainer,
  OuterContainer,
  ProjectImage,
  Status,
  StyledLink,
  SubTitle,
  Title,
} from './styles';

export interface AssistantCardProps extends React.PropsWithChildren {
  title?: string;
  hasTitleComponent?: boolean;
  isHovered?: boolean;
  status?: string;
  members?: UserData[];
  image?: Nullable<string>;
  icon?: SvgIconTypes.Icon;
  isViewer?: boolean;
  iconColor?: string;
  iconTitle?: string;
  options?: Nullable<OptionWithoutValue>[];
  backgroundImage?: string;
  onClickCTA?: () => void;
  onClickLink?: () => void;
}

// TODO: refactor component to remove options and etc
const AssistantCard: React.FC<AssistantCardProps> = ({
  isViewer,
  onClickCTA,
  onClickLink,
  icon,
  iconColor,
  iconTitle,
  image,
  title,
  hasTitleComponent,
  status,
  members,
  options,
  children,
  isHovered,
}) => {
  const [active, toggleActive] = useToggle(false);

  return (
    <OuterContainer>
      <CardContainer isHovered={isHovered} active={active}>
        <CardImageContainer className="assistant-card-image">
          {image ? <ProjectImage src={image} /> : <SvgIcon icon="systemImage" size={45} color="#393E42" />}
        </CardImageContainer>

        <CardActionContainer>
          <StyledLink onClick={onClickLink} />

          <Box.Flex zIndex={100} flexDirection="row">
            {(children && !hasTitleComponent) || (
              <>
                <Button onClick={onClickCTA} variant={Button.Variant.PRIMARY} squareRadius style={{ marginRight: isViewer ? 0 : 8 }}>
                  {isViewer ? 'View' : 'Designer'}
                </Button>

                {!!options?.length && (
                  <Dropdown options={options} selfDismiss placement="bottom" onClose={() => toggleActive(false)}>
                    {(ref, onToggle, isOpen) => (
                      <Button
                        ref={ref}
                        onClick={Utils.functional.chainVoid(onToggle, toggleActive)}
                        variant={Button.Variant.WHITE}
                        squareRadius
                        isActive={isOpen}
                        icon="ellipsis"
                        iconProps={{ size: 15 }}
                      />
                    )}
                  </Dropdown>
                )}
              </>
            )}
          </Box.Flex>
        </CardActionContainer>

        {icon && (
          <IconContainer>
            {iconTitle ? (
              <TippyTooltip placement="top" content={iconTitle} offset={[0, 3]}>
                <SvgIcon color={iconColor} icon={icon} size={16} />
              </TippyTooltip>
            ) : (
              <SvgIcon color={iconColor} icon={icon} size={16} />
            )}
          </IconContainer>
        )}
      </CardContainer>

      <InfoContainer>
        {!!title && !hasTitleComponent && <Title>{title}</Title>}

        {hasTitleComponent && children}

        <SubTitle>
          <Status>{status}</Status>

          {members && (
            <MembersContainer>
              <AvatarList members={members} flat small />
            </MembersContainer>
          )}
        </SubTitle>
      </InfoContainer>
    </OuterContainer>
  );
};
export default AssistantCard;
