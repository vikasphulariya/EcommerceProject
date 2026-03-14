
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDY1cNvITE17ExUrDPFpeLhmXHaMrJSVPI",
  authDomain: "ecommerceapp-react-94c4a.firebaseapp.com",
  projectId: "ecommerceapp-react-94c4a",
  storageBucket: "ecommerceapp-react-94c4a.firebasestorage.app",
  messagingSenderId: "900423357756",
  appId: "1:900423357756:web:fc44dd775b7b6baf3dba39",
  measurementId: "G-M0WJNDSJFP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CATEGORIES = ["Books", "Lab Tools", "Stationery", "Electronics", "Bicycles", "Hostel Needs", "Other"];
const CONDITIONS = ["New", "Like New", "Used - Good", "Used - Fair"];

const productSamples = {
  "Books": ["Algorithms Refined", "History of Art", "Medical Glossary", "Physics Volume 1", "Classic Novels Set"],
  "Lab Tools": ["Digital Multimeter", "Oscilloscope", "Chemistry Kit", "Balance Scale", "Test Tube Set"],
  "Stationery": ["Notebook Bundle", "Calligraphy Set", "Drawing Board", "Calculators", "Sketchbook"],
  "Electronics": ["Wireless Mouse", "Power Bank", "SSD Drive", "Smart Watch", "Keyboard"],
  "Bicycles": ["Mountain Bike", "Road Cycle", "City Commuter", "Folding Bike", "Cycle Helmet"],
  "Hostel Needs": ["Coffee Maker", "Wardrobe", "Desk Lamp", "Mini Fridge", "Cooktop"],
  "Other": ["Acoustic Guitar", "Kettlebells", "Darts Set", "Sleeping Bag", "Backpack"]
};

// Vibrant colors for placeholders
const BRIGHT_COLORS = [
  "2563eb", "4f46e5", "7c3aed", "db2777", "dc2626", "ea580c", "ca8a04", "16a34a", "0891b2"
];

const SELLER_ID = "Zt6DYDBEedcuMCET4GSUnVzKLd32";
const SELLER_NAME = "Demo Seller";
const SELLER_EMAIL = "demo@unimart.edu";
const SELLER_COLLEGE = "UniMart Institute of Technology";

async function clearAndSeed() {
  const querySnapshot = await getDocs(collection(db, "products"));
  let deletedCount = 0;
  for (const item of querySnapshot.docs) {
    if (item.data().sellerId === SELLER_ID) {
      await deleteDoc(doc(db, "products", item.id));
      deletedCount++;
    }
  }

  let count = 0;

  for (const category of CATEGORIES) {
    for (const condition of CONDITIONS) {
      const randomIndex = Math.floor(Math.random() * productSamples[category].length);
      const productName = productSamples[category][randomIndex];
      const price = Math.floor(Math.random() * 5000) + 100;

      // Select random vibrant color
      const bgHex = BRIGHT_COLORS[Math.floor(Math.random() * BRIGHT_COLORS.length)];

      // Font size increased to 60 for better visibility
      // The text is also bolded in the URL params
      const imageUrl = `https://placehold.jp/60/${bgHex}/ffffff/600x800.png?text=${encodeURIComponent(productName)}&css=%7B%22font-weight%22%3A%22900%22%7D`;

      const listingData = {
        name: productName,
        description: `This is a high quality ${productName} in ${condition} condition.`,
        price: price,
        discountPrice: price,
        condition: condition,
        category: category,
        imgUrl: imageUrl,
        sellerId: SELLER_ID,
        sellerName: SELLER_NAME,
        sellerEmail: SELLER_EMAIL,
        sellerCollege: SELLER_COLLEGE,
        createdAt: new Date().toISOString(),
        status: "active",
        type: "Marketplace"
      };

      try {
        await addDoc(collection(db, "products"), listingData);
        count++;
        console.log(`[${count}] Added: ${productName} in ${category}`);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  }

  console.log(`Successfully seeded ${count} products with vibrant text placeholders!`);
}

clearAndSeed();
