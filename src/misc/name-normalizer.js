//const countOfChar = (s, c) => (s.match(new RegExp(c, 'g'))||[]).length;

const lastName = name => partsOfName(name).slice(-1)[0]
const firstName = name => partsOfName(name)[0]
const initial = name => `${name[0]}${name.length === 1 ? '' : '.'}`

const hasMiddleNames = name => partsOfName(name).length < 3
const middleNames = array => array.slice(1, -1)

const optionalMiddleInitials = name => {
  if (hasMiddleNames(name)) return ''

  return ' ' + middleNames(partsOfName(name))
    .map(initial)
    .join(' ')
}

const isMononym = name => partsOfName(name).length === 1

const partsOfName = name => name.split(' ')

const suffixless = name => {
  const [baseName, _] = name.split(',')
  return baseName
}

const optionalSuffix = name => {
  const [_, suffix] = name.split(',')
  return suffix ? `,${suffix}` : ''
}

export const normalize = fullName => {
  const name = suffixless(fullName.trim())
  if (isMononym(name)) return name
  return `${lastName(name)}, ` +
         `${firstName(name)}` +
         `${optionalMiddleInitials(name)}` +
         `${optionalSuffix(fullName)}`
}
