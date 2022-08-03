/* eslint-disable no-await-in-loop */
/* eslint-disable operator-assignment */
/* eslint-disable sonarjs/cognitive-complexity */
import { ServerNode } from '@logux/core';

// referenced from https://github.com/logux/core/blob/master/sync/index.js#L40
ServerNode.prototype.syncMessage = async function (added, ...data) {
  for (let i = 0; i < data.length - 1; i += 2) {
    const action = data[i];
    const meta = data[i + 1];

    if (typeof meta.id === 'number') {
      meta.id = `${meta.id + this.baseTime} ${this.remoteNodeId} ${0}`;
    } else {
      meta.id[0] = meta.id[0] + this.baseTime;
      if (meta.id.length === 2) {
        meta.id = `${meta.id[0]} ${this.remoteNodeId} ${meta.id[1]}`;
      } else {
        meta.id = meta.id.join(' ');
      }
    }

    meta.time += this.baseTime;
    if (this.timeFix) meta.time += this.timeFix;

    let process = Promise.resolve([action, meta]);

    if (this.options.inMap) {
      process = process
        .then(([action2, meta2]) => {
          return this.options.inMap(action2, meta2);
        })
        .catch((e) => {
          this.error(e);
        });
    }

    await process
      .then((filtered) => {
        if (filtered && this.options.inFilter) {
          return this.options
            .inFilter(...filtered)
            .then((res) => {
              return res ? filtered : false;
            })
            .catch((e) => {
              this.error(e);
            });
        }
        return filtered;
      })
      .then((changed) => {
        if (!changed) return false;
        if (this.received) this.received[changed[1].id] = true;
        return this.log.add(changed[0], changed[1]);
      });
  }

  this.setLastReceived(added);
  this.sendSynced(added);
};
