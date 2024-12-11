# Data Description

This document outlines the key data types our e-commerce web application will handle. The application connects aquarium enthusiasts in the USA, allowing them to buy and sell fish, aquariums, and related accessories. Below is a detailed description of each data type, including their attributes, relationships, and data sources.

## Data Types

### 1. User Profiles

**Description**: Information about users registered on the platform, including both buyers and sellers.

**Attributes**:

- **User ID**: Unique identifier for each user (system-generated).
- **Username**: Chosen by the user.
- **Password**: Encrypted password.
- **Email**: User's email address.
- **Full Name**: User's real name.
- **Address**: Shipping address (USA only), including street, city, state, and ZIP code.
- **Phone Number**: Contact number.
- **Profile Picture**: Optional image uploaded by the user.
- **User Type**: Buyer, Seller, or Both.
- **Registration Date**: Date and time the account was created.

**Relationships**:

- **Sellers** have multiple **Listings**.
- **Buyers** make **Purchases** and leave **Reviews/Ratings**.
- Users can have multiple **Addresses** saved.

**Data Sources**:

- Provided by users during registration and profile updates.

---

### 2. Products

**Description**: Detailed information about various products available on the platform.

**Attributes**:

- **Species ID**: Unique identifier.
- **Common Name**: Commonly used name of the species.
- **Scientific Name**: Latin name of the species.
- **Category**: Classification (e.g., Freshwater, Saltwater).
- **Description**: Detailed information about the species.
- **Price**: How much the product costs.
- **Quantity**: How much of this product is in stock.
- **Images**: Pictures of the species.
- **Reviews**: Informative reviews from users on products.
- **Product Types**: Option for specific type of product, i.e Standard, Premium.

**Relationships**:

- Linked to **Listings** as the product being sold.
- Associated with **Categories** for easy navigation.

---

### 3. Listings

**Description**: Items posted by sellers for buyers to purchase.

**Attributes**:

- **Listing ID**: Unique identifier.
- **Seller ID**: Reference to the user selling the item.
- **Product Type**: Fish, Aquarium, Accessory.
- **Product Details**: Links to **Fish Species** or **Aquariums**.
- **Title**: Brief title of the listing.
- **Description**: Detailed description.
- **Price**: Asking price.
- **Quantity**: Number of items available.
- **Images**: Uploaded by the seller.
- **Category ID**: Reference to the relevant category.
- **Condition**: New or Used.
- **Date Posted**: Timestamp.
- **Status**: Active, Pending, Sold.

**Relationships**:

- Created by a **Seller** (User).
- Associated with **Messages/Chats** initiated by buyers.
- Linked to **Transactions/Orders** upon purchase.
- Categorized under **Categories**.

**Data Sources**:

- Input by sellers during listing creation.

---

### 4. Transactions/Orders

**Description**: Records of purchases made on the platform.

**Attributes**:

- **Transaction ID**: Unique identifier.
- **Buyer ID**: User ID of the buyer.
- **Listing ID**: Item purchased.
- **Quantity**: Number of items bought.
- **Total Price**: Final price paid.
- **Transaction Date**: Timestamp.

**Relationships**:

- Links a **Buyer** and a **Seller**.
- Associated with a **Listing**.
- May trigger a **Review/Rating** post-delivery.

**Data Sources**:

- Generated during the purchase process.

---

### 5. Reviews/Ratings

**Description**: Feedback from buyers about sellers and products.

**Attributes**:

- **Review ID**: Unique identifier.
- **Reviewer ID**: User ID of the buyer.
- **Seller ID**: User ID of the seller.
- **Listing ID**: Reference to the item reviewed.
- **Rating**: Numerical score (e.g., 1-5 stars).
- **Comment**: Written feedback.
- **Review Date**: Timestamp.

**Relationships**:

- Tied to **Users** (Buyer and Seller).
- Linked to a **Transaction/Order**.
- Displayed on seller profiles and listings.

**Data Sources**:

- Provided by buyers after completing a transaction.

---

### 6. Images

**Description**: Visual content used throughout the platform, product listings, and profile pages.

**Attributes**:

- **Image ID**: Unique identifier.
- **URL**: Location of the image file.
- **Uploader ID**: User who uploaded the image.
- **Associated ID**: Reference to **Listing ID**, **User ID**, etc.
- **Upload Date**: Timestamp.
- **Alt Text**: Description for accessibility.

**Relationships**:

- Linked to **Listings**, **User Profiles**, **Fish Species**, etc.
- May be sourced from free image libraries.

**Data Sources**:

- Uploaded by users.

---

### 7. Search and Filter Queries

**Description**: Data related to users' search activities and preferences.

**Attributes**:

- **Search ID**: Unique identifier.
- **User ID**: Reference to the user who performed the search (optional for anonymous searches).
- **Search Terms**: Keywords entered by the user.
- **Filters Applied**: Criteria such as category, price range, species, etc.
- **Timestamp**: Date and time of the search.
- **Results Returned**: Number of listings matching the search criteria.

**Relationships**:

- Linked to **Users** if the search is user-specific.
- Influences the display of **Listings** based on **Filters Applied**.

**Data Sources**:

- Generated from user interactions with the search and filter functionalities.

---

## Relationships Between Data

- **Sellers** create **Listings** to sell **Fish Species**, **Aquariums**, or accessories.
- **Transactions/Orders** are generated when a buyer purchases a listing.
- **Reviews/Ratings** allow buyers to provide feedback on sellers and items.
- **Products** are organized under **Categories** for easy browsing.
- **Images** enhance **Listings**, **User Profiles**, and **Product Details**.
- **Search Queries** and **Filter Options** enhance user experience by allowing users to efficiently find products that match their preferences.

## Data Sources

- **User-Generated Content**: Most data is provided directly by users (registration, listings, messages, searches).
- **Third-Party Resources**: Fish species information and images from free libraries (ensuring copyright compliance).
- **System-Generated Data**: IDs, timestamps, and metadata are generated by the application.
- **Administrative Input**: Categories, filter options, and platform policies set by administrators.

---

This comprehensive data structure ensures our platform effectively connects aquarium enthusiasts, providing a secure, user-friendly, and efficient experience tailored to the needs of the USA market.
