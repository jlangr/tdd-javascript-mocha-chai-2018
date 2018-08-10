let nextId = 1001;

class IdGenerator {
  id() {
    return nextId++;
  }
}

export default new IdGenerator();