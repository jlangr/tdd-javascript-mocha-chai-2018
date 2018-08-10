let nextId = 1001;

class IdGenerator {
  reset(id) {
    nextId = id;
  }
  id() {
    return nextId++;
  }
}

export default new IdGenerator();