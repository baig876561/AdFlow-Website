export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
      <div className="space-y-6">
        {[
          { title: "Information We Collect", content: "We collect information you provide directly: name, email, listing content, and payment proof. We also collect usage data including device information, IP address, and browsing patterns." },
          { title: "How We Use Your Information", content: "Your information is used to: provide and improve our services, process transactions, communicate with you, enforce our terms, and prevent fraud." },
          { title: "Data Sharing", content: "We do not sell your personal data. We may share data with: service providers (hosting, analytics), law enforcement when required, and other users (public listing information only)." },
          { title: "Data Security", content: "We implement industry-standard security measures including encryption, access controls, and regular security audits. However, no method of transmission over the internet is 100% secure." },
          { title: "Your Rights", content: "You have the right to: access your data, correct inaccuracies, delete your account, and opt out of marketing communications. Contact us at privacy@adflow.pro for any requests." },
          { title: "Cookies", content: "We use essential cookies for authentication and session management. We may use analytics cookies to understand how you use our platform. You can control cookie preferences in your browser settings." },
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
