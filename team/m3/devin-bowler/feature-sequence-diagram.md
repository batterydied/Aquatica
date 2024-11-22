sequenceDiagram
    participant User
    participant UI as User Interface
    participant JS as JavaScript Logic
    participant DB as IndexedDB

    User->>UI: Opens the Cart Page
    UI->>JS: Request to Load Cart Data
    JS->>DB: Fetch cart items from IndexedDB
    DB-->>JS: Return cart items
    JS->>UI: Render cart items in the UI

    User->>UI: Clicks "Add to Cart" on a product
    UI->>JS: Trigger "addToCart" event
    JS->>DB: Check if item exists in IndexedDB
    alt Item exists
        DB->>JS: Increment item quantity
    else Item doesn't exist
        DB->>JS: Add new item to IndexedDB
    end
    JS->>UI: Update cart UI with new data

    User->>UI: Adjusts item quantity (increment/decrement)
    UI->>JS: Trigger "updateQuantity" event
    JS->>DB: Update item quantity in IndexedDB
    DB-->>JS: Confirm update
    JS->>UI: Reflect updated quantity and price

    User->>UI: Removes an item from the cart
    UI->>JS: Trigger "removeItem" event
    JS->>DB: Delete item from IndexedDB
    DB-->>JS: Confirm deletion
    JS->>UI: Remove item from UI

    User->>UI: Proceeds to Checkout
    UI->>JS: Trigger navigation to Checkout Page
    JS->>UI: Render Checkout Page
