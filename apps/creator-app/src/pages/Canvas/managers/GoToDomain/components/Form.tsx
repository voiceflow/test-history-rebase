import type * as Realtime from '@voiceflow/realtime-sdk';
import { Menu, SectionV2, Select } from '@voiceflow/ui';
import React from 'react';

import * as Domain from '@/ducks/domain';
import { useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface FormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.GoToDomain>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ editor, header, footer }) => {
  const domains = useSelector(Domain.allDomainsSelector);
  const domainMap = useSelector(Domain.domainsMapSelector);

  const { domainID } = editor.data;

  const domain = domainID ? domainMap[domainID] : null;

  return (
    <EditorV2 header={header ?? <EditorV2.DefaultHeader />} footer={footer ?? <EditorV2.DefaultFooter />}>
      <SectionV2.SimpleSection>
        <Select
          value={domainID}
          options={domains}
          onSelect={(value) => editor.onChange({ domainID: value })}
          clearable={!!domain}
          fullWidth={true}
          searchable={true}
          placeholder="Select a domain"
          getOptionKey={(option) => option.id}
          getOptionValue={(option) => option?.id}
          getOptionLabel={(value) => (value ? domainMap[value]?.name : null)}
          inDropdownSearch={true}
          alwaysShowCreate={true}
          clearOnSelectActive={true}
          createInputPlaceholder="domains"
          renderEmpty={({ search }: { search: string }) => (
            <Menu.NotFound>{!search ? 'No domains exists in your assistant. ' : 'No domains found. '}</Menu.NotFound>
          )}
        />
      </SectionV2.SimpleSection>
    </EditorV2>
  );
};

export default Form;
