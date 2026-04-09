export const metadata = { title: "FAQ" };

const faqs = [
  { q: "How do I create a listing?", a: "Sign up for a free account, navigate to your dashboard, and click 'Create Ad'. Fill in the details, select a package, and submit for review." },
  { q: "How long does the review process take?", a: "Our moderation team typically reviews listings within 24 hours. You'll receive a notification once your ad is reviewed." },
  { q: "What payment methods are accepted?", a: "We accept bank transfers, mobile money, card payments, and crypto. Submit your payment proof after selecting a package." },
  { q: "Can I edit my ad after publishing?", a: "Published ads require admin review for critical changes. You can freely edit ads in Draft or Rejected status." },
  { q: "What happens when my ad expires?", a: "Expired ads are automatically hidden from public view. You can renew your listing by contacting our team." },
  { q: "How does the ranking system work?", a: "Ad ranking is based on package tier, featured status, freshness, verified seller bonus, and optional admin boost." },
  { q: "What media formats are supported?", a: "We support direct image URLs (JPG, PNG, WebP, GIF) and YouTube video links. All media is validated before display." },
  { q: "How do I become a verified seller?", a: "Verification is granted based on your listing history, payment record, and profile completeness. Contact support to apply." },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted mb-8">Everything you need to know about AdFlow Pro</p>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card rounded-xl p-5 transition-all duration-200 hover:border-primary/20">
            <h3 className="text-sm font-semibold mb-2 text-foreground">{faq.q}</h3>
            <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
