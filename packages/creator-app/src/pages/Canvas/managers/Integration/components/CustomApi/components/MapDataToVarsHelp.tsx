import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const jsonExample = `{
    <span>"Records"</span>:  [
        {
          <span>"Author"</span>:  <span>"Amy Poehler"</span>,
          <span>"Quote"</span>:  <span>"Change the world by being yourself."</span>
        },
        {
          <span>"Author"</span>:  <span>"Richard Bach"</span>,
          <span>"Quote"</span>:  <span>"Everything you can imagine is real."</span>
        }
    ],
    <span>"Source"</span>:  {
        <span>"ID"</span>:  <span>"1"</span>,
        <span>"Name"</span>:  <span>"Wikipedia"</span>
    }
}`;

const MapDataToVarsHelp: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={2}>
      Let’s say you want to provide customers with the first quote in response and indicate its source.
    </Tooltip.Paragraph>

    <Tooltip.Section marginBottomUnits={2}>
      <Tooltip.JSONCode html={jsonExample} />
    </Tooltip.Section>

    <Tooltip.Paragraph>
      In the JSON above, the quotes belong to the “Records” array. To assign the first quote to a variable, you should enter the following path:
    </Tooltip.Paragraph>

    <Tooltip.Paragraph>
      <dl>
        <dt>Records.0.Quote</dt>
        <dd>“0” goes for the first item in an array, “1” — for the second.</dd>
      </dl>
    </Tooltip.Paragraph>

    <Tooltip.Paragraph>To get the source name, the path should be:</Tooltip.Paragraph>

    <Tooltip.Paragraph>
      <dl>
        <dt>Source.Name</dt>
      </dl>
    </Tooltip.Paragraph>
  </>
);

export default MapDataToVarsHelp;
