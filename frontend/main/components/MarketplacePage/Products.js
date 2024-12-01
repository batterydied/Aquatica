
// fake data generated with ChatGPT
import { Category } from "../shared/Category.js";

// export const products = [
//     {
//       prodid: 12345,
//       sellername: "AquaticWorld",
//       sellerid: 7890,
//       imgurl: "https://example.com/images/product12345.jpg",
//       name: "50-Gallon Aquarium Tank",
//       category: Category.Tanks,
//       description: "A spacious 50-gallon glass aquarium tank with a sleek design for all your aquatic needs.",
//       average_rating: 4.8,
//       numreviews: 600,
//       price: 199.99
//     },
//     {
//       prodid: 12346,
//       sellername: "RockyReef",
//       sellerid: 7891,
//       imgurl: "https://example.com/images/product12346.jpg",
//       name: "Volcanic Lava Rock Set",
//       category: Category.Rocks,
//       description: "Authentic volcanic lava rocks for aquarium decoration or terrarium use.",
//       average_rating: 4.5,
//       numreviews: 450,
//       price: 29.99
//     },
//     {
//       prodid: 12347,
//       sellername: "FishyBusiness",
//       sellerid: 7892,
//       imgurl: "https://example.com/images/product12347.jpg",
//       name: "Goldfish (Single)",
//       category: Category.Fish,
//       description: "Bright, healthy goldfish perfect for beginners and experienced aquarium owners.",
//       average_rating: 4.6,
//       numreviews: 820,
//       price: 5.99
//     },
//     {
//       prodid: 12348,
//       sellername: "PlantHaven",
//       sellerid: 7893,
//       imgurl: "https://example.com/images/product12348.jpg",
//       name: "Java Fern Aquatic Plant",
//       category: Category.Plants,
//       description: "Hardy Java Fern plant for freshwater aquariums, grows well in low light.",
//       average_rating: 4.7,
//       numreviews: 420,
//       price: 9.99
//     },
//     {
//       prodid: 12349,
//       sellername: "AquaticWorld",
//       sellerid: 7894,
//       imgurl: "https://example.com/images/product12349.jpg",
//       name: "Aquarium Filter Pump",
//       category: Category.Misc,
//       description: "Efficient filter pump for clean water in your aquarium, easy to install and maintain.",
//       average_rating: 4.4,
//       numreviews: 390,
//       price: 29.99
//     },
//     {
//       prodid: 12350,
//       sellername: "FreshWaterFins",
//       sellerid: 7895,
//       imgurl: "https://example.com/images/product12350.jpg",
//       name: "Neon Tetra Fish (Pack of 6)",
//       category: Category.Fish,
//       description: "A colorful pack of Neon Tetras for your freshwater tank, adding a stunning blue glow.",
//       average_rating: 4.9,
//       numreviews: 1000,
//       price: 19.99
//     },
//     {
//       prodid: 12351,
//       sellername: "Rocks4Aquariums",
//       sellerid: 7896,
//       imgurl: "https://example.com/images/product12351.jpg",
//       name: "Coral Sand Gravel Mix",
//       category: Category.Rocks,
//       description: "A mix of fine sand and gravel ideal for aquariums, perfect for marine and freshwater tanks.",
//       average_rating: 4.3,
//       numreviews: 320,
//       price: 14.99
//     },
//     {
//       prodid: 12352,
//       sellername: "TanksAndMore",
//       sellerid: 7897,
//       imgurl: "https://example.com/images/product12352.jpg",
//       name: "10-Gallon Tank Starter Kit",
//       category: Category.Tanks,
//       description: "Complete 10-gallon tank kit with filter, heater, LED lighting, and more.",
//       average_rating: 4.6,
//       numreviews: 540,
//       price: 89.99
//     },
//     {
//       prodid: 12353,
//       sellername: "PlantLovers",
//       sellerid: 7898,
//       imgurl: "https://example.com/images/product12353.jpg",
//       name: "Anubias Barteri Aquatic Plant",
//       category: Category.Plants,
//       description: "Low-maintenance aquatic plant, great for adding greenery to any aquarium.",
//       average_rating: 4.8,
//       numreviews: 530,
//       price: 12.99
//     },
//     {
//       prodid: 12354,
//       sellername: "FreshwaterAquatics",
//       sellerid: 7899,
//       imgurl: "https://example.com/images/product12354.jpg",
//       name: "Aqua Decal Wall Art",
//       category: Category.Misc,
//       description: "Aquatic-themed wall decals perfect for decorating your fish tank room.",
//       average_rating: 4.2,
//       numreviews: 150,
//       price: 19.99
//     },
//     {
//       prodid: 12355,
//       sellername: "AquariumEssentials",
//       sellerid: 7900,
//       imgurl: "https://example.com/images/product12355.jpg",
//       name: "Betta Fish Habitat Tank",
//       category: Category.Tanks,
//       description: "Stylish and compact habitat tank for Betta fish, includes filtration and LED lighting.",
//       average_rating: 4.6,
//       numreviews: 310,
//       price: 59.99
//     },
//     {
//       prodid: 12356,
//       sellername: "FishyTreasures",
//       sellerid: 7901,
//       imgurl: "https://example.com/images/product12356.jpg",
//       name: "Koi Fish (Pack of 3)",
//       category: Category.Fish,
//       description: "Elegant Koi fish for outdoor ponds or large aquariums, with vibrant colors.",
//       average_rating: 4.7,
//       numreviews: 250,
//       price: 45.99
//     },
//     {
//       prodid: 12357,
//       sellername: "TropicalAquatic",
//       sellerid: 7902,
//       imgurl: "https://example.com/images/product12357.jpg",
//       name: "Amazon Sword Plant",
//       category: Category.Plants,
//       description: "Fast-growing aquatic plant perfect for freshwater aquariums, with long, sword-like leaves.",
//       average_rating: 4.4,
//       numreviews: 270,
//       price: 8.99
//     },
//     {
//       prodid: 12358,
//       sellername: "RockyReef",
//       sellerid: 7903,
//       imgurl: "https://example.com/images/product12358.jpg",
//       name: "Aquarium Slate Rocks",
//       category: Category.Rocks,
//       description: "Natural slate rocks, ideal for adding texture and hiding spots in aquariums.",
//       average_rating: 4.7,
//       numreviews: 350,
//       price: 19.99
//     },
//     {
//       prodid: 12359,
//       sellername: "EcoAquarium",
//       sellerid: 7904,
//       imgurl: "https://example.com/images/product12359.jpg",
//       name: "Floating Aquarium Plants (Pack of 5)",
//       category: Category.Plants,
//       description: "A pack of 5 floating plants for your tank, perfect for providing natural shade and filtration.",
//       average_rating: 4.5,
//       numreviews: 400,
//       price: 15.99
//     },
//     {
//       prodid: 12360,
//       sellername: "FishyBusiness",
//       sellerid: 7905,
//       imgurl: "https://example.com/images/product12360.jpg",
//       name: "Clownfish (Single)",
//       category: Category.Fish,
//       description: "A popular and colorful Clownfish, perfect for reef tanks.",
//       average_rating: 4.8,
//       numreviews: 500,
//       price: 12.99
//     },
//     {
//       prodid: 12361,
//       sellername: "TankMasters",
//       sellerid: 7906,
//       imgurl: "https://example.com/images/product12361.jpg",
//       name: "20-Gallon Freshwater Tank Kit",
//       category: Category.Tanks,
//       description: "Complete tank kit for freshwater setups, including LED lighting and filtration system.",
//       average_rating: 4.7,
//       numreviews: 430,
//       price: 119.99
//     },
//     {
//       prodid: 12362,
//       sellername: "AquaticSolutions",
//       sellerid: 7907,
//       imgurl: "https://example.com/images/product12362.jpg",
//       name: "Marine Salt Mix (5kg)",
//       category: Category.Misc,
//       description: "Premium marine salt mix for creating the perfect saltwater environment.",
//       average_rating: 4.4,
//       numreviews: 220,
//       price: 24.99
//     },
//     {
//       prodid: 12363,
//       sellername: "AquariumSupplies",
//       sellerid: 7908,
//       imgurl: "https://example.com/images/product12363.jpg",
//       name: "Aquarium Filter Media (3-pack)",
//       category: Category.Misc,
//       description: "A set of 3 high-quality filter media replacements for optimal water filtration.",
//       average_rating: 4.6,
//       numreviews: 310,
//       price: 14.99
//     },
//     {
//       prodid: 12364,
//       sellername: "FishyWorld",
//       sellerid: 7909,
//       imgurl: "https://example.com/images/product12364.jpg",
//       name: "Swordtail Fish (Pack of 2)",
//       category: Category.Fish,
//       description: "Bright and active Swordtail fish, perfect for community aquariums.",
//       average_rating: 4.5,
//       numreviews: 250,
//       price: 11.99
//     },
//     {
//       prodid: 12365,
//       sellername: "AquaticHaven",
//       sellerid: 7910,
//       imgurl: "https://example.com/images/product12365.jpg",
//       name: "Aquarium Driftwood",
//       category: Category.Rocks,
//       description: "Natural driftwood for aquariums, perfect for providing hiding places and aesthetic appeal.",
//       average_rating: 4.8,
//       numreviews: 520,
//       price: 34.99
//     },
//     {
//       prodid: 12366,
//       sellername: "RockyReef",
//       sellerid: 7911,
//       imgurl: "https://example.com/images/product12366.jpg",
//       name: "Pumice Stone for Aquariums",
//       category: Category.Rocks,
//       description: "Natural pumice stones for aquariums, excellent for biological filtration and decoration.",
//       average_rating: 4.7,
//       numreviews: 300,
//       price: 18.99
//     },
//     {
//       prodid: 12367,
//       sellername: "PlantLovers",
//       sellerid: 7912,
//       imgurl: "https://example.com/images/product12367.jpg",
//       name: "Cryptocoryne Wendtii Plant",
//       category: Category.Plants,
//       description: "Easy-to-grow aquatic plant that thrives in low light and adds lush greenery to any tank.",
//       average_rating: 4.7,
//       numreviews: 470,
//       price: 11.99
//     }
// ];


export const products = [
  {
   // Clownfish
    prodid: "1a2b3c4d5e",
    sellername: "Ocean Wonders",
    sellerid: "1234-5678",
    imgurl: "https://scitechdaily.com/images/Clownfish-Art-Concept-Illustration.jpg",
    name: "Clownfish",
    category: Category.SaltwaterFish,
    description: "Bright and vibrant saltwater fish.",
    average_rating: 4.7,
    numreviews: 300,
    price: 25.99,
  },
  {
    // Betta Fish
    prodid: "abab6f2f-bc59-42b8-b433-13766b18953b",
    sellername: "Aquarium Paradise",
    sellerid: "9876-5432",
    imgurl: "https://houstonaqua.com/cdn/shop/files/DSC07717.jpg?v=1698881066",
    name: "Betta Fish",
    category: Category.FreshwaterFish,
    description: "Colorful and hardy freshwater fish, ideal for smaller aquariums.",
    average_rating: 4.2,
    numreviews: 1000,
    price: 15.99,
  }
];

