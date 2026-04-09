# AdFlow Pro — Premium Marketplace Platform

**Live Production Link:** [https://adflow-web.vercel.app/](https://adflow-web.vercel.app/)

AdFlow Pro is a fully-featured, dynamically scalable marketplace platform designed to allow independent sellers (clients) to publish premium advertisements, purchase ranking packages, and manage their listings. The platform features an end-to-end multi-role permission system encompassing Clients, Moderators, and Administrators to maintain quality control and handle payments.

Built and optimized with a "Mobile-First" premium UI using Tailwind CSS and the Next.js App Router.

---

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, dynamic glassmorphism UI, fully mobile responsive dashboard
- **Backend as a Service:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email & Password with seamless auto-login)
- **Deployment:** Vercel

---

## 👥 Multi-Role Subsystems

The application enforces strict Row Level Security (RLS) and server-side checks depending on the authenticated role of the user:

### 1. Client (Seller)
- **Features:** Sellers can register and immediately create detailed ad listings.
- **Ad Configuration:** They can select Categories, target specific Regions/Cities, upload multiple image URLs, and choose specific duration packages (e.g., 7 Days, 14 Days, 30 Days).
- **Dashboard Management:** Clients have a dedicated portal where they can track Active ads, edit *Drafts*, delete listings, submit payment screenshots for approval, and **renew** expired ads automatically.

### 2. Moderator
- **Features:** Dedicated back-office staff who ensure marketplace quality.
- **Review Queue:** They manage the universal queue of "Submitted" ads, and can either Approve them (which triggers the payment phase) or Reject them while leaving a mandatory feedback note for the seller.

### 3. Administrator
- **Features:** Complete platform oversight.
- **Financials:** Admins review "Payment Submitted" ads. Once they manually verify the payment screenshot and transaction ID, the ad is officially granted "Published" status.
- **Analytics:** They have access to comprehensive monthly revenue bar charts, system-wide ad status counts, and demographic distributions.
- **System Settings:** Admins define available packages, pricing, active cities, and user suspensions.

---

## 🛠️ The Ad Lifecycle Workflow

AdFlow Pro utilizes a rigid state machine for ad listings. Every ad strictly transitions through the following statuses securely backed up by database policies:

1. **Draft:** Created but not yet finalized. Can be freely edited or deleted.
2. **Submitted:** The seller submits it for moderation.
3. **Payment Pending:** Approved by a Moderator; waiting for the seller to submit payment details.
4. **Payment Submitted:** Seller has uploaded proof of payment.
5. **Published:** Admin verifies the payment. The ad immediately goes live on the public explore pages. A countdown timer begins based on the selected package.
6. **Expired / Archived:** The duration window passes. The seller is then presented with a `Renew` functionality on their dashboard to reset the ad back to "Draft" and run it again.

---

## 💻 Key Technical Engineering Implementations

- **Robust Image Proxy Fallback:** Because clients can paste external image URLs from across the internet, the frontend employs a custom `<MediaPreview>` system. If a user inputs a blocked or broken `CORS` URL, the system attempts to intercept it and route it through a universal image proxy cache. If the image is entirely dead, it systematically fails gracefully to a styled placeholder rather than crashing the page.
- **Database Security Bypass Handlers:** To prevent rogue API requests, Supabase strictly denies direct SQL `UPDATE` queries to any Ad not in the "Draft" state. Therefore, complex actions like "Ad Renewals" are executed by a highly restricted server-side Route handler (`/api/client/ads/[id]`) that securely utilizes elevated privileges (`createAdminClient`) to forcefully execute the transition after verifying user ownership.
- **Dynamic Mobile Architectures:** The complex vertical Admin Dashboards automatically condense down to a sliding mobile "Hamburger Drawer" navigation on smaller viewports, ensuring content grids never break bounds on phones.
"We used GitHub Actions + API Cron Routes to handle time-sensitive state transitions. This decouples user-triggered actions from system-managed lifecycle tasks, ensuring the marketplace remains automated and self-sustaining 24/7."


---

## ⚙️ Running Locally

First, clone the repository and install all dependencies:
```bash
npm install
```

Ensure you have your environment variables hooked up to a live Supabase instance:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
