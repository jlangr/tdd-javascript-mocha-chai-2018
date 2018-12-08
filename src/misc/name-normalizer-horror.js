
/* normalize the name by breaking into its
   constituent parts so that it can be put
   into a list in alphabetical order */
export const normalizeName = (name) => {
  // error
  const s = name;
  let c = 0;
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === ',') c += 1;
  }
  // count commas
  if (c > 1) {
    console.log('error with commas');
    throw new TypeError();
  }
  if (name.length === 0) {
    return name;
  }
  let i = name.indexOf(',');
  let sx = '';
  if (i > -1) {
    sx = name.substr(i);
    name = name.substr(0, i);
  }
  // exactly 3 parts
  if (name.trim().split(' ').length === 3) {
    const t = name.trim().split(' ');
    return t[2] + ', ' + t[0] + ' ' + t[1].slice(0, 1) 
      + (t[1].length === 1 ? '' : '.')
      + (sx.length > 0 ? ',' + sx : '');
  }
  // less than 3 parts
  else if (name.trim().split(' ').length > 3) {
    const t = name.trim().split(' ');
    let l = t.slice(-1)[0];
    console.log('L: ', l);
    let s = `${l}, `;
    s += t[0];
    for (let i = 1; i < t.length - 1; i++) {
      s += ' ' + t[i].slice(0, 1) + (1 < t[i].length ? '.' : '');
      if (sx.length === 0) {
      }
      else {
        s += ',';
        s += sx;
      }
    }
    return s;
//      + (t[1].length === 1 ? '' : '.');
  }
  else {
    // simple solution--2 parts
    const t = name.trim();
    const np = t.split(' ');
    let rv = np.reverse().join(', ');
    rv += (sx.length > 0 ? '' : '');
    if (sx.length > 0) {
      rv += sx;
    }
    return rv;
  }
};
