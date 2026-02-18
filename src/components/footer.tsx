import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";

const footerLinks = {
  Convert: [
    { href: "/convert", label: "All Conversions" },
    { href: "/categories/length", label: "Length" },
    { href: "/categories/weight", label: "Weight" },
    { href: "/categories/temperature", label: "Temperature" },
    { href: "/categories/area", label: "Area" },
    { href: "/categories/volume", label: "Volume" },
  ],
  More: [
    { href: "/categories/speed", label: "Speed" },
    { href: "/categories/time", label: "Time" },
    { href: "/categories/data", label: "Digital Storage" },
    { href: "/categories/pressure", label: "Pressure" },
    { href: "/categories/energy", label: "Energy" },
    { href: "/categories/power", label: "Power" },
  ],
  Legal: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookie-policy", label: "Cookie Policy" },
    { href: "/ads-policy", label: "Ads Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              UnitWise
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Free, fast, and accurate online unit converter. Trusted by users worldwide.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-semibold">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UnitWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
