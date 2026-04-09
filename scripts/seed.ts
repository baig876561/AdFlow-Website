// ============================================================
// AdFlow Pro — Seed Script
// Usage: npx tsx scripts/seed.ts
// Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load env
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================================
// Data Definitions
// ============================================================

const USERS = [
  { email: "client@adflow.test", password: "Password123!", name: "Sarah Johnson", role: "client" },
  { email: "client2@adflow.test", password: "Password123!", name: "Mike Chen", role: "client" },
  { email: "client3@adflow.test", password: "Password123!", name: "Emma Wilson", role: "client" },
  { email: "moderator@adflow.test", password: "Password123!", name: "David Brown", role: "moderator" },
  { email: "admin@adflow.test", password: "Password123!", name: "Alex Rivera", role: "admin" },
  { email: "superadmin@adflow.test", password: "Password123!", name: "Jordan Taylor", role: "super_admin" },
];

const PACKAGES = [
  {
    name: "Basic", slug: "basic", duration_days: 7, weight: 1,
    is_featured: false, price: 9.99, badge_color: "#6b7280",
    max_images: 3, refresh_interval_days: null,
    description: "Perfect for getting started. 7-day listing with basic visibility.",
  },
  {
    name: "Standard", slug: "standard", duration_days: 15, weight: 2,
    is_featured: false, price: 24.99, badge_color: "#3b82f6",
    max_images: 6, refresh_interval_days: null,
    description: "Enhanced visibility with category priority. 15-day listing with manual refresh.",
  },
  {
    name: "Premium", slug: "premium", duration_days: 30, weight: 3,
    is_featured: true, price: 49.99, badge_color: "#f59e0b",
    max_images: 10, refresh_interval_days: 3,
    description: "Maximum exposure! Featured on homepage, auto-refresh every 3 days, 30-day listing.",
  },
];

