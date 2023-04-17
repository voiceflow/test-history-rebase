import { Box, Button, ButtonVariant, FlexCenter, Link, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { NLURoute } from '@/config/routes';

import { EMPTY_VIEW_META } from './constants';

interface EmptyViewProps {
  onCreate: VoidFunction;
  tab: NLURoute;
}

const EmptyView: React.FC<EmptyViewProps> = ({ onCreate, tab }) => {
  const tabContent = EMPTY_VIEW_META[tab];

  if (!tabContent) return null;

  const { namePlural, name, description, link, svg } = tabContent;

  return (
    <Box p="60px 74px">
      <FlexCenter>
        <SvgIcon size={80} icon={svg} />
      </FlexCenter>

      <FlexCenter>
        <Box mt={16} fontWeight={600}>
          No {namePlural} currently exist
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Box mt={8} mb={16} textAlign="center" color="#62778c" maxWidth={250}>
          {description} <Link href={link}>Learn more</Link>
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Button variant={ButtonVariant.PRIMARY} onClick={onCreate}>
          {tab === NLURoute.INTENTS ? `Import ${namePlural}` : `Create ${name}`}
        </Button>
      </FlexCenter>
    </Box>
  );
};

export default EmptyView;
