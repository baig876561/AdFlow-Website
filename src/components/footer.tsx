import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                AF
              </div>
              <span className="text-lg font-bold gradient-text">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              The advanced moderated ads marketplace. Trusted by thousands of sellers and buyers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: "/explore", label: "Explore Ads" },
                { href: "/packages", label: "Packages" },
                { href: "/categories", label: "Categories" },
                { href: "/cities", label: "Cities" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Account</h4>
            <ul className="space-y-2">
              {[
                { href: "/login", label: "Sign In" },
                { href: "/register", label: "Register" },
                { href: "/client", label: "Dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Legal</h4>
            <ul className="space-y-2">
              {[
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
                { href: "/terms", label: "Terms" },
                { href: "/privacy", label: "Privacy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