const CATEGORIES = [
  { name: "Electronics", slug: "electronics", icon: "💻" },
  { name: "Vehicles", slug: "vehicles", icon: "🚗" },
  { name: "Real Estate", slug: "real-estate", icon: "🏠" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Home & Garden", slug: "home-garden", icon: "🌿" },
  { name: "Services", slug: "services", icon: "🔧" },
  { name: "Jobs", slug: "jobs", icon: "💼" },
  { name: "Education", slug: "education", icon: "📚" },
  { name: "Health & Beauty", slug: "health-beauty", icon: "💄" },
  { name: "Sports & Outdoors", slug: "sports-outdoors", icon: "⚽" },
];

const CITIES = [
  { name: "New York", slug: "new-york" },
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Chicago", slug: "chicago" },
  { name: "Houston", slug: "houston" },
  { name: "Miami", slug: "miami" },
  { name: "San Francisco", slug: "san-francisco" },
  { name: "Seattle", slug: "seattle" },
  { name: "Austin", slug: "austin" },
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
  "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
];

const YOUTUBE_URLS = [
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://www.youtube.com/watch?v=jNQXAC9IVRw",
];

const LEARNING_QUESTIONS = [
  { question: "What is the purpose of Row Level Security (RLS) in Supabase?", answer: "RLS allows you to define security policies directly in the database that restrict which rows a user can access, insert, update, or delete, based on their identity or role.", topic: "database", difficulty: "medium" },
  { question: "What does RBAC stand for?", answer: "Role-Based Access Control. It's a method of restricting system access to authorized users based on their assigned roles.", topic: "security", difficulty: "easy" },
  { question: "What is the difference between authentication and authorization?", answer: "Authentication verifies WHO you are (login). Authorization determines WHAT you can do (permissions/roles).", topic: "security", difficulty: "easy" },
  { question: "Why should scheduled jobs log their execution?", answer: "For monitoring, debugging, and proving to stakeholders that automated tasks are running correctly. It creates an audit trail.", topic: "operations", difficulty: "medium" },
  { question: "What is a slug in web development?", answer: "A URL-friendly version of a string, typically used in URLs. For example, 'My Cool Product' becomes 'my-cool-product'.", topic: "web", difficulty: "easy" },
];

// ============================================================
// Ad Templates
// ============================================================

interface AdTemplate {
  title: string;
  description: string;
  categorySlug: string;
  status: string;
  packageSlug: string;
  imageUrl: string;
}

const AD_TEMPLATES: AdTemplate[] = [
  // Draft (3)
  { title: "Brand New MacBook Pro 16-inch M3 Max", description: "Selling my brand new MacBook Pro 16-inch with M3 Max chip. 36GB RAM, 1TB SSD. Sealed in box, comes with original Apple warranty. Perfect for developers, designers, and video editors. Local pickup preferred.", categorySlug: "electronics", status: "Draft", packageSlug: "basic", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" },
  { title: "Handcrafted Wooden Dining Table", description: "Beautiful handcrafted solid oak dining table, seats 6-8 people. Custom made by local woodworker. Dimensions: 72x36 inches. Some minor scratches consistent with handmade furniture. Must see to appreciate the quality.", categorySlug: "home-garden", status: "Draft", packageSlug: "standard", imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80" },
  { title: "Professional Photography Services", description: "Professional photographer offering portrait, event, and product photography services. 10+ years of experience with weddings, corporate events, and studio shoots. Flexible packages available. Portfolio available upon request.", categorySlug: "services", status: "Draft", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" },

  // Submitted (2)
  { title: "2022 Tesla Model 3 Long Range", description: "Pristine 2022 Tesla Model 3 Long Range in Pearl White. Only 15,000 miles. Full Self-Driving capability included. Premium interior, glass roof, 19-inch sport wheels. Clean title, no accidents. Home charger included.", categorySlug: "vehicles", status: "Submitted", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80" },
  { title: "Vintage Leather Jacket Collection", description: "Curated collection of authentic vintage leather jackets from the 1970s-1990s. Various sizes (S-XL) and styles including biker, bomber, and cafe racer. All in excellent condition. Selling individually or as a lot.", categorySlug: "fashion", status: "Submitted", packageSlug: "standard", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80" },

  // Under Review (2)
  { title: "Downtown Luxury Condo for Sale", description: "Stunning 2BR/2BA luxury condo in the heart of downtown. Floor-to-ceiling windows with panoramic city views. Modern kitchen with top-of-the-line appliances. Building amenities include gym, pool, rooftop terrace, and 24/7 concierge. Parking included.", categorySlug: "real-estate", status: "Under Review", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1f2d9368ce?w=800&q=80" },
  { title: "Senior Software Engineer Position", description: "Exciting opportunity for a Senior Software Engineer at a growing tech startup. Work with cutting-edge technologies including React, Node.js, and AWS. Competitive salary ($150K-$200K), equity, full benefits, and flexible remote work. 5+ years experience required.", categorySlug: "jobs", status: "Under Review", packageSlug: "standard", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80" },

  // Payment Pending (2)
  { title: "Complete Home Gym Setup", description: "Full home gym setup including commercial-grade power rack, Olympic barbell and plates (300lbs total), adjustable dumbbells (5-90lbs), flat/incline bench, cable machine, and rubber flooring. Everything in excellent condition. Downsizing, must sell.", categorySlug: "sports-outdoors", status: "Payment Pending", packageSlug: "standard", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { title: "Online Math Tutoring - All Levels", description: "Experienced math tutor offering online lessons for all levels from elementary to college. Specializing in algebra, calculus, statistics, and SAT/ACT prep. Flexible scheduling, one-on-one sessions. First lesson free! Over 200 students helped.", categorySlug: "education", status: "Payment Pending", packageSlug: "basic", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80" },

  // Payment Submitted (2)
  { title: "Organic Skincare Products Bundle", description: "Premium organic skincare bundle featuring all-natural ingredients. Includes cleanser, toner, serum, moisturizer, and eye cream. Suitable for all skin types. Cruelty-free and vegan. Retail value $200, selling bundle for a fraction of the price.", categorySlug: "health-beauty", status: "Payment Submitted", packageSlug: "standard", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80" },
  { title: "4K Drone with Camera - DJI Mavic 3", description: "DJI Mavic 3 Cine Premium Combo. Hasselblad camera, 5.1K video, 46-min flight time. Includes 3 batteries, ND filters, carrying case, and extra propellers. Used for only 5 flights. Perfect for aerial photography enthusiasts.", categorySlug: "electronics", status: "Payment Submitted", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80" },

  // Payment Verified (2)
  { title: "Beachfront Vacation Rental", description: "Beautiful beachfront property available for weekly or monthly rental. 3 bedrooms, 2 bathrooms, fully furnished. Direct beach access, private balcony with ocean views. Central A/C, washer/dryer, modern kitchen. Perfect for families or remote workers.", categorySlug: "real-estate", status: "Payment Verified", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80" },
  { title: "Custom Built Gaming PC - RTX 4090", description: "Custom built high-end gaming PC. Specs: Intel i9-14900K, RTX 4090, 64GB DDR5 RAM, 2TB NVMe SSD, 360mm AIO cooler, Corsair 5000D case. RGB throughout. Runs any game at 4K Ultra. Built 3 months ago.", categorySlug: "electronics", status: "Payment Verified", packageSlug: "standard", imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80" },

  // Scheduled (1)
  { title: "Professional Home Cleaning Service", description: "Top-rated professional home cleaning service. Deep cleaning, regular maintenance, move-in/move-out cleaning. Licensed, bonded, and insured. Eco-friendly products used. Serving the greater metro area. Book online for 10% off first visit.", categorySlug: "services", status: "Scheduled", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80" },

  // Published (7)
  { title: "iPhone 15 Pro Max - 256GB Natural Titanium", description: "iPhone 15 Pro Max in Natural Titanium, 256GB. Excellent condition, always used with case and screen protector. Battery health at 97%. Comes with original box, charging cable, and a premium leather case. Unlocked for all carriers.", categorySlug: "electronics", status: "Published", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80" },
  { title: "Restored 1967 Ford Mustang Fastback", description: "Beautifully restored 1967 Ford Mustang Fastback. Matching numbers 289 V8 engine. Highland Green exterior, black interior. Frame-off restoration completed in 2023. All original parts restored. Show-quality finish. Must sell due to relocation.", categorySlug: "vehicles", status: "Published", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1584345604476-8cc5e3f54f58?w=800&q=80" },
  { title: "Luxury 3BR Apartment - Central Park View", description: "Spacious 3-bedroom luxury apartment with stunning Central Park views. Newly renovated with hardwood floors, marble bathrooms, chef's kitchen. Doorman building with gym and rooftop. Walking distance to subway. Available immediately.", categorySlug: "real-estate", status: "Published", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" },
  { title: "Designer Wedding Dress - Vera Wang", description: "Stunning Vera Wang wedding dress, worn once. Size 6, cathedral-length train. Hand-beaded bodice with Swarovski crystals. Professionally cleaned and preserved. Originally $8,000. Includes custom veil and garment bag.", categorySlug: "fashion", status: "Published", packageSlug: "standard", imageUrl: "https://images.unsplash.com/photo-1594552072238-18e388ff2ba1?w=800&q=80" },
  { title: "Smart Home Installation & Setup", description: "Complete smart home installation service. We handle everything: smart lighting, thermostats, security cameras, door locks, voice assistants, and home theater. Licensed electricians on staff. Free consultation and custom quotes. Serving all neighborhoods.", categorySlug: "services", status: "Published", packageSlug: "standard", imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80" },
  { title: "Mountain Bike - Specialized Stumpjumper", description: "2023 Specialized Stumpjumper Expert. Carbon frame, SRAM GX Eagle drivetrain, Fox 36 fork. Size Large. Used for one season, well maintained. Includes tubeless setup, Maxxis tires, and dropper post. Great trail bike.", categorySlug: "sports-outdoors", status: "Published", packageSlug: "basic", imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80" },
  { title: "Private SAT/ACT Prep Course", description: "Comprehensive SAT/ACT prep course with proven results. Average score improvement of 200+ points. Includes practice tests, study materials, and personalized study plan. Small groups (max 5 students) or private sessions available. Taught by 99th percentile scorer.", categorySlug: "education", status: "Published", packageSlug: "basic", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80" },

  // Expired (2)
  { title: "Summer Camp Registration - Early Bird", description: "STEM-focused summer camp for kids ages 8-14. Robotics, coding, 3D printing, and drone piloting. Weekly sessions from June to August. Early bird pricing available until March 31. Certified instructors, small class sizes.", categorySlug: "education", status: "Expired", packageSlug: "standard", imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80" },
  { title: "Year-End Clearance - Furniture Store", description: "Massive year-end clearance sale on all furniture. Up to 70% off on sofas, beds, dining sets, and home decor. Free delivery on orders over $500. Limited stock - first come, first served. Financing available.", categorySlug: "home-garden", status: "Expired", packageSlug: "premium", imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80" },
];

// ============================================================
// Seed Functions
// ============================================================

async function clearExistingData() {
  console.log("🗑️  Clearing existing data...");
  // Delete in reverse dependency order
  await supabase.from("system_health_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("learning_questions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("audit_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("ad_status_history").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("payments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("ad_media").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("ads").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("seller_profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("packages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("cities").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // Delete auth users (which cascades to public.users)
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  if (existingUsers?.users) {
    for (const u of existingUsers.users) {
      await supabase.auth.admin.deleteUser(u.id);
    }
  }
  console.log("✅ Existing data cleared.");
}

async function seedUsers() {
  console.log("👤 Seeding users...");
  const createdUsers: { id: string; email: string; role: string }[] = [];

  for (const user of USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { name: user.name, role: user.role },
    });

    if (error) {
      console.error(`  ❌ Failed to create ${user.email}:`, error.message);
      continue;
    }

    // Update role in public.users (trigger creates the row with client default)
    await supabase
      .from("users")
      .update({ role: user.role, name: user.name })
      .eq("id", data.user.id);

    createdUsers.push({ id: data.user.id, email: user.email, role: user.role });
    console.log(`  ✅ Created ${user.role}: ${user.email}`);
  }

  // Create seller profiles for clients
  for (const u of createdUsers.filter((u) => u.role === "client")) {
    const userName = USERS.find((usr) => usr.email === u.email)?.name || "User";
    await supabase.from("seller_profiles").insert({
      user_id: u.id,
      display_name: userName,
      business_name: `${userName.split(" ")[0]}'s Store`,
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      city: CITIES[Math.floor(Math.random() * CITIES.length)].name,
      bio: "Trusted seller on AdFlow Pro marketplace.",
      is_verified: Math.random() > 0.3,
    });
  }

  return createdUsers;
}

async function seedPackages() {
  console.log("📦 Seeding packages...");
  const { data, error } = await supabase.from("packages").insert(PACKAGES).select();
  if (error) { console.error("  ❌ Packages:", error.message); return []; }
  console.log(`  ✅ Created ${data.length} packages`);
  return data;
}

async function seedCategories() {
  console.log("📂 Seeding categories...");
  const { data, error } = await supabase.from("categories").insert(CATEGORIES).select();
  if (error) { console.error("  ❌ Categories:", error.message); return []; }
  console.log(`  ✅ Created ${data.length} categories`);
  return data;
}

async function seedCities() {
  console.log("🏙️  Seeding cities...");
  const { data, error } = await supabase.from("cities").insert(CITIES).select();
  if (error) { console.error("  ❌ Cities:", error.message); return []; }
  console.log(`  ✅ Created ${data.length} cities`);
  return data;
}

async function seedAds(
  users: { id: string; email: string; role: string }[],
  packages: any[],
  categories: any[],
  cities: any[]
) {
  console.log("📋 Seeding ads...");
  const clientUsers = users.filter((u) => u.role === "client");
  const createdAds: any[] = [];

  for (let i = 0; i < AD_TEMPLATES.length; i++) {
    const template = AD_TEMPLATES[i];
    const clientUser = clientUsers[i % clientUsers.length];
    const pkg = packages.find((p: any) => p.slug === template.packageSlug);
    const category = categories.find((c: any) => c.slug === template.categorySlug);
    const city = cities[i % cities.length];

    const slug = template.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) + `-${i}`;

    const now = new Date();
    let publishAt = null;
    let expireAt = null;

    if (template.status === "Published") {
      const daysAgo = Math.floor(Math.random() * 10);
      publishAt = new Date(now.getTime() - daysAgo * 86400000).toISOString();
      expireAt = new Date(
        new Date(publishAt).getTime() + (pkg?.duration_days || 7) * 86400000
      ).toISOString();
    } else if (template.status === "Scheduled") {
      publishAt = new Date(now.getTime() + 2 * 86400000).toISOString(); // 2 days from now
      expireAt = new Date(
        new Date(publishAt).getTime() + (pkg?.duration_days || 7) * 86400000
      ).toISOString();
    } else if (template.status === "Expired") {
      publishAt = new Date(now.getTime() - 40 * 86400000).toISOString();
      expireAt = new Date(now.getTime() - 2 * 86400000).toISOString();
    }

    const isFeatured = template.packageSlug === "premium" && template.status === "Published";
    const adminBoost = isFeatured ? Math.floor(Math.random() * 20) + 5 : 0;

    const { data: ad, error } = await supabase
      .from("ads")
      .insert({
        user_id: clientUser.id,
        package_id: pkg?.id || null,
        title: template.title,
        slug,
        category_id: category?.id || null,
        city_id: city?.id || null,
        description: template.description,
        status: template.status,
        admin_boost: adminBoost,
        is_featured: isFeatured,
        publish_at: publishAt,
        expire_at: expireAt,
        rank_score: 0,
      })
      .select()
      .single();

    if (error) {
      console.error(`  ❌ Ad "${template.title}":`, error.message);
      continue;
    }

    createdAds.push(ad);

    // Add designated template image
    await supabase.from("ad_media").insert({
      ad_id: ad.id,
      source_type: "image",
      original_url: template.imageUrl,
      thumbnail_url: template.imageUrl,
      validation_status: "valid",
      display_order: 0,
    });

    // Optionally add a random secondary image or youtube video
    const addSecondary = Math.random() > 0.5;
    if (addSecondary) {
      const isYouTube = Math.random() > 0.7;
      const secUrl = isYouTube
        ? YOUTUBE_URLS[Math.floor(Math.random() * YOUTUBE_URLS.length)]
        : SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];

      const sourceType = isYouTube ? "youtube" : "image";
      let thumbnailUrl = secUrl;
      if (isYouTube) {
        const match = secUrl.match(/(?:watch\?v=|embed\/|v\/)([\w-]{11})/);
        thumbnailUrl = match
          ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
          : secUrl;
      }

      await supabase.from("ad_media").insert({
        ad_id: ad.id,
        source_type: sourceType,
        original_url: secUrl,
        thumbnail_url: thumbnailUrl,
        validation_status: "valid",
        display_order: 1,
      });
    }

    // Add status history
    await supabase.from("ad_status_history").insert({
      ad_id: ad.id,
      previous_status: null,
      new_status: "Draft",
      changed_by: clientUser.id,
      note: "Ad created",
    });

    if (template.status !== "Draft") {
      await supabase.from("ad_status_history").insert({
        ad_id: ad.id,
        previous_status: "Draft",
        new_status: template.status,
        changed_by: clientUser.id,
        note: `Status set to ${template.status} via seed`,
      });
    }

    console.log(`  ✅ [${template.status.padEnd(18)}] ${template.title.slice(0, 50)}`);
  }

  return createdAds;
}

async function seedPayments(
  ads: any[],
  users: { id: string; email: string; role: string }[],
  packages: any[]
) {
  console.log("💳 Seeding payments...");
  const paidStatuses = [
    "Payment Submitted", "Payment Verified", "Scheduled", "Published", "Expired",
  ];

  for (const ad of ads) {
    if (!paidStatuses.includes(ad.status)) continue;

    const pkg = packages.find((p: any) => p.id === ad.package_id);
    const status =
      ad.status === "Payment Submitted" ? "pending" :
      ["Payment Verified", "Scheduled", "Published", "Expired"].includes(ad.status) ? "verified" : "pending";

    const adminUser = users.find((u) => u.role === "admin");

    await supabase.from("payments").insert({
      ad_id: ad.id,
      user_id: ad.user_id,
      amount: pkg?.price || 9.99,
      method: ["bank_transfer", "mobile_money", "card"][Math.floor(Math.random() * 3)],
      transaction_ref: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      sender_name: USERS.find((u) => users.find((usr) => usr.id === ad.user_id)?.email === u.email)?.name || "Unknown",
      screenshot_url: SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
      status,
      admin_note: status === "verified" ? "Payment confirmed." : null,
      verified_by: status === "verified" ? adminUser?.id : null,
      verified_at: status === "verified" ? new Date().toISOString() : null,
    });
  }
  console.log("  ✅ Payments seeded");
}

async function seedNotifications(users: { id: string; email: string; role: string }[]) {
  console.log("🔔 Seeding notifications...");
  const notifications = [
    { title: "Welcome to AdFlow Pro!", message: "Your account has been created. Start by creating your first ad listing.", type: "info" },
    { title: "Ad Approved", message: "Your ad has been reviewed and approved. Please submit payment to proceed.", type: "success" },
    { title: "Payment Verified", message: "Your payment has been verified. Your ad will be published shortly.", type: "success" },
    { title: "Ad Published", message: "Your ad is now live! It will be visible to all users.", type: "success" },
    { title: "Ad Expiring Soon", message: "Your ad will expire in 48 hours. Consider renewing to maintain visibility.", type: "warning" },
  ];

  for (const user of users.filter((u) => u.role === "client")) {
    for (const notif of notifications) {
      await supabase.from("notifications").insert({
        user_id: user.id,
        ...notif,
        is_read: Math.random() > 0.5,
      });
    }
  }
  console.log("  ✅ Notifications seeded");
}

async function seedLearningQuestions() {
  console.log("❓ Seeding learning questions...");
  const { error } = await supabase.from("learning_questions").insert(LEARNING_QUESTIONS);
  if (error) console.error("  ❌", error.message);
  else console.log("  ✅ Learning questions seeded");
}

async function seedHealthLogs() {
  console.log("💓 Seeding health logs...");
  const logs = [];
  for (let i = 0; i < 10; i++) {
    logs.push({
      source: ["cron:publish", "cron:expire", "db:heartbeat"][i % 3],
      status: "ok",
      response_ms: Math.floor(Math.random() * 100) + 10,
      message: "Routine check completed successfully.",
      checked_at: new Date(Date.now() - i * 3600000).toISOString(),
    });
  }
  await supabase.from("system_health_logs").insert(logs);
  console.log("  ✅ Health logs seeded");
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log("\n🚀 AdFlow Pro — Seed Script");
  console.log("═".repeat(50));

  await clearExistingData();

  const [packages, categories, cities] = await Promise.all([
    seedPackages(),
    seedCategories(),
    seedCities(),
  ]);

  const users = await seedUsers();
  const ads = await seedAds(users, packages, categories, cities);
  await seedPayments(ads, users, packages);
  await seedNotifications(users);
  await seedLearningQuestions();
  await seedHealthLogs();

  // Print credentials table
  console.log("\n═".repeat(50));
  console.log("🔑 LOGIN CREDENTIALS");
  console.log("═".repeat(50));
  console.log(
    "Email".padEnd(30) + "Password".padEnd(20) + "Role"
  );
  console.log("─".repeat(65));
  for (const user of USERS) {
    console.log(
      user.email.padEnd(30) +
        user.password.padEnd(20) +
        user.role
    );
  }
  console.log("─".repeat(65));

  // Print stats
  console.log("\n📊 SEED SUMMARY");
  console.log(`  Users:       ${users.length}`);
  console.log(`  Packages:    ${packages.length}`);
  console.log(`  Categories:  ${categories.length}`);
  console.log(`  Cities:      ${cities.length}`);
  console.log(`  Ads:         ${ads.length}`);
  console.log(`  Questions:   ${LEARNING_QUESTIONS.length}`);
  console.log("\n✨ Seeding complete!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
