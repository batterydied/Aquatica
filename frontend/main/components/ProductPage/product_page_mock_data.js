import {imgUrls} from './imgUrl.js'
export const productData = 
{
    "product": {
      "id": "12345",
      "name": "Clownfish",
      "scientificName": "Amphiprioninae",
      "images": [
        imgUrls[0],
        imgUrls[0],
        imgUrls[1]
      ],
      "description": "Bright and vibrant, the Clownfish is a popular saltwater fish known for its symbiotic relationship with sea anemones. Perfect for marine aquariums.",
      "price": null,
      "discountPrice": null,
      "availability": "In Stock",
      "category": "Saltwater Fish",
      "tags": ["saltwater", "beginner friendly", "colorful", "marine"],
      "rating": 4.8,
      "reviewsCount": 45,
      "specifications": {
        "size": "3-4 inches",
        "tankSize": "20 gallons or more",
        "temperature": "75-82°F",
        "diet": "Omnivore",
        "pH": "8.1-8.4",
        "careLevel": "Easy"
      },
      "productTypes": [
        {
          "type": "0.5 inch",
          "price": 5.99
        },
        {
          "type": "2 inch",
          "price": 15.99
        },
        {
          "type": "4 inch",
          "price": 25.99
        }
      ],
      "selectedProductType": {
        "type": "4 inch",
        "price": 25.99
      },
      "shippingInfo": {
        "shippingCost": "Free",
        "deliveryTime": "2-5 business days",
        "packaging": "Live arrival guarantee with insulated, secure packaging"
      },
      "seller": {
        "id": "67890",
        "name": "Ocean Wonders",
        "rating": 4.9,
        "contact": "support@oceanwonders.com",
        "location": "Miami, FL"
      },
      "reviews": [
        {
          "user": "JohnD123",
          "rating": 5,
          "comment": "The fish arrived healthy and vibrant! Looks amazing in my tank.",
          "date": "2024-11-10"
        },
        {
          "user": "AquaFanatic",
          "rating": 4,
          "comment": "Great quality, but the delivery took one day longer than expected.",
          "date": "2024-11-12"
        }
      ],
      "relatedProducts": [
        {
          "id": "12346",
          "name": "Sea Anemone (Heteractis magnifica)",
          "price": 39.99,
          "image": imgUrls[0]
        },
        {
          "id": "12347",
          "name": "Marine Flake Food",
          "price": 9.99,
          "image": imgUrls[0]
        },
        {
          "id": "12348",
          "name": "20-Gallon Starter Marine Tank",
          "price": 129.99,
          "image": imgUrls[1]
        }
      ]
    }
}
  