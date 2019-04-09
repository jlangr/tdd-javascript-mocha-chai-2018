// You may find this useful for a later test:
//const countOfChar = (s, c) => (s.match(new RegExp(c, 'g'))||[]).length;

const lastName = name => partsOfName(name)[1]

const firstName = name => partsOfName(name)[0]

const isMononym = name => partsOfName(name).length === 1

const partsOfName = name => name.split(' ')

export const normalize = name => {
  if (isMononym(name)) return name
  return `${lastName(name)}, ${firstName(name)}`
}
