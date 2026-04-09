export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
      <div className="prose prose-invert prose-sm max-w-none space-y-6">
        {[
          { title: "1. Acceptance of Terms", content: "By accessing or using AdFlow Pro, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not use the platform." },
          { title: "2. User Accounts", content: "You must register for an account to create listings. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must be at least 18 years old to use this service." },
          { title: "3. Listing Guidelines", content: "All ads are subject to moderation. We reserve the right to reject, edit, or remove any listing that violates our content policies. Listings must be accurate, not misleading, and comply with applicable laws." },
          { title: "4. Payments", content: "Package fees are non-refundable once an ad has been published. Payment verification is required before ad publication. We use third-party payment verification and are not responsible for any disputes with payment providers." },
          { title: "5. Intellectual Property", content: "You retain ownership of your content. By posting, you grant AdFlow Pro a non-exclusive license to display your listings on the platform. You must not post content that infringes on others' intellectual property rights." },
          { title: "6. Prohibited Activities", content: "Users may not: post fraudulent listings, manipulate the ranking system, create multiple accounts to circumvent bans, or use the platform for illegal activities." },
          { title: "7. Limitation of Liability", content: "AdFlow Pro is provided 'as is' without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform." },
        ].map((section) => (
          <div key={section.title} className="glass-card rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-2">{section.title}</h2>
            <p className="text-sm text-muted leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
