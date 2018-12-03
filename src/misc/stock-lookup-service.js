export let symbolLookup = _symbol => { throw new Error("not awake right now") }

export const symbolLookupStub = stub => symbolLookup = stub