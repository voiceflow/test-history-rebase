import React from 'react';

import { Amount, Container, Date, Details, Heading, Items, NothingText } from './InfoSectionComponents';

function InvoiceInfoSection({ title, data }) {
  return (
    <Container>
      <Heading heading={title} />
      {data?.length ? (
        data.map((invoice, index) => {
          const { amount, items, date, status } = invoice;
          return (
            <Details key={index}>
              <Date>{date}</Date>
              {status && <div className="text-danger">({status})</div>}
              <Amount>${amount}</Amount>
              <Items>
                {items.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </Items>
            </Details>
          );
        })
      ) : (
        <NothingText>Nothing to show</NothingText>
      )}
    </Container>
  );
}

export default InvoiceInfoSection;
