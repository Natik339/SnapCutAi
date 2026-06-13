import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | SnapCut AI" },
      { name: "description", content: "SnapCut AI Privacy Policy - Learn how we collect, use, and protect your data" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-4 text-sm text-muted-foreground">Last Updated: June 13, 2026</p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Welcome to SnapCut AI. We are committed to protecting your personal information and your right to privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
            website and use our services.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
            please do not access the site or use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
          <h3 className="mb-2 text-xl font-semibold">Personal Information:</h3>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number (if provided)</li>
            <li>Payment information (processed securely via Razorpay, we do not store your card details)</li>
            <li>Images you upload for background removal</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            We use the information we collect in the following ways:
          </p>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>To provide and maintain our services</li>
            <li>To process your payments securely</li>
            <li>To communicate with you about our services</li>
            <li>To improve and personalize user experience</li>
            <li>To detect and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Data Retention</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Uploaded images are automatically deleted from our servers within 24 hours of processing.
            We retain account information as long as your account is active or as needed to provide you services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">5. Data Security</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            We implement appropriate technical and organizational security measures to protect your personal information.
            All data transmitted is encrypted using SSL/TLS technology. However, no method of transmission over the Internet
            is 100% secure and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">6. Contact Us</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            If you have questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-2 font-semibold">Email: support@snapcut.ai</p>
          <p className="mb-2 font-semibold">Phone: +91 9876543210</p>
          <p className="mb-2 font-semibold">Address: 123 Tech Park, Bangalore, Karnataka, India</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
