import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms-conditions")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | SnapCut AI" },
      { name: "description", content: "SnapCut AI Terms and Conditions - Understand your rights and obligations when using our services" },
    ],
  }),
  component: TermsConditionsPage,
});

function TermsConditionsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">Terms and Conditions</h1>
        <p className="mb-4 text-sm text-muted-foreground">Last Updated: June 13, 2026</p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Agreement to Terms</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            By accessing and using SnapCut AI, you agree to be bound by these Terms and Conditions.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Description of Service</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            SnapCut AI provides an AI-powered background removal service that allows users to upload images
            and receive processed images with transparent backgrounds.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. User Responsibilities</h2>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>You must be at least 13 years of age to use our services</li>
            <li>You are solely responsible for the images you upload</li>
            <li>You must not upload images that violate copyright or intellectual property laws</li>
            <li>You must not use the service for any illegal or unauthorized purpose</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Payments and Subscriptions</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Payments are processed securely through Razorpay. By subscribing, you agree to pay all fees
            in accordance with the pricing plan you select. We reserve the right to modify pricing at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">5. Intellectual Property</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            SnapCut AI retains all rights to our technology, trademarks, and service. You retain all rights to
            the images you process, subject to our usage policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">6. Limitation of Liability</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            SnapCut AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages
            arising out of your use of our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">7. Governing Law</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            These terms shall be governed by and construed in accordance with the laws of India,
            without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">8. Contact Information</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            For any questions about these Terms and Conditions, please contact:
          </p>
          <p className="mb-2 font-semibold">SnapCut AI</p>
          <p className="mb-2">Email: support@snapcut.ai</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
