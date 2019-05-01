import React from "react";
import cn from "classnames";

export const Spinner = props => {
  return (
    <div id="loading-diagram" className={cn({transparent: props.transparent})}>
      <div className="text-center">
        <h5 className="text-muted mb-2">
          {props.message || `Loading ${props.name}`}
        </h5>
        <span className="loader" />
      </div>
    </div>
  );
};
