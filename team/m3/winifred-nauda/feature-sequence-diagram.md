```mermaid 
sequenceDiagram;
    Javascript->>indexedDB: getProdList();
    indexedDB->>Javascript: return list of products;
    Javascript->>User: Display products;
    User->>JavaScript: Search/Filter;
    JavaScript->>User: Display filtered list;
    User->>Javascript: Select sort criteria;
    Javascript->>User: Display sorted list;
    User->>Javascript: Go to next/previous page;
    Javascript->>User: Display next 5 products in list;
```