// Dummy data seeder for services and freelancers
import { supabase } from './supabase';

async function seedDummyData() {
  console.log("Starting to seed dummy data...");

  try {
    // First, let's create some dummy freelancer users with proper UUIDs
    const freelancers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'john.smith@example.com',
        first_name: 'John',
        last_name: 'Smith',
        profile_image_url: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: 'Experienced full-stack developer with 7+ years of experience in web and mobile development. Specialized in React, Node.js, and TypeScript.',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'AWS'],
        hourly_rate: 75,
        is_freelancer: true,
        location: 'New Delhi, India',
        rating: 4.9,
        total_reviews: 47,
        status: 'approved',
        created_at: new Date().toISOString(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'sarah.johnson@example.com',
        first_name: 'Sarah',
        last_name: 'Johnson',
        profile_image_url: 'https://randomuser.me/api/portraits/women/44.jpg',
        bio: 'Creative UI/UX designer with a passion for crafting beautiful and intuitive user interfaces. Expert in Figma, Adobe XD, and responsive design.',
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        hourly_rate: 65,
        is_freelancer: true,
        location: 'Mumbai, India',
        rating: 4.8,
        total_reviews: 38,
        status: 'approved',
        created_at: new Date().toISOString(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'raj.patel@example.com',
        first_name: 'Raj',
        last_name: 'Patel',
        profile_image_url: 'https://randomuser.me/api/portraits/men/67.jpg',
        bio: 'Full-stack mobile developer specializing in cross-platform solutions using React Native and Flutter. Expert in creating performant, beautiful mobile apps.',
        skills: ['React Native', 'Flutter', 'Firebase', 'iOS', 'Android'],
        hourly_rate: 80,
        is_freelancer: true,
        location: 'Bangalore, India',
        rating: 4.7,
        total_reviews: 29,
        status: 'approved',
        created_at: new Date().toISOString(),
      }
    ];

    // Insert freelancers
    console.log("Creating dummy freelancers...");
    for (const freelancer of freelancers) {
      const { error } = await supabase
        .from('users')
        .upsert(freelancer, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error creating freelancer ${freelancer.id}:`, error);
      } else {
        console.log(`Created/updated freelancer: ${freelancer.first_name} ${freelancer.last_name}`);
      }
    }

    // Now, create some service categories if they don't exist
    const categories = [
      { id: 1, name: "Web Development", description: "Frontend, backend, and full-stack web development", icon: "💻" },
      { id: 2, name: "Mobile Development", description: "iOS, Android, and cross-platform mobile apps", icon: "📱" },
      { id: 3, name: "Design & Creative", description: "UI/UX, graphic design, branding, and creative work", icon: "🎨" },
      { id: 4, name: "Digital Marketing", description: "SEO, social media, content marketing, and advertising", icon: "📈" },
      { id: 5, name: "Writing & Content", description: "Copywriting, technical writing, and content creation", icon: "✍️" },
      { id: 6, name: "Data & Analytics", description: "Data science, analytics, and business intelligence", icon: "📊" }
    ];

    console.log("Creating service categories...");
    const { error: categoryError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'id' });

    if (categoryError) {
      console.error("Error creating categories:", categoryError);
    } else {
      console.log("Created/updated service categories");
    }

    // Create dummy services
    const services = [
      {
        id: 1,
        freelancer_id: '550e8400-e29b-41d4-a716-446655440000',
        category_id: 1, // Web Development
        title: "I will create a professional React website for your business",
        description: `I'll develop a modern, responsive React.js website tailored to your business needs. With 7+ years of experience, I specialize in creating fast, SEO-friendly, and user-friendly web applications.

**What you'll get:**
- Custom React.js website built from scratch
- Mobile-responsive design
- Interactive UI components
- API integration if required
- Clean, well-documented code
- 1 month of support after delivery

**Why choose me:**
- 7+ years of professional experience
- Fast communication and timely delivery
- Clean code following best practices
- Attention to detail and performance
- SEO-friendly implementation`,
        price: 15000,
        delivery_time: 14,
        images: ["https://images.unsplash.com/photo-1545670723-196ed0954986?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3"],
        skills: ["React", "JavaScript", "Responsive Design", "Web Development"],
        status: "approved",
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        freelancer_id: '550e8400-e29b-41d4-a716-446655440001',
        category_id: 3, // Design & Creative
        title: "I will design a modern UI/UX interface for your app or website",
        description: `I will create a stunning UI/UX design for your app or website that not only looks beautiful but is also intuitive and user-friendly.

**What's included:**
- Full UI design for up to 5 pages/screens
- Wireframes and prototypes
- User flow diagrams
- Responsive designs for all screen sizes
- Source files (Figma/XD)
- Unlimited revisions until you're satisfied

**My design process:**
1. Understanding your requirements and target audience
2. Research and competitive analysis
3. Wireframing and prototyping
4. UI design with attention to color theory and typography
5. Interactive prototypes for testing
6. Refinement based on feedback

I specialize in creating designs that convert visitors into customers through strategic placement of UI elements and clear call-to-actions.`,
        price: 12000,
        delivery_time: 7,
        images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3"],
        skills: ["UI/UX Design", "Figma", "Adobe XD", "Wireframing", "Prototyping"],
        status: "approved",
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        freelancer_id: '550e8400-e29b-41d4-a716-446655440002',
        category_id: 2, // Mobile Development
        title: "I will develop a cross-platform mobile app with React Native",
        description: `I will build a high-quality, performant mobile application for both iOS and Android platforms using React Native.

**Package includes:**
- Custom React Native app development
- Both iOS and Android compatibility
- Integration with backend APIs
- User authentication system
- Push notifications setup
- Store submission preparation
- 2 months of bug fixes and support

**My development approach:**
- Clean, maintainable code architecture
- Performance optimization for smooth user experience
- Comprehensive testing on multiple devices
- Regular updates throughout the development process
- Knowledge transfer and documentation

I specialize in creating apps that feel truly native while maintaining the cost-effectiveness of cross-platform development.`,
        price: 25000,
        delivery_time: 21,
        images: ["https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"],
        skills: ["React Native", "iOS", "Android", "Firebase", "API Integration"],
        status: "approved",
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 4,
        freelancer_id: '550e8400-e29b-41d4-a716-446655440000',
        category_id: 1, // Web Development
        title: "I will build a custom e-commerce website with Next.js and Stripe",
        description: `I'll create a fully-featured e-commerce solution using Next.js, with Stripe integration for seamless payments.

**What you'll get:**
- Complete e-commerce website with product catalog
- Admin dashboard for product management
- User authentication and account management
- Shopping cart functionality
- Secure Stripe payment processing
- Order management system
- Responsive design for all devices
- SEO optimized structure

**Tech stack:**
- Next.js for server-side rendering and optimal performance
- TypeScript for robust code
- Tailwind CSS for beautiful UI
- Stripe API for payment processing
- MongoDB or PostgreSQL for database (your choice)

With over 7 years of experience building e-commerce platforms, I'll ensure your online store is fast, secure, and conversion-optimized.`,
        price: 35000,
        delivery_time: 30,
        images: ["https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"],
        skills: ["Next.js", "E-commerce", "Stripe", "React", "TypeScript"],
        status: "approved",
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 5,
        freelancer_id: '550e8400-e29b-41d4-a716-446655440001',
        category_id: 4, // Digital Marketing
        title: "I will create a comprehensive social media marketing strategy",
        description: `I'll develop a tailored social media marketing strategy to help your business grow its online presence and engagement.

**This package includes:**
- In-depth audit of current social media presence
- Competitor analysis
- Target audience identification
- Content calendar for 3 months
- Channel-specific strategies (Instagram, Facebook, LinkedIn, Twitter)
- Hashtag research and recommendations
- Engagement tactics and community building approach
- Performance metrics and KPIs
- Growth strategies and recommendations

As an experienced digital marketer, I focus on creating strategies that drive real business results - increased followers, engagement, and ultimately, conversions and sales.`,
        price: 18000,
        delivery_time: 10,
        images: ["https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"],
        skills: ["Social Media Marketing", "Content Strategy", "Digital Marketing", "Brand Development"],
        status: "approved",
        is_active: true,
        created_at: new Date().toISOString(),
      }
    ];

    // Insert services
    console.log("Creating dummy services...");
    for (const service of services) {
      const { error } = await supabase
        .from('services')
        .upsert(service, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error creating service ${service.id}:`, error);
      } else {
        console.log(`Created/updated service: ${service.title}`);
      }
    }

    console.log("Dummy data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding dummy data:", error);
  }
}

// Run the seeder
seedDummyData()
  .then(() => {
    console.log("Seeding process complete.");
  })
  .catch(error => {
    console.error("Error in seeding process:", error);
  });