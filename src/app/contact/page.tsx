import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the UnitWise team for questions, feedback, or support.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <div className="space-y-4 text-muted-foreground">
          <p>
            We value your feedback and are always looking to improve UnitWise. If you have any questions,
            suggestions, or need to report an issue, please reach out to us.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">Email</h2>
          <p>
            You can reach us at:{" "}
            <a href="mailto:contact@unitwise.online" className="text-primary hover:underline">
              contact@unitwise.online
            </a>
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">Bug Reports</h2>
          <p>
            If you notice an incorrect conversion result or any other issue, please let us know and we will
            investigate and fix it as soon as possible.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
