import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/shipping-delivery")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery | SnapCut" },
      { name: "description", content: "SnapCut Shipping & Delivery Policy - Information about delivery of our digital services" },
    ],
  }),
  component: ShippingDeliveryPage,
});

function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">Shipping & Delivery Policy</h1>
        <p className="mb-4 text-sm text-muted-foreground">Last Updated: June 13, 2026</p>

        <section className="mb-8">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-brand-soft/30 px-4 py-2">
            <Zap className="h-5 w-5 text-brand-gradient" />
            <p className="font-semibold">Instant Digital Delivery</p>
          </div>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            SnapCut is a Software as a Service (SaaS) platform. We provide digital services only.
            There is no physical product to be shipped.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Delivery Timeline</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Free Plan:</strong> Access is granted immediately upon visit to our website.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Paid Plans:</strong> Access to premium features is granted immediately upon successful payment confirmation,
            typically within a few seconds.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Delivery Method</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            All services are delivered electronically through our web application at https://fade-out-ai.vercel.app
            and any subdomains. No physical goods are shipped.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Upon successful payment, you will receive:
          </p>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>Immediate access to paid features</li>
            <li>Payment confirmation email sent to your registered email address</li>
            <li>Invoice (if requested via support)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. Issues with Delivery</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            If you do not receive payment confirmation email within 30 minutes, or if your paid features are not activated,
            please contact our support team immediately at:
          </p>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>Email: support@snapcut.ai</li>
            <li>Phone: +91 9876543210</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. International Availability</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Our services are available worldwide with the exception of countries sanctioned by the Government of India.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
