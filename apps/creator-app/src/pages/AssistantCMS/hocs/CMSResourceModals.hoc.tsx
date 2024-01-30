import { Utils } from '@voiceflow/common';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { modalsManager } from '@/ModalsV2/manager';
import { AnyModal } from '@/ModalsV2/types';

import { useGetCMSResourcePath } from '../hooks/cms-resource.hook';

type ModalDefinition<Modal extends AnyModal> =
  | Modal
  | [
      modal: Modal,
      successHandler: (props: {
        history: ReturnType<typeof useHistory>;
        result: Modal['__vfModalResult'];
        getCMSResourcePath: ReturnType<typeof useGetCMSResourcePath>;
      }) => void
    ];

interface IWithCMSResourceModals {
  (): (Component: React.FC) => React.FC;

  <Modal extends AnyModal>(modal: ModalDefinition<Modal>): (Component: React.FC) => React.FC;

  <Modal1 extends AnyModal, Modal2 extends AnyModal>(modal1: ModalDefinition<Modal1>, modal2: ModalDefinition<Modal2>): (
    Component: React.FC
  ) => React.FC;

  <Modal1 extends AnyModal, Modal2 extends AnyModal, Modal3 extends AnyModal>(
    modal1: ModalDefinition<Modal1>,
    modal2: ModalDefinition<Modal2>,
    modal3: ModalDefinition<Modal3>
  ): (Component: React.FC) => React.FC;
}

export const withCMSResourceModals: IWithCMSResourceModals =
  (...modals: Array<ModalDefinition<AnyModal>>) =>
  (Component: React.FC) => {
    const supportedModals = modals.map((modal) => (Array.isArray(modal) ? modal : ([modal, () => {}] as const)));

    return setDisplayName(wrapDisplayName(Component, 'withCMSResourceModals'))(() => {
      const history = useHistory();
      const location = useLocation();
      const getCMSResourcePath = useGetCMSResourcePath();

      useEffect(() => {
        if (
          !Utils.object.isObject(location.state) ||
          !Utils.object.hasProperty(location.state, 'cmsResourceModalType') ||
          typeof location.state.cmsResourceModalType !== 'string'
        )
          return;

        const { cmsResourceModalType, cmsResourceModalProps } = location.state;

        const modal = supportedModals.find(([modal]) => modal.__vfModalType === cmsResourceModalType);

        if (!modal) return;

        modalsManager
          .open(Utils.id.cuid(), location.state.cmsResourceModalType, { props: cmsResourceModalProps ?? {} })
          .then((result) => modal[1]({ history, result, getCMSResourcePath }))
          .catch(() => {});
      }, [location.state]);

      return <Component />;
    });
  };
