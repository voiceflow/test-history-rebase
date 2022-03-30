import { Box, Button, ButtonVariant, FlexCenter, Link, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';

import { EMPTY_VIEW_META } from './constants';

const EmptyView: React.FC = () => {
  const { activeTab, triggerNewInlineIntent, triggerNewInlineEntity } = React.useContext(NLUQuickViewContext);
  const { namePlural, name, description, link, svg } = EMPTY_VIEW_META[activeTab];
  const handleOnCreate = () => {
    switch (activeTab) {
      case InteractionModelTabType.INTENTS:
        triggerNewInlineIntent();
        break;
      case InteractionModelTabType.SLOTS:
        triggerNewInlineEntity();
        break;
      default:
        break;
    }
  };
  return (
    <Box p="60px 74px">
      <FlexCenter>
        <SvgIcon size={60} icon={svg} />
      </FlexCenter>
      <FlexCenter>
        <Box mt={16} fontWeight={600}>
          No {namePlural} currently exist
        </Box>
      </FlexCenter>
      <FlexCenter>
        <Box mt={16} mb={16} textAlign="center">
          {description} <Link href={link}>Learn more</Link>
        </Box>
      </FlexCenter>
      <FlexCenter>
        <Button squareRadius variant={ButtonVariant.PRIMARY} onClick={handleOnCreate}>
          Create {name}
        </Button>
      </FlexCenter>
    </Box>
  );
};

export default EmptyView;
