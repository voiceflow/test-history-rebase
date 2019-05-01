import React from "react";
import PLANS from "./PLANS";
import cn from "classnames";

export default ({ plan, upgrade, delay, team }) => {
  if (!(plan in PLANS)) return null;

  const pricing = PLANS[plan];
  const current = team && team.status === pricing.id;

  return (
    <div
      className={cn("pricing-card px-3 py-4 text-center fadein", {
        selected: current
      })}
      style={{ animationDelay: delay ? `${delay}ms` : undefined }}
    >
      <img src={pricing.image} width="60" height="45" alt={pricing.name} />
      <div className="font-weight-bold mt-3">{pricing.name}</div>
      <div className="d-flex justify-content-center my-2">
        <div className="upgrade-plan-price-sum__symbol">$</div>
        <div className="upgrade-plan-price-sum__cost">{pricing.rate}</div>
        <div className="upgrade-plan-price-sum__period">/ mo</div>
      </div>
      <small className="text-dull">PER SEAT</small>
      <div className="my-4 small">
        {pricing.features.map((f, i) => {
          return (
            <div key={i} className="my-3">
              {f}
            </div>
          );
        })}
      </div>
      <div className="mb-2">
        {current ? (
          <button className="btn-primary disabled" disabled>Current Plan</button>
        ) : (
          upgrade && (
            <button className="btn-primary" onClick={() => upgrade(pricing)}>
              Upgrade
            </button>
          )
        )}
      </div>
    </div>
  );
};
