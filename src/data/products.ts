export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
}

const categories = ["Electronics", "Fashion", "Home", "Sports", "Books", "Beauty"];
const productNames: { [key: string]: string[] } = {
  Electronics: [
    "Premium Wireless Headphones",
    "Smartwatch Pro",
    "4K Webcam",
    "Mechanical Keyboard",
    "USB-C Hub",
    "Portable SSD",
    "Bluetooth Speaker",
    "Wireless Mouse",
    "Monitor Stand",
    "HDMI Cable Set",
    "USB Flash Drive",
    "Phone Charger",
    "Laptop Stand",
    "Cooling Pad",
    "External Hard Drive",
  ],
  Fashion: [
    "Comfortable Cotton T-Shirt",
    "Classic Denim Jeans",
    "Leather Jacket",
    "Running Shoes",
    "Casual Sneakers",
    "Formal Dress Shirt",
    "Winter Sweater",
    "Summer Shorts",
    "Casual Blazer",
    "Wool Coat",
    "Chinos Pants",
    "Polo Shirt",
    "Cargo Pants",
    "Hoodie Sweatshirt",
    "Sport Jacket",
  ],
  Home: [
    "Stainless Steel Coffee Maker",
    "Desk Lamp LED",
    "Bamboo Cutting Board Set",
    "Wall Clock Modern",
    "Throw Pillow Set",
    "Door Mat",
    "Plant Pot",
    "Bed Sheet Set",
    "Curtain Rod",
    "Picture Frame",
    "Storage Basket",
    "Decorative Mirror",
    "Table Lamp",
    "Bath Mat",
    "Kitchen Organizer",
  ],
  Sports: [
    "Yoga Mat Premium",
    "Dumbbells Set",
    "Jump Rope",
    "Resistance Bands",
    "Exercise Ball",
    "Foam Roller",
    "Yoga Blocks",
    "Sports Water Bottle",
    "Gym Bag",
    "Weight Scale",
    "Push Up Bars",
    "Kettlebell",
    "Yoga Strap",
    "Training Gloves",
    "Running Belt",
  ],
  Books: [
    "The Great Gatsby",
    "1984",
    "To Kill a Mockingbird",
    "Pride and Prejudice",
    "The Catcher in the Rye",
    "Harry Potter",
    "Lord of the Rings",
    "Sherlock Holmes",
    "The Hobbit",
    "Jane Eyre",
    "Wuthering Heights",
    "Crime and Punishment",
    "Moby Dick",
    "Frankenstein",
    "Dracula",
  ],
  Beauty: [
    "Moisturizing Face Cream",
    "Sunscreen SPF 50",
    "Face Cleanser",
    "Lip Balm",
    "Eye Serum",
    "Hair Shampoo",
    "Hair Conditioner",
    "Body Lotion",
    "Face Mask",
    "Makeup Foundation",
    "Lipstick Set",
    "Mascara",
    "Eye Shadow Palette",
    "Blush",
    "Setting Spray",
  ],
};

export const productsData: Product[] = [];

// Generate 100 products
let productId = 1;
for (let i = 0; i < 100; i++) {
  const category = categories[i % categories.length];
  const nameList = productNames[category];
  const name = nameList[i % nameList.length];
  const priceMultiplier = Math.floor(i / categories.length) + 1;
  const basePrice = 29.99 + priceMultiplier * 10;
  const discount = Math.floor(Math.random() * 40) + 10;
  const originalPrice = basePrice + discount;
  
  productsData.push({
    id: productId++,
    name: `${name} ${i % nameList.length !== 0 ? 'v' + (Math.floor(i / nameList.length) + 1) : ''}`.trim(),
    category,
    image: `https://images.unsplash.com/photo-${['1505740420928-5e560c06d30e', '1523275335684-37898b6baf30', '1598327105666-5b89351aff97', '1587829191301-11db59a44f6b', '1542272604-787c62d465d1', '1521572163474-6864f9cf17ab', '1511379938547-c1f69b13d835', '1572635196237-14b3f281503f', '1505228395891-9a51e7e86e81', '1526170375885-4d8ecf77b99f'][i % 10]}?auto=format&fit=crop&w=500&q=60`,
    price: Math.round(basePrice * 100) / 100,
    originalPrice: Math.round(originalPrice * 100) / 100,
    rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
    reviews: Math.floor(Math.random() * 300) + 20,
  });
}
