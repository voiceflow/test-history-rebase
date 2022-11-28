import { Box, BoxFlex, Button, ButtonVariant, Dropdown, Input, MenuTypes, SecondaryButtonProps, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';
import { ProjectAPIKey } from '@/models';

import { ContentSection, Section } from '../../components';

export interface ProjectAPIKeySectionProps {
  title: string;
  options: MenuTypes.OptionWithoutValue[];
  apiKey: ProjectAPIKey | null;
  show: boolean;
  onToggleShow: () => void;
}

const DropdownButton = styled(Button).attrs({ variant: ButtonVariant.SECONDARY, icon: 'ellipsis' })<SecondaryButtonProps>``;

const ProjectAPIKeySection: React.FC<ProjectAPIKeySectionProps> = ({ children, title, apiKey, show, options, onToggleShow }) => {
  return (
    <ContentSection>
      <Section title={title}>
        {!!apiKey && (
          <BoxFlex>
            <Input
              value={apiKey.key}
              type={show ? 'text' : 'password'}
              readOnly
              rightAction={
                <SvgIcon icon={show ? 'eye' : 'eyeHide'} onClick={onToggleShow} color="#becedc" clickable style={{ userSelect: 'none' }} />
              }
            />
            <Box ml={16}>
              <Dropdown options={options} placement="bottom" selfDismiss={true}>
                {(ref, onToggle, isOpen) => <DropdownButton onClick={onToggle} ref={ref} isActive={isOpen} />}
              </Dropdown>
            </Box>
            <Box ml={10}>{children}</Box>
          </BoxFlex>
        )}
      </Section>
    </ContentSection>
  );
};

export default ProjectAPIKeySection;
