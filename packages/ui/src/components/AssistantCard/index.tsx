import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import Dropdown from '@ui/components/Dropdown';
import Members from '@ui/components/Members';
import { OptionWithoutValue } from '@ui/components/Menu/types';
import type { SvgIconTypes } from '@ui/components/SvgIcon';
import SvgIcon from '@ui/components/SvgIcon';
import { UserData } from '@ui/components/User';
import { Nullable } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import React from 'react';

import {
  CardContainer,
  IconContainer,
  InfoContainer,
  InnerContainer,
  MembersContainer,
  OuterContainer,
  ProjectImage,
  Status,
  StyledLink,
  SubTitle,
  Title,
} from './styles';

export interface AssistantCardProps {
  title?: string;
  status?: string;
  members?: UserData[];
  image?: Nullable<string>;
  userRole?: UserRole;
  icon?: SvgIconTypes.Icon;
  iconColor?: string;
  options?: Nullable<OptionWithoutValue>[];
  backgroundImage?: string;
  children?: React.ReactChild;
  onClickCTA?: () => void;
}

const AssistantCard: React.FC<AssistantCardProps> = ({
  userRole = 'viewer',
  onClickCTA,
  icon,
  iconColor,
  image,
  title,
  status,
  members,
  options,
  children,
}) => {
  const [active, setActive] = React.useState(false);
  const isViewer = userRole === UserRole.VIEWER;

  return (
    <OuterContainer>
      <CardContainer active={active}>
        <InnerContainer className="assistant-card-image">
          {image ? <ProjectImage src={image} /> : <SvgIcon icon="systemImage" size={45} color="#393E42" />}
        </InnerContainer>

        <InnerContainer className="assistant-card-actions">
          <StyledLink />
          <Box.Flex zIndex={100}>
            <Box.Flex flexDirection="row">
              {children || (
                <>
                  <Button onClick={onClickCTA} variant={Button.Variant.PRIMARY} squareRadius style={{ marginRight: isViewer ? 0 : 10 }}>
                    {isViewer ? 'View' : 'Designer'}
                  </Button>

                  {options && (
                    <Dropdown options={options} selfDismiss placement="bottom" onClose={() => setActive(false)}>
                      {(ref, onToggle) => (
                        <Button
                          ref={ref}
                          onClick={() => {
                            onToggle();
                            if (!active) setActive(true);
                          }}
                          variant={Button.Variant.WHITE}
                          squareRadius
                        >
                          <SvgIcon icon="ellipsis" size={15} />
                        </Button>
                      )}
                    </Dropdown>
                  )}
                </>
              )}
            </Box.Flex>
          </Box.Flex>
        </InnerContainer>
        {icon && (
          <IconContainer>
            <SvgIcon color={iconColor} icon={icon} size={16} />
          </IconContainer>
        )}
      </CardContainer>
      <InfoContainer>
        <Title>{title}</Title>
        <SubTitle>
          <Status>{status}</Status>
          {members && (
            <MembersContainer>
              <Members members={members} flat small />
            </MembersContainer>
          )}
        </SubTitle>
      </InfoContainer>
    </OuterContainer>
  );
};
export default AssistantCard;
