//const countOfChar = (s, c) => (s.match(new RegExp(c, 'g'))||[]).length;

const lastName = name => partsOfName(name)[partsOfName(name).length - 1]

const firstName = name => partsOfName(name)[0]

const initial = name => {
  if (name.length === 1) return ` ${name}`
  return ` ${name[0]}.`
}

const hasMiddleNames = name => partsOfName(name).length < 3

const middleNames = array => array.slice(1, -1)

const optionalMiddleInitials = name => {
  if (hasMiddleNames(name)) return ''

  return middleNames(partsOfName(name))
    .map(initial)
    .join('')
}

const isMononym = name => partsOfName(name).length === 1

const partsOfName = name => name.split(' ')

export const normalize = name => {
  name = name.trim()
  if (isMononym(name)) return name
  return `${lastName(name)}, ${firstName(name)}${optionalMiddleInitials(name)}`
}
