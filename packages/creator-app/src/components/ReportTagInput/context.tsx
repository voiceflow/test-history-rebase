import React from 'react';

import * as ReportTags from '@/ducks/reportTag';
import { connect } from '@/hocs';
import { ReportTag } from '@/models';
import { ConnectedProps } from '@/types';

export interface ReportTagInputContextApi {
  state: {
    allTags: ReportTag[];
    filteredTags: ReportTag[];
    searchedTag: string;
  };
  actions: {
    onSearch: (tagLabel: string) => void;
    updateFilteredTags: (tagID: string) => void;
  };
}

export const ReportTagInputContext = React.createContext<ReportTagInputContextApi | null>(null);
export const { Consumer: ReportTagInputContextConsumer } = ReportTagInputContext;

// TODO: replace all SAMPLE_TAGS instances with 'tags' from props

export const UnconnectedReportTagInputContextProvider: React.FC<{ selectedTags: string[] } & ConnectedReportTagInputContextProps> = ({
  selectedTags,
  tags,
  children,
}) => {
  const [filteredTags, setFilteredTags] = React.useState<ReportTag[]>(tags.filter((tag) => !selectedTags.includes(tag.id)));
  const [searchedTag, setSearchedTag] = React.useState('');

  React.useEffect(() => {
    if (searchedTag.trim()) {
      setFilteredTags(filteredTags.filter((tag) => tag.label.includes(searchedTag)));
    }
  }, [searchedTag]);

  React.useEffect(() => {
    setFilteredTags(tags.filter((tag) => !selectedTags.includes(tag.id)));
  }, [selectedTags]);

  const api = {
    state: {
      filteredTags,
      searchedTag,
      allTags: tags,
    },
    actions: {
      onSearch: (tagLabel: string) => setSearchedTag(tagLabel),
      updateFilteredTags: (tagID: string) => setFilteredTags(filteredTags.filter((tag) => tag.id !== tagID)),
    },
  };

  return <ReportTagInputContext.Provider value={api}>{children}</ReportTagInputContext.Provider>;
};

const mapStateToProps = {
  tags: ReportTags.allReportTagsSelector,
};

const mapDispatchToProps = {
  addGlobalTag: ReportTags.addReportTag,
};

type ConnectedReportTagInputContextProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export const ReportTagInputProvider = connect(mapStateToProps, mapDispatchToProps)(UnconnectedReportTagInputContextProvider) as React.FC<{
  selectedTags: string[];
}>;
