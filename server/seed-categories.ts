// Script to seed categories to ensure they exist
import { db } from "./db";
import { categories } from "../shared/schema";

async function seedCategories() {
  console.log("Checking and seeding categories...");
  
  // Check if categories already exist
  const existingCategories = await db.select().from(categories);
  
  if (existingCategories.length === 0) {
    console.log("No categories found. Creating default categories...");
    
    // Create categories
    const categoriesData = [
      {
        name: "Web Development",
        description: "Frontend, backend, and full-stack web development",
        icon: "💻"
      },
      {
        name: "Mobile Development", 
        description: "iOS, Android, and cross-platform mobile apps",
        icon: "📱"
      },
      {
        name: "Design & Creative",
        description: "UI/UX, graphic design, branding, and creative work",
        icon: "🎨"
      },
      {
        name: "Digital Marketing",
        description: "SEO, social media, content marketing, and advertising",
        icon: "📈"
      },
      {
        name: "Writing & Content",
        description: "Copywriting, technical writing, and content creation",
        icon: "✍️"
      },
      {
        name: "Data & Analytics",
        description: "Data science, analytics, and business intelligence",
        icon: "📊"
      }
    ];
  
    const insertedCategories = await db.insert(categories).values(categoriesData).returning();
    console.log("Categories created:", insertedCategories.length);
    return insertedCategories;
  } else {
    console.log("Categories already exist:", existingCategories.length);
    return existingCategories;
  }
}

seedCategories()
  .then(() => {
    console.log("Categories seeding completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding categories:", error);
    process.exit(1);
  });