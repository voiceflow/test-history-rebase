import cn from 'classnames';
import React from 'react';

import Button from '@/components/Button';

import PLANS from './PLANS';

// eslint-disable-next-line react/display-name
export default ({ plan, upgrade, delay, team, downgrade }) => {
  if (!(plan in PLANS)) return null;

  const pricing = PLANS[plan];
  const current = team && team.status === pricing.id;

  return (
    <div>
      <div
        className={cn('pricing-card px-3 py-4 text-center fadein flex-column d-flex justify-content-between', {
          selected: current,
        })}
        style={{ animationDelay: delay ? `${delay}ms` : undefined }}
      >
        <div>
          <img src={pricing.image} width="70" height="70" alt={pricing.name} />
          <div className="card-title mt-3 mb-3">{pricing.name}</div>
          <div className="d-flex justify-content-center my-2">
            <div className="upgrade-plan-price-sum__symbol">$</div>
            <div className="upgrade-plan-price-sum__cost">{pricing.rate}</div>
            <div className="upgrade-plan-price-sum__period">/ mo</div>
          </div>
          <small className="text-dull">PER SEAT</small>
          <div className="my-4">
            {pricing.features.map((f, i) => (
              <div key={i} className="my-3">
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="mb-2">
          {current ? (
            <Button isPrimary disabled>
              Current Plan
            </Button>
          ) : (
            upgrade && (
              <Button isPrimary className="mt-2" onClick={() => upgrade(pricing)}>
                Upgrade Plan
              </Button>
            )
          )}
        </div>
      </div>
      {downgrade ? (
        <div className="text-center" style={{ animationDelay: delay ? `${delay}ms` : undefined }}>
          <div className="btn-link px-3 py-2 text-center fadein" onClick={() => downgrade()}>
            Downgrade to Personal
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};
