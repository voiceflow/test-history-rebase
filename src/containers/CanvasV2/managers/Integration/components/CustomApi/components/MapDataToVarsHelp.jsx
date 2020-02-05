import React from 'react';

import { JSONCode, Paragraph, Section } from '@/componentsV2/Tooltip';

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

function MapDataToVarsHelp() {
  return (
    <>
      <Paragraph marginBottomUnits={2}>Let’s say you want to provide customers with the first quote in response and indicate its source.</Paragraph>

      <Section marginBottomUnits={2}>
        <JSONCode html={jsonExample} />
      </Section>

      <Paragraph>
        In the JSON above, the quotes belong to the “Records” array. To assign the first quote to a variable, you should enter the following path:
      </Paragraph>

      <Paragraph>
        <dl>
          <dt>Records.0.Quote</dt>
          <dd>“0” goes for the first item in an array, “1” — for the second.</dd>
        </dl>
      </Paragraph>

      <Paragraph>To get the source name, the path should be:</Paragraph>

      <Paragraph>
        <dl>
          <dt>Source.Name</dt>
        </dl>
      </Paragraph>
    </>
  );
}

export default MapDataToVarsHelp;
