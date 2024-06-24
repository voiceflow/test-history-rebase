import { Box, Typography } from '@mui/material';

import { VIEW_GROUP } from '@/views/views.constant';

const GroupViewPage = ({ params }: { params: { view: string; group: string } }) => {
  const groupView = VIEW_GROUP[params.group]?.views[params.view];

  if (!groupView) {
    return (
      <Box>
        <Typography variant="h3">Group or View not found.</Typography>
      </Box>
    );
  }

  return <groupView.component />;
};

export default GroupViewPage;
