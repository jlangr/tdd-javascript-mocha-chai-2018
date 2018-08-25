export const normalize = name => {
  throwWhenInvalid(name);
  const suffixlessName = removeSuffix(name.trim());
  if (isSingleWord(suffixlessName)) 
    return `${suffixlessName}${suffix(name)}`;
  return `${lastName(suffixlessName)}, ${firstName(suffixlessName)}${middleInitials(suffixlessName)}${suffix(name)}`;
};

const countOfChar = (s, c) => (s.match(new RegExp(c, 'g'))||[]).length;

const throwWhenInvalid = name => {
  if (countOfChar(name, ',') > 1)
    throw new Error('too many commas');
}

const trimmedParts = name => name.split(',').map(name => name.trim());

const suffix = name => {
  const parts = trimmedParts(name);
  if (parts.length === 1) return '';
  return `, ${parts[1]}`;
};

const removeSuffix = name => {
  const parts = trimmedParts(name);
  if (parts.length === 1) return name;
  return parts[0];
};

const middleInitials = name => {
  const parts = name.split(' ');
  return parts.length <= 2 ? '' : ` ${parts.slice(1, -1).map(initial).join(' ')}`;
};

const initial = name => name.length === 1 ? name : `${name[0]}.`;

const firstName = name => {
  return name.split(' ')[0];
};

const lastName = name => {
  const parts = name.split(' ');
  return parts[parts.length - 1];
};

const isSingleWord = name => name.split(' ').length === 1;