export let symbolLookup = _symbol => { throw Error() }

export const setSymbolLookupStubForTesting =
    stub => symbolLookup = stub