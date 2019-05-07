const arr = (x) => Array.from(x);
const num = (x) => Number(x) || 0;
const str = (x) => String(x);
const isEmpty = (xs) => xs.length === 0;
const take = (n) => (xs) => xs.slice(0, n);
const drop = (n) => (xs) => xs.slice(n);
const reverse = (xs) => xs.slice(0).reverse();
const comp = (f) => (g) => (x) => f(g(x));
const not = (x) => !x;
const chunk = (n) => (xs) => (isEmpty(xs) ? [] : [take(n)(xs), ...chunk(n)(drop(n)(xs))]);

// numToWords :: (Number a, String a) => a -> String
const numToWords = (n) => {
  const a = [
    '', 'one', 'two', 'three', 'four',
    'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
    'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
  ];

  const b = [
    '', '', 'twenty', 'thirty', 'forty',
    'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
  ];

  const g = [
    '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion',
    'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion',
  ];

  // this part is really nasty still
  // it might edit this again later to show how Monoids could fix this up
  const makeGroup = ([ones, tens, huns]) => [
    num(huns) === 0 ? '' : `${a[huns]} hundred `,
    num(ones) === 0 ? b[tens] : b[tens] && `${b[tens]}-` || '',
    a[tens + ones] || a[ones],
  ].join('');

  const thousand = (group, i) => (group === '' ? group : `${group} ${g[i]}`);

  if (typeof n === 'number') return numToWords(String(n));
  if (n === '0') return 'zero';
  return comp(chunk(3))(reverse)(arr(n))
    .map(makeGroup)
    .map(thousand)
    .filter(comp(not)(isEmpty))
    .reverse()
    .join(' ');
};

function numsToWords(str) {
  const res = str
    .replace('1st', 'first')
    .replace('2nd', 'second')
    .replace('3rd', 'third')
    .replace('4th', 'fourth')
    .replace('5th', 'fifth')
    .replace(/[0-9][0-9]*/g, (x) => numToWords(x));
  return res;
}

exports.numToWords = numToWords;
exports.numsToWords = numsToWords;
