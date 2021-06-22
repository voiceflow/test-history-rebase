import React from 'react';

import Box, { Flex } from '@/components/Box';
import Dropdown from '@/components/Dropdown';
import InlineInput, { InputVariant } from '@/components/Input';
import SvgIcon, { Icon } from '@/components/SvgIcon';
import { KeyName } from '@/constants';
import { Sentiment, SentimentArray } from '@/models';
import { SentimentToSVGName } from '@/pages/Conversations/constants';

import { ReportTagInputContext } from '../context';
import { InputWrapper, TagWrapper } from './components';

export interface MenuProps {
  exists: boolean;
}

export interface BaseReportTagInputProps {
  menu: ({ exists }: MenuProps) => React.ReactNode;
  selectedTags: (string | Icon)[];
  onChange: (value: string[]) => void;
}

export type TagInputVariantProps = Omit<BaseReportTagInputProps, 'menu' | 'tags'>;

const BaseReportTagInput: React.FC<BaseReportTagInputProps> = ({ menu, selectedTags = [], onChange }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const {
    state: { filteredTags, searchedTag, allTags },
    actions: { onSearch },
  } = React.useContext(ReportTagInputContext)!;

  const selectedTagObjects = allTags.filter((tag) => selectedTags.includes(tag.id));
  const onRemove = (tagID: string) => () => {
    onChange(selectedTags.filter((id) => id !== tagID));
  };

  const scrollTo = React.useCallback((...args) => containerRef.current?.scrollTo(...args), [selectedTags]);

  const onBackspace = (event: React.KeyboardEvent) => {
    const { key } = event;

    if (key && (key === KeyName.BACKSPACE || key === KeyName.DELETE) && !searchedTag.trim()) {
      onChange(selectedTags.splice(-1, 1));
    }
  };

  React.useLayoutEffect(() => {
    scrollTo({ top: containerRef.current?.scrollHeight });
  }, [selectedTags]);

  return (
    <Dropdown autoWidth placement="bottom-start" menu={menu({ exists: !!filteredTags.find((item) => item.label === searchedTag) })}>
      {(ref, onToggle, isOpen) => {
        return (
          <Box ref={ref} fullWidth>
            <InputWrapper ref={containerRef} isActive={isOpen} hasItems={!!selectedTags.length}>
              {selectedTagObjects.map((tag, i) => {
                const isIcon = SentimentArray.includes(tag.id as Sentiment);
                return (
                  <TagWrapper key={i}>
                    {isIcon ? (
                      <SvgIcon icon={SentimentToSVGName[tag.id as Sentiment]} size={22} />
                    ) : (
                      allTags.find((item) => item.id === tag.id)?.label
                    )}
                    <SvgIcon size={9} icon="close" clickable onClick={onRemove(tag.id)} />
                  </TagWrapper>
                );
              })}

              <Flex onClick={onToggle} flex={1}>
                <InlineInput
                  inline
                  ref={inputRef}
                  value={searchedTag}
                  data-role="tagsinput"
                  onKeyDown={onBackspace}
                  variant={InputVariant.INLINE}
                  placeholder={selectedTags.length ? '' : 'Add Tags'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
                />
              </Flex>
            </InputWrapper>
          </Box>
        );
      }}
    </Dropdown>
  );
};

export default BaseReportTagInput;
