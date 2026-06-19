import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund and Cancellation Policy | SnapCut" },
      { name: "description", content: "SnapCut Refund and Cancellation Policy - Understand our refund and cancellation terms" },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">Refund and Cancellation Policy</h1>
        <p className="mb-4 text-sm text-muted-foreground">Last Updated: June 13, 2026</p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Overview</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            SnapCut provides AI-powered background removal services. We want you to be completely satisfied with our services.
            This policy outlines our refund and cancellation terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Refund Policy</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Eligibility for refunds:
          </p>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>Free users: No refund applicable as no payment is involved</li>
            <li>Pro subscribers: Refunds are considered within 7 days of purchase if the service was not used</li>
            <li>Technical issues: If our service is unavailable for more than 24 hours, you may request a prorated refund</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. How to Request a Refund</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            To request a refund, please contact our customer support:
          </p>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>Email: support@snapcut.ai</li>
            <li>Subject line: Refund Request - [Your Registered Email]</li>
            <li>Include details: Date of purchase, payment transaction ID, reason for refund</li>
          </ul>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Refunds are processed within 5-7 business days of approval, credited back to your original payment method.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Cancellation Policy</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            You can cancel your subscription at any time from your account dashboard. Cancellation is effective immediately,
            and you will retain access to paid features until the end of your current billing period.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">5. Exceptions</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            We reserve the right to refuse a refund request if:
          </p>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>The request is made after 7 days of purchase with service usage</li>
            <li>There is evidence of violation of our terms of service</li>
            <li>Fraudulent activity is suspected</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
