import { BaseModels, BaseProject } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Checkbox, Modal, Select, SvgIcon, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import * as Domain from '@/ducks/domain';
import { useSelector } from '@/hooks/redux';
import manager from '@/ModalsV2/manager';

interface PartialImportManagerProps {
  data: Realtime.Migrate.MigrationData & { project: BaseProject.Project };
  save: (topicIDs: string[], targetDomainID: string) => void;
}

const PartialImportManager = manager.create<PartialImportManagerProps>(
  'PartialImportManager',
  () =>
    ({ save, data, api, type, opened, hidden, animated, closePrevented }) => {
      const [selectedTopicIDs, setSelectedTopicIDs] = React.useState(new Set<string>());
      const [targetDomainID, setTargetDomain] = React.useState<string | null>(null);

      const topicsMap = React.useMemo(() => {
        return Object.fromEntries(
          data.diagrams.filter((diagram) => diagram.type === BaseModels.Diagram.DiagramType.TOPIC).map((diagram) => [diagram._id, diagram])
        );
      }, [data]);

      const domains = useSelector(Domain.allDomainsSelector);

      const currentDiagramIDs = useSelector(DiagramV2.allDiagramIDsSelector);

      const getTopicLabel = (topicID: string) => {
        const checked = selectedTopicIDs.has(topicID);
        const topic = topicsMap[topicID];
        const name = topic.name === 'ROOT' ? 'Home' : topic.name;

        return (
          <Checkbox
            checked={checked}
            onChange={() => {
              const newSet = new Set(selectedTopicIDs);
              if (checked) newSet.delete(topicID);
              else newSet.add(topicID);
              setSelectedTopicIDs(newSet);
            }}
          >
            <Box.Flex fontWeight={400} color={ThemeColor.PRIMARY} gap={8}>
              {name}
              {currentDiagramIDs.includes(topicID) && (
                <TippyTooltip content={<Box width={160}>Importing will overwrite existing topic.</Box>} placement="right">
                  <Box color={ThemeColor.DARK_BLUE}>
                    <SvgIcon icon="warning" />
                  </Box>
                </TippyTooltip>
              )}
            </Box.Flex>
          </Checkbox>
        );
      };

      const importDomains = data.version.domains ?? [];

      const domainMap = React.useMemo(() => {
        return Object.fromEntries(domains.map((domain) => [domain.id, domain]));
      }, [domains]);

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>
            Import Topics
          </Modal.Header>
          <Modal.Body mt={16}>
            <Box mb={11} fontWeight={600}>
              1. Select topics to be imported
            </Box>
            <Box mb={11} color={ThemeColor.SECONDARY} fontSize={13}>
              <b>Project Name:</b> {data.project.name}
              <br />
              Last Updated {dayjs(data.project.updatedAt).format('h:mmA, MMM D, YYYY')}
            </Box>

            <Box.FlexColumn gap={12} alignItems="stretch">
              {importDomains.map((domain) => (
                <Box key={domain.id}>
                  <Box mb={4} color={ThemeColor.SECONDARY} fontSize={13}>
                    <b>Domain:</b> {domain.name}
                  </Box>
                  {domain.topicIDs.map((topicID) => {
                    const topic = topicsMap[topicID];
                    if (!topic) return null;

                    return (
                      <Box key={topicID} mb={6}>
                        {getTopicLabel(topicID)}
                        {topic.menuItems
                          ?.filter((item) => item.type === BaseModels.Diagram.MenuItemType.DIAGRAM && !!topicsMap[item.sourceID])
                          .map(({ sourceID }) => (
                            <Box key={sourceID} color={ThemeColor.SECONDARY} ml={28} my={6}>
                              {getTopicLabel(sourceID)}
                            </Box>
                          ))}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box.FlexColumn>
            <hr />
            <Box mb={11} fontWeight={600}>
              2. Target Domain
            </Box>
            <Select<Realtime.Domain, string>
              options={domains}
              value={targetDomainID}
              placeholder="Select target domain"
              onSelect={(domainID) => setTargetDomain(domainID)}
              getOptionKey={(domain) => domain?.id}
              getOptionValue={(domain) => domain?.id}
              getOptionLabel={(domainID) => domainMap[domainID!]?.name}
              clearable={false}
            />
          </Modal.Body>
          <Modal.Footer gap={12}>
            <Button onClick={api.close} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
              Cancel
            </Button>
            <Button
              disabled={closePrevented || !selectedTopicIDs.size || !targetDomainID}
              onClick={() => save(Array.from(selectedTopicIDs), targetDomainID!)}
            >
              Add Topics
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default PartialImportManager;
