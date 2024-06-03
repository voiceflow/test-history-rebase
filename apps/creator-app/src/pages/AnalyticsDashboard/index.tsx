import { Dropdown, Header, Menu, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { AssistantLayout } from '@/components/Assistant/AssistantLayout/AssistantLayout.component';

import { AnalyticsDashboardContainer, AnalyticsDashboardGrid, AnalyticsDashboardTile, Tiles } from './components';
import { DONUT_CHART_COLORS, PeriodFilterOption } from './constants';
import { AnalyticsDashboardContext } from './context';
import { getLabelForPeriod } from './utils';

const AnalyticsDashboard: React.FC = () => {
  const analyticsDashboard = React.useContext(AnalyticsDashboardContext);
  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 11] } }]);

  const { interactions, recognitionRate, users, sessions, topIntents } = analyticsDashboard;

  return (
    <AssistantLayout>
      <Header variant="buttons">
        <Header.Section.Left>
          <Dropdown
            value={getLabelForPeriod(analyticsDashboard.filters.period)}
            variant="dark"
            fontSize="caption"
            isSmall
            weight="semiBold"
          >
            {({ onClose }) => (
              <Menu minWidth="fit-content" onClick={onClose}>
                {Object.values(PeriodFilterOption).map((period) => (
                  <Menu.Item
                    key={period}
                    label={getLabelForPeriod(period)}
                    onClick={() => analyticsDashboard.setFilters({ period })}
                  />
                ))}
              </Menu>
            )}
          </Dropdown>
        </Header.Section.Left>

        <Header.Section.Right>
          <Header.Section.RightActions>
            <Tooltip
              variant="dark"
              placement="bottom"
              modifiers={modifiers}
              referenceElement={({ ref, onOpen, onClose }) => (
                <Header.Button.IconSecondary
                  ref={ref}
                  onClick={() => analyticsDashboard.refresh()}
                  iconName="Reset"
                  onMouseEnter={onOpen}
                  onMouseLeave={onClose}
                />
              )}
            >
              {() => <Tooltip.Caption mb={0}>Refresh</Tooltip.Caption>}
            </Tooltip>
          </Header.Section.RightActions>
        </Header.Section.Right>
      </Header>

      <AnalyticsDashboardContainer isNewLayout>
        <AnalyticsDashboardGrid isNewLayout>
          {/* Row 1 */}
          <AnalyticsDashboardTile
            title="Interactions"
            description="Total number of engagements users have had with your agent."
            width={2}
            height={1}
            query={interactions}
          >
            <Tiles.AnalyticsDashboardTileGraph query={interactions} size="large" testID="interaction-chart" />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile
            title="Recognition rate"
            description="The % of messages understood by your agent."
            labels={[
              { title: 'Recognized', color: DONUT_CHART_COLORS.GOOD },
              { title: 'Not understood', color: DONUT_CHART_COLORS.BAD },
            ]}
            width={1}
            height={1}
            query={recognitionRate}
          >
            <Tiles.AnalyticsDashboardTileDonut query={recognitionRate} testID="recognition-rate-chart" />
          </AnalyticsDashboardTile>

          {/* Row 2 */}
          <AnalyticsDashboardTile
            title="Users"
            description="Unique user sessions with your agent."
            width={1}
            height={1}
            query={users}
          >
            <Tiles.AnalyticsDashboardTileGraph query={users} size="small" testID="unique-users-chart" />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile
            title="Sessions"
            description="Unique user sessions with your agent."
            width={1}
            height={1}
            query={sessions}
          >
            <Tiles.AnalyticsDashboardTileGraph query={sessions} size="small" testID="unique-sessions-chart" />
          </AnalyticsDashboardTile>
          <AnalyticsDashboardTile
            title="Top Intents"
            description="The most popular queries users ask your agent."
            width={1}
            height={1}
            query={topIntents}
          >
            <Tiles.AnalyticsDashboardTileBars query={topIntents} testID="intent-chart" />
          </AnalyticsDashboardTile>
        </AnalyticsDashboardGrid>
      </AnalyticsDashboardContainer>
    </AssistantLayout>
  );
};

export default AnalyticsDashboard;
