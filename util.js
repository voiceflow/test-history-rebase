'use strict';

exports.delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

exports.pg_num = (length) => {
  let nums = '';
  for (let i = 1; i <= length; i++) {
    nums += (`$${i}`);
    if (i !== length) {
      nums += ',';
    }
  }
  return nums;
};
