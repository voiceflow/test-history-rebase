import React from 'react';
import { SuggestionDataItem } from 'react-mentions';

import Flex from '@/components/Flex';
import Text from '@/components/Text';
import User from '@/components/User';
import { DBWorkspace } from '@/models';
import { capitalizeAllWords } from '@/utils/string';

export type SuggestionItemProps = {
  suggestion: SuggestionDataItem;
  members: DBWorkspace.Member[];
};

const SuggestionItem: React.FC<SuggestionItemProps> = ({ suggestion, members }) => {
  const user = React.useMemo(() => members.find((member: DBWorkspace.Member) => member.creator_id === suggestion.id)!, [suggestion, members]);

  return (
    <Flex>
      <User user={user} />
      <Text fontWeight={600} ml={10} fontSize={15}>
        {capitalizeAllWords(user.name)}
      </Text>
    </Flex>
  );
};

export default SuggestionItem;
