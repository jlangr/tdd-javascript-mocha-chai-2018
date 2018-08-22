const items = { 
  '2001': { upc: '2001', description: 'Milk', price: 3.09 },
  '2002': { upc: '2002', description: 'Eggs, dz', price: 3.29 },
  '2003': { upc: '2003', description: 'Rice Krispies 16oz', price: 3.79 },
  '2004': { upc: '2004', description: 'Red bell pepper, ea', price: 0.99 },
};

export default class ItemDatabase {
  retrieve(upc) {
    return items[upc];
  }
}

// export default new ItemDatabase();