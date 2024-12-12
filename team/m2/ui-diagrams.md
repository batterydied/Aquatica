# UI Diagrams

## Home Page Screen
The **Home Page** is the landing screen where users can explore the main features of the web app. It provides easy access to essential sections such as the Gallery of Fish, personalized recommendations, and product categories, all while reflecting an aquatic theme. The layout ensures intuitive navigation for new and returning users, with simple guidance accessible through the User Center.

![image](https://github.com/user-attachments/assets/8cfa68d4-618f-4a55-841b-55161a53ebab)


On this screen, users can interact with five main elements:

1. **Search Bar**: Placed at the top, allowing users to search for specific fish species, products, or lists.
2. **Fish Gallery Slide**: A rotating banner showcasing a community-driven collective fish gallery, designed to grab attention and allow users to showcase their personal aquariums or specific fish they own. This interactive gallery fosters a sense of community among fish enthusiasts, encouraging sharing and collaboration.
3. **Personalized Recommendations**: A section labeled "My Aqua Picks" displays personalized product suggestions based on the user’s browsing or purchase history.
4. **Featured Fish Slider**: A rotating banner below the gallery, showcasing new arrivals, featured species, or current promotions, designed to guide users to specific products.
5. **Category Tiles**: Visual buttons representing different categories like Freshwater Fish, Saltwater Fish, Accessories, and Plants. Clicking these tiles takes users to the respective category pages.

**Use Case**: 

A user who wants to explore aquarium product scroll down to browse the **Fish Gallery Slide**, viewing community aquariums and clicking on a featured tank for inspiration. Afterward, the user can check the **Featured Fish Slider** and **Category Tiles** to view categorized products. After interacting with the page, their preferences help refine future personalized recommendations.

---

## Search Screen
The **Search Screen** provides users with the ability to easily browse through categories and discover specific items. It is designed for users who prefer navigating through a more visual interface rather than entering text in the search bar.

![image](https://github.com/user-attachments/assets/4159be23-9c5e-406e-9c46-176ded8bc78f)

On this screen, users can interact with three main elements:

1. **Search Button**: Large search bar that enable user to search for specific fish with several filters.
2. **Category Tiles**: Large visual tiles that represent different categories, such as Freshwater Fish, Saltwater Fish, Accessories, and Plants. These tiles are clickable and direct the user to the relevant category page where they can explore specific items.
3. **Personalized Recommendations**: Based on the user's search history or preferences, personalized recommendations are displayed below the category tiles. This feature encourages users to discover products or species they may be interested in, enhancing the user experience.

**Use Case**: 

A user wants to looks for beginner-friendly fish that's easy disease-free certified. The user clicks on the filter bubbles and browse the results, sorted from the highest rated to the lowest. If they see a interested fish, they can add them to cart and communicate with the seller. After interacting with the page, their preferences help refine future personalized recommendations. 

---

## User Center
The **User Center** is a personal space for users to manage their profiles, interactions, orders, and more. It is designed to be a one-stop place for accessing all user-related functionalities.

![image](https://github.com/user-attachments/assets/1b5f77c8-2178-44a6-a39b-1db23b9a9b4e)

On this screen, users can interact with five main elements:

1. **User Profile**: Allows users to manage their account information, including their username, email, and password. This section may also include preferences for notifications and saved addresses.
2. **Private Chat**: Users can engage in private chats with sellers or customer support to discuss products, order issues, or general inquiries. This feature enhances communication within the app.
3. **Transactions/Orders**: Displays a history of the user’s past orders and ongoing transactions. Users can track the status of current orders, view order details, and initiate returns or customer support requests.
4. **Secure Payment**: Users can securely manage payment methods, including adding or removing credit cards or linking to third-party payment solutions like PayPal.
5. **Fish Gallery**: Users can upload and manage pictures of their own aquariums or fish, contributing to the community-driven Fish Gallery. This section promotes engagement and sharing among fish enthusiasts.

**Use Case**: 

A user wants to communicate with two seller and comparing the price for a same breed, they can use the private chat channel and ask the seller for more detailed information, disease-free certificate, bargain, and make the final decision.

---

## Product Page Screen

The **Product Page** provides users with detailed information about a specific product, including its description, images, and interactive UI elements. It allows users to view, customize, and purchase products easily while offering a visually appealing and intuitive design.

![Product Page Layout](https://github.com/user-attachments/assets/8cfa68d4-618f-4a55-841b-55161a53ebab)

On this screen, users can interact with several main elements:

1. **Image Gallery**: 
   - A vertical panel on the left displays product thumbnails.
   - Hovering over a thumbnail dynamically updates the main product image.
   - The main image occupies the center, allowing users to view the product in high detail.

2. **Product Titles and Description**:
   - The top-right panel displays the product name, scientific name, and a brief description.
   - The description highlights the product's unique features and specifications.

3. **Pricing and Product Types**:
   - Includes a dropdown for selecting product types, dynamically updating the displayed price.
   - Ensures users can easily understand product variations and their associated costs.

4. **Quantity Selector**:
   - Features "+" and "-" buttons to increment or decrement the product quantity.
   - A numeric input allows users to manually set the quantity, with validation to prevent values below `1`.

5. **Action Buttons**:
   - **Add to Cart Button**: Adds the selected product to the user's shopping cart.
   - Planned buttons:
     - **Save for Later**: Allows users to save the product for future reference.
     - **Buy Now**: Enables quick purchase functionality.

6. **Product Information Panel**:
   - Includes key product details such as:
     - Shipping information (e.g., cost and delivery time).
     - Specifications (e.g., size, tank requirements, and care level).
   - Provides a clear and accessible layout for users to review essential information at a glance.

**Use Case**:
A user browsing the store selects a product to view detailed information. They hover over the thumbnails to inspect various product images, select a different product type from the dropdown, adjust the quantity to `2`, and add the product to their cart. The clear layout and responsive design ensure seamless interaction across devices.

---


---

## Cart Page Screen

The **Cart Page** allows users to review the items they intend to purchase. It provides a clear overview of selected products, options to save items for later, and displays the total cost, ensuring users have all necessary information before proceeding to checkout.

![Cart Page Layout](![image](https://github.com/user-attachments/assets/367e6bec-ed94-45be-be3e-ef021e54b610)

On this screen, users can interact with four main elements:

1. **Cart Items List**:
   - Displays all items currently added to the cart with thumbnail images, product names, selected options (e.g., size, color), quantity selectors, and individual prices.
   - Users can update the quantity or remove items directly from the list.

2. **Save for Later Section**:
   - Allows users to move items they are interested in but not ready to purchase into a separate "Save for Later" area.
   - Items in this section can be easily moved back to the cart when the user decides to proceed with the purchase.

3. **Order Summary**:
   - Shows the total amount.
   - Provides transparency on pricing, helping users understand the cost before checkout.

4. **Action Buttons**:
   - **Continue Shopping**: Redirects users back to the product browsing sections.
   - **Proceed to Checkout**: Takes users to the Checkout Page to complete their purchase.

**Use Case**:

A user adds several fish and accessories to their cart while browsing the store. Before checking out, they review the Cart Page to ensure all desired items are included, adjust quantities if necessary, and move an accessory to the "Save for Later" section. Satisfied with their selections and aware of the total cost, they click "Proceed to Checkout" to finalize their purchase.

---

## Checkout Page Screen

The **Checkout Page** is the final step in the purchasing process, where users provide necessary information to complete their order. It is divided into two main tabs: **Shipping** and **Payment**, ensuring a streamlined and organized checkout experience.

![Checkout Page Layout](![image](https://github.com/user-attachments/assets/f27a3c96-be4a-4ec9-99d3-2280d60fc4a3)

On this screen, users can interact with several main elements:

1. **Tabs Navigation**:
   - **Shipping Tab**:
     - **Shipping Information Form**: Users enter or select their shipping address, choose a shipping method, and view estimated delivery times.
     - **Order Summary Breakdown**: Displays subtotal, tax, shipping costs, and the total amount, providing a clear financial overview.
   - **Payment Tab**:
     - **Payment Method Selection**: Users can enter their card details.
     - **Payment Details Form**: Secure fields for entering payment information, including card number, expiration date, CVV, and billing address if different from the shipping address.
     - **Review and Confirm**: Final summary of the order with all charges and the selected shipping and payment methods before confirming the purchase.

2. **Action Buttons**:
   - **Back to Cart**: Allows users to return to the Cart Page if they need to make further adjustments.
   - **Place Order**: Finalizes the purchase and processes the payment upon confirmation.

**Use Case**:

After reviewing their cart, a user proceeds to the Checkout Page. They enter their shipping address, select a preferred shipping method, and review the cost breakdown. Moving to the Payment tab, they choose to pay with a credit card, enter their payment details, and confirm the order. The clear separation of shipping and payment information, along with the detailed cost breakdown, ensures a smooth and confident checkout experience.

---
