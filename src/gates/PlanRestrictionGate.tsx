import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { ModalType } from '@/constants';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { ConnectedProps } from '@/types';

export type PlanRestrictionGateProps = {
  children: React.ReactElement;
};

const PlanRestrictionGate: React.FC<PlanRestrictionGateProps & ConnectedPlanRestrictionGateProps> = ({
  hasRestriction,
  resetRestriction,
  goToHome,
  children,
}) => {
  const { open: openRestrictionModal } = useModals(ModalType.REALTIME_DENIED);

  const lockProject = React.useCallback(() => {
    if (hasRestriction) {
      goToHome();
      openRestrictionModal();
      resetRestriction();
    }
  }, [hasRestriction]);

  return (
    <LoadingGate label="Plan Restriction" isLoaded={!hasRestriction} load={lockProject}>
      {children}
    </LoadingGate>
  );
};

const mapStateToProps = {
  hasRestriction: Realtime.isRestrictedSelector,
};

const mapDispatchToProps = {
  resetRestriction: Realtime.resetRealtimeRestriction,
  goToHome: Router.goToHome,
};

type ConnectedPlanRestrictionGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PlanRestrictionGate);
