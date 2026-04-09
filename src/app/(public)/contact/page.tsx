export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted mb-8">We&apos;d love to hear from you</p>
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <input type="text" placeholder="Your name" className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <input type="email" placeholder="you@example.com" className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Subject</label>
          <input type="text" placeholder="How can we help?" className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Message</label>
          <textarea rows={5} placeholder="Tell us more..." className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none" />
        </div>
        <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-colors">
          Send Message
        </button>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ icon: "📧", label: "Email", value: "support@adflow.pro" }, { icon: "📞", label: "Phone", value: "+1 (555) 000-0000" }, { icon: "📍", label: "Location", value: "San Francisco, CA" }].map((item) => (
          <div key={item.label} className="glass-card rounded-xl p-4 text-center">
            <span className="text-2xl block mb-1">{item.icon}</span>
            <p className="text-xs text-muted">{item.label}</p>
            <p className="text-sm font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
