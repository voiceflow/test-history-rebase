import React from 'react';

import { Flex } from '@/components/Box';
import { FlexCenter, FlexEnd } from '@/components/Flex';
import { BackButton } from '@/components/Header/components';
import SvgIcon from '@/components/SvgIcon';
import { FeatureFlag } from '@/config/features';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature, useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ProgressStage } from '@/pages/Publish/Upload/components';
import { PublishContext } from '@/pages/Skill/contexts';
import { useMarkupMode } from '@/pages/Skill/hooks';
import ArrowLeftIcon from '@/svgs/arrow-left.svg';
import { ConnectedProps } from '@/types';

import { HeaderContainer, NavigateBackTextContainer, SubHeader } from './components';

export type BackButtonHeaderProps = {
  render?: boolean;
  header?: React.ReactNode;
  subHeader?: React.ReactNode;
  onNavigateBack: () => void;
  navigateBackText?: string;
};

const BackButtonComp: React.FC<any> = BackButton;

const BackButtonHeader: React.FC<BackButtonHeaderProps & ConnectedBackButtonHeaderProps> = ({
  render,
  header,
  subHeader,
  onNavigateBack,
  navigateBackText,
  children,
  goToDesign,
  goToPrototype,
  goToPublish,
  isViewerOrLibraryRole,
}) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);
  const publishContextValue = React.useContext(PublishContext)!;
  const isMarkupMode = useMarkupMode();

  useHotKeys(
    Hotkey.TEST_MODE,
    () => {
      if (!isMarkupMode) goToPrototype();
    },
    { preventDefault: true },
    [isMarkupMode]
  );
  useHotKeys(Hotkey.DESIGN_PAGE, () => goToDesign());
  useHotKeys(Hotkey.LAUNCH_PAGE, () => !isViewerOrLibraryRole && goToPublish());

  return render ? (
    <>
      {headerRedesign.isEnabled && publishContextValue?.job?.stage.data && (
        <ProgressStage progress={(publishContextValue?.job?.stage.data as any)!.progress} />
      )}
      <HeaderContainer style={{ minWidth: '100%' }}>
        <Flex style={{ padding: 'none', height: '70px', backgroundColor: '#fff' }}>
          <FlexCenter style={{ minWidth: '100%', height: '100%', padding: 'none' }}>
            {onNavigateBack && (
              <BackButtonComp hasBackText={!!navigateBackText} onClick={onNavigateBack}>
                <SvgIcon icon={ArrowLeftIcon} size={14} className="icon-back" />
                {navigateBackText && <NavigateBackTextContainer>{navigateBackText}</NavigateBackTextContainer>}
              </BackButtonComp>
            )}
            {header}
            <FlexEnd
              style={{
                padding: 'none',
                alignItems: 'center',
                marginRight: '32px',
                width: '100%',
                minHeight: '100%',
                height: '100%',
              }}
            >
              {children}
            </FlexEnd>
          </FlexCenter>
        </Flex>
        {subHeader && <SubHeader>{subHeader}</SubHeader>}
      </HeaderContainer>
    </>
  ) : null;
};

const mapStateToProps = {
  isViewerOrLibraryRole: Workspace.isViewerOrLibraryRoleSelector,
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
  goToPrototype: Router.goToCurrentPrototype,
  goToPublish: Router.goToActivePlatformPublish,
};

type ConnectedBackButtonHeaderProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(BackButtonHeader) as React.FC<BackButtonHeaderProps>;
