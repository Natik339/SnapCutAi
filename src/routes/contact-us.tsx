import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us | SnapCut" },
      { name: "description", content: "Get in touch with SnapCut - Contact information, support, and more" },
    ],
  }),
  component: ContactUsPage,
});

function ContactUsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">Contact Us</h1>
        
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Get In Touch</h2>
            
            <div className="mb-6 flex items-start gap-4">
              <Mail className="mt-1 h-6 w-6 flex-shrink-0 text-brand-gradient" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">support@snapcut.ai</p>
              </div>
            </div>
            
            <div className="mb-6 flex items-start gap-4">
              <Phone className="mt-1 h-6 w-6 flex-shrink-0 text-brand-gradient" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+91 9876543210</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-brand-gradient" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-muted-foreground">
                  SnapCut<br />
                  123 Tech Park, Electronic City<br />
                  Bangalore, Karnataka, 560100<br />
                  India
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-6 rounded-2xl border border-border">
            <h3 className="text-xl font-semibold mb-4">Business Details</h3>
            <p className="mb-2"><span className="font-semibold">Trade Name:</span> SnapCut</p>
            <p className="mb-2"><span className="font-semibold">Business Type:</span> Software as a Service (SaaS)</p>
            <p className="mb-2"><span className="font-semibold">Support Hours:</span> 9:00 AM - 6:00 PM IST, Mon-Sat</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
