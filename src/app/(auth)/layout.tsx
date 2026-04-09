import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
        ← Back to Site
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
