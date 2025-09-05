import { db } from "./db";
import { categories, services, users } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");
  
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

  // Create sample freelancers
  const freelancersData = [
    {
      id: "freelancer-1",
      email: "sarah.wilson@example.com",
      firstName: "Sarah",
      lastName: "Wilson", 
      bio: "Full-stack developer with 5+ years of experience building scalable web applications using React, Node.js, and cloud technologies.",
      skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
      hourlyRate: "85.00",
      isFreelancer: true,
      rating: "4.9",
      totalReviews: 47,
      location: "San Francisco, CA",
      availability: "available"
    },
    {
      id: "freelancer-2", 
      email: "alex.chen@example.com",
      firstName: "Alex",
      lastName: "Chen",
      bio: "Mobile app developer specializing in React Native and Flutter. Built 30+ apps with over 1M downloads.",
      skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
      hourlyRate: "75.00",
      isFreelancer: true,
      rating: "4.8",
      totalReviews: 32,
      location: "Toronto, Canada",
      availability: "available"
    },
    {
      id: "freelancer-3",
      email: "maria.garcia@example.com", 
      firstName: "Maria",
      lastName: "Garcia",
      bio: "UI/UX designer with expertise in creating beautiful, user-friendly interfaces for web and mobile applications.",
      skills: ["Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research"],
      hourlyRate: "65.00",
      isFreelancer: true,
      rating: "4.9",
      totalReviews: 28,
      location: "Barcelona, Spain",
      availability: "available"
    },
    {
      id: "freelancer-4",
      email: "david.kumar@example.com",
      firstName: "David", 
      lastName: "Kumar",
      bio: "Digital marketing specialist helping businesses grow through SEO, content marketing, and social media strategies.",
      skills: ["SEO", "Google Ads", "Social Media Marketing", "Content Strategy", "Analytics"],
      hourlyRate: "50.00", 
      isFreelancer: true,
      rating: "4.7",
      totalReviews: 19,
      location: "Mumbai, India",
      availability: "available"
    },
    {
      id: "freelancer-5",
      email: "emma.johnson@example.com",
      firstName: "Emma",
      lastName: "Johnson",
      bio: "Technical writer and content strategist with expertise in creating clear documentation and engaging marketing copy.",
      skills: ["Technical Writing", "Content Strategy", "Copywriting", "Documentation", "SEO Writing"],
      hourlyRate: "60.00",
      isFreelancer: true,
      rating: "4.8",
      totalReviews: 25,
      location: "London, UK",
      availability: "available"
    },
    {
      id: "freelancer-6",
      email: "james.brown@example.com", 
      firstName: "James",
      lastName: "Brown",
      bio: "Data scientist and analytics expert helping businesses make data-driven decisions with machine learning and AI.",
      skills: ["Python", "Machine Learning", "Data Analysis", "SQL", "Tableau"],
      hourlyRate: "95.00",
      isFreelancer: true,
      rating: "4.9",
      totalReviews: 15,
      location: "Austin, TX",
      availability: "available"
    }
  ];

  await db.insert(users).values(freelancersData);
  console.log("Freelancers created:", freelancersData.length);

  // Create sample services
  const servicesData = [
    {
      freelancerId: "freelancer-1",
      categoryId: insertedCategories[0].id, // Web Development
      title: "Custom React Web Application Development",
      description: "I'll build a modern, responsive web application using React, TypeScript, and your preferred backend technology. Includes responsive design, API integration, testing, and deployment.",
      price: "1500.00",
      deliveryTime: 14,
      images: ["https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400"],
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      isActive: true
    },
    {
      freelancerId: "freelancer-1",
      categoryId: insertedCategories[0].id, // Web Development  
      title: "E-commerce Website with Payment Integration",
      description: "Complete e-commerce solution with product catalog, shopping cart, secure payments, admin dashboard, and inventory management.",
      price: "2500.00",
      deliveryTime: 21,
      images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400"],
      skills: ["React", "Stripe", "Node.js", "MongoDB"],
      isActive: true
    },
    {
      freelancerId: "freelancer-2",
      categoryId: insertedCategories[1].id, // Mobile Development
      title: "Cross-Platform Mobile App Development", 
      description: "Build beautiful, performant mobile apps for iOS and Android using React Native or Flutter. Includes UI/UX design, backend integration, and app store deployment.",
      price: "2000.00",
      deliveryTime: 28,
      images: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400"],
      skills: ["React Native", "Flutter", "Firebase", "App Store"],
      isActive: true
    },
    {
      freelancerId: "freelancer-3",
      categoryId: insertedCategories[2].id, // Design & Creative
      title: "Complete UI/UX Design for Web & Mobile",
      description: "End-to-end design process including user research, wireframing, prototyping, and high-fidelity designs. Delivered in Figma with design system and developer handoff.",
      price: "800.00", 
      deliveryTime: 10,
      images: ["https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400"],
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      isActive: true
    },
    {
      freelancerId: "freelancer-3",
      categoryId: insertedCategories[2].id, // Design & Creative
      title: "Brand Identity & Logo Design Package",
      description: "Complete brand identity including logo design, color palette, typography, brand guidelines, and business card designs. Multiple concepts and unlimited revisions.",
      price: "600.00",
      deliveryTime: 7, 
      images: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400"],
      skills: ["Branding", "Logo Design", "Adobe Illustrator", "Brand Guidelines"],
      isActive: true
    },
    {
      freelancerId: "freelancer-4",
      categoryId: insertedCategories[3].id, // Digital Marketing
      title: "Complete SEO Audit & Optimization",
      description: "Comprehensive SEO analysis and optimization including keyword research, on-page optimization, technical SEO fixes, and content recommendations.",
      price: "400.00",
      deliveryTime: 5,
      images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"],
      skills: ["SEO", "Keyword Research", "Google Analytics", "Technical SEO"],
      isActive: true
    },
    {
      freelancerId: "freelancer-5",
      categoryId: insertedCategories[4].id, // Writing & Content
      title: "Technical Documentation & User Guides",
      description: "Clear, comprehensive technical documentation including API documentation, user guides, installation instructions, and developer resources.",
      price: "500.00",
      deliveryTime: 7,
      images: ["https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400"],
      skills: ["Technical Writing", "Documentation", "API Documentation", "User Guides"],
      isActive: true
    },
    {
      freelancerId: "freelancer-6",
      categoryId: insertedCategories[5].id, // Data & Analytics
      title: "Data Analysis & Business Intelligence Dashboard",
      description: "Custom data analysis and interactive dashboard creation using Python, SQL, and visualization tools like Tableau or Power BI.",
      price: "1200.00",
      deliveryTime: 10,
      images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"],
      skills: ["Python", "SQL", "Tableau", "Data Visualization"],
      isActive: true
    }
  ];

  await db.insert(services).values(servicesData);
  console.log("Services created:", servicesData.length);

  console.log("Database seeded successfully!");
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };