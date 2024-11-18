This feature is reviews and ratings. The reviews and ratings displays a list of every customers reviews and rating of a certain product from the database to the user. The reviews and ratings appear on the product page and allows users to see other customers reviews and also add their own review of the product.
```mermaid 
sequenceDiagram;
    JavaScript->>indexedDB: getProductReviews();
    indexedDB->>JavaScript: return list of customer reviews of a product;
    JavaScript->>User: Display customer reviews and ratings of product to user;
    User->>JavaScript: Add user's review and rating of product
    JavaScript->>indexedDB: Store review of product
    JavaScript->>User: Update UI with user's review
```