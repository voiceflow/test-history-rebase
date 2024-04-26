import { Nullish } from '@voiceflow/common';
import { Box, Button, ButtonVariant, Modal, Select, SvgIcon, toast } from '@voiceflow/ui';
import { AxiosError } from 'axios';
import React from 'react';

import { createChargebeeTokenURLEndpoint } from '@/client/billing';
import { Organization, Session } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { openURLInTheSameTab } from '@/utils/window';

import manager from '../../manager';
import { PURCHASE_OPTIONS } from './constants';

export interface ITokenPurchase {
  workspaceID?: string;
}

const Purchase = manager.create<ITokenPurchase>('TokensPurchase', () => ({ api, type, opened, hidden, animated, workspaceID }) => {
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const [option, setOption] = React.useState<Nullish<(typeof PURCHASE_OPTIONS)[number]>>(null);
  const [loading, setLoading] = React.useState(false);
  const chargebeeTokenURLEndpoint = createChargebeeTokenURLEndpoint(workspaceID ?? activeWorkspaceID, subscription?.customerID);

  const getChargebeeRedirectURL = () => {
    const { href } = window.location;
    const separator = href.includes('?') ? '&' : '?';
    return `${href}${separator}chargebee_payment_redirect=true`;
  };

  const onPurchaseTokens = async () => {
    const redirectURL = getChargebeeRedirectURL();

    if (option && option.value) {
      try {
        setLoading(true);

        const fetchURL = await chargebeeTokenURLEndpoint({
          quantity: option.value,
          redirectURL,
        });

        openURLInTheSameTab(fetchURL);
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message);
        }

        setLoading(false);
      }
    }

    return null;
  };

  return (
    <Modal maxWidth={400} type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>Purchase Tokens</Modal.Header>
      <Modal.Body pt={0} paddingX={45}>
        <Box.FlexCenter pb={16}>The price for additional tokens is $5 per 1 Million tokens.</Box.FlexCenter>

        <Select
          value={option}
          options={PURCHASE_OPTIONS}
          onSelect={(value) => setOption(value)}
          getOptionLabel={(value) => value?.label}
          getOptionValue={(value) => value}
          getOptionKey={({ value }) => value}
          placeholder="Select number of tokens"
        />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button width={150} variant={ButtonVariant.PRIMARY} onClick={onPurchaseTokens} disabled={!option || loading}>
          {loading ? <SvgIcon icon="arrowSpin" spin /> : 'Go to Checkout'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Purchase;
