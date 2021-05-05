const isObject = function (o) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const isArray = function (a) {
  return Array.isArray(a);
};

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

export const keysToCamel = function (o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamel(o[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }

  return o;
};

export const buildName = entity =>
  [entity.firstName || '', entity.lastName || '']
    .filter(name => name)
    .join(' ');

export const buildAddress = ({ line1 = '', line2 = '', state = '', city = '', zipCode = '' }) => {
  const streetAddress = line1 || line2 ? `${line1}  ${line2}, ` : '';
  return `${streetAddress}${city} ${state} ${zipCode}`;
};

export const currency = value => {
  let numericValue = value;
  if (typeof value === 'string') {
    numericValue = parseInt(value, 10);
  }

  if (typeof numericValue !== 'number') {
    return '$0.00';
  }

  return `$${numericValue.toFixed(2)}`;
};

