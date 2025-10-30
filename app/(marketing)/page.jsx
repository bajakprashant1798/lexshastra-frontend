import Link from "next/link";
import Section from "@/components/site/Section";
import Button from "@/components/ui/Button";
import Matrix from "@/components/hero/Matrix";
import Reveal from "@/components/Reveal";
import {
  Sparkles,
  LayoutGrid,
  Calendar,
  BookUser,
  ReceiptIndianRupee,
  Users,
  BookMarked,
  LineChart,
} from "lucide-react";

export default function MarketingHome() {
  const overview = [
    {
      title: "AI Document Analysis",
      desc: "Instantly generate structured summaries and chronological timelines from any legal document.",
      Icon: Sparkles,
    },
    {
      title: "Unified Case Dashboard",
      desc: "Manage cases, documents, hearings, tasks, contacts, and finances from one place.",
      Icon: LayoutGrid,
    },
    {
      title: "Master Calendar & Tasks",
      desc: "Never miss hearings or deadlines with consolidated schedules and reminders.",
      Icon: Calendar,
    },
  ];

  const detailed = [
    {
      title: "AI Document Analysis",
      Icon: Sparkles,
      pills: [
        "Automated Summaries",
        "Chronological Timelines",
        "Key Argument Extraction",
        "OCR for Scanned Documents",
      ],
      desc:
        "Harness modern LLMs to understand PDFs, Word files, or text and extract key facts in seconds.",
    },
    {
      title: "Holistic Case Management",
      Icon: LayoutGrid,
      pills: [
        "Unified Case Dashboard",
        "Document Version Control",
        "Case Relations Linking",
        "Internal Notes",
      ],
      desc:
        "A central hub for every matter: numbers, courts, stages, parties, and linked artifacts.",
    },
    {
      title: "Intelligent Tasks & Hearings",
      Icon: Calendar,
      pills: [
        "Master Calendar",
        "Case-Specific Task Lists",
        "Priority & Assignee Tracking",
        "Hearing Reminders",
      ],
      desc:
        "Consolidate all critical dates and todos; stay prepared with proactive reminders.",
    },
    {
      title: "Comprehensive Contact Directory",
      Icon: BookUser,
      pills: ["Categorized Contacts", "Case Association", "Quick Linking"],
      desc:
        "Link clients, opposing counsel, and other contacts directly to the matters they belong to.",
    },
    {
      title: "Billing & Financial Oversight",
      Icon: ReceiptIndianRupee,
      pills: ["Time Tracking", "Expense Logging", "Fee Agreements", "Invoices"],
      desc:
        "Track billables, log expenses, and generate professional invoices with a few clicks.",
    },
    {
      title: "Team Collaboration & Workflow",
      Icon: Users,
      pills: [
        "Role-Based Case Assignment",
        "Task Delegation",
        "Internal Case Notes",
        "Directory",
      ],
      desc:
        "Assign roles, delegate work, and share context so everyone moves in sync.",
    },
    {
      title: "Dedicated Legal Research Hub",
      Icon: BookMarked,
      pills: [
        "Bare Act Pinning",
        "Case Law Database",
        "Issue-Based Organization",
        "Secondary Links",
      ],
      desc:
        "Pin key sections, save precedents, and bind research directly to each case.",
    },
    {
      title: "Insightful Reporting & Analytics",
      Icon: LineChart,
      pills: [
        "Financial Reports",
        "Case Status Analytics",
        "Team Performance",
        "Custom Builder",
      ],
      desc:
        "Get the bird’s-eye view you need for decisions and client updates.",
    },
  ];

  return (
    <main className="bg-background relative">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center pt-20">
        <Matrix />
        <div className="relative z-10 w-full">
          <Section className="text-center">
            <Reveal>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                From Chaos to Clarity.
                <br />
                <span className="text-primary">Your AI-Powered Legal Co-Pilot.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 max-w-2xl mx-auto text-muted">
                Lexshastra reads, organizes, and analyzes your case files, giving you
                unparalleled insights and saving you hundreds of hours. Focus on
                strategy, not paperwork.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Link href="/app">
                  <Button>Get Started for Free</Button>
                </Link>
                <Link href="#demo">
                  <Button variant="outline">Request a Demo</Button>
                </Link>
              </div>
            </Reveal>
          </Section>
        </div>
      </section>

      {/* OVERVIEW FEATURES */}
      <Section id="features" className="grid md:grid-cols-3 gap-6">
        {overview.map(({ title, desc, Icon }, i) => (
          <Reveal key={title} delay={0.05 * i}>
            <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6 shadow-sm">
              <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted mt-2">{desc}</p>
            </div>
          </Reveal>
        ))}
      </Section>

      {/* DETAILED FEATURES */}
      <Section className="pt-6">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Comprehensive Features for Every Legal Need
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted text-center max-w-2xl mx-auto mb-10">
            Discover the intelligent tools designed to streamline your litigation
            management—giving you back your most valuable asset: time.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {detailed.map(({ title, pills, desc, Icon }, idx) => (
            <Reveal key={title} delay={0.05 * idx}>
              <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl">{title}</h3>
                </div>
                <p className="text-sm text-muted mt-3">{desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pills.map((p) => (
                    <span
                      key={p}
                      className="text-xs px-2.5 py-1 rounded-full border border-border/50"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section id="testimonials" className="bg-[var(--bg-elev)] rounded-2xl">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Trusted by Top Litigators
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted text-center max-w-2xl mx-auto mb-10">
            Hear how Lexshastra is transforming legal practices across the country.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              initials: "SM",
              q:
                "Lexshastra has revolutionized our case management process. We've reduced preparation time by 40% and improved client satisfaction significantly.",
              who: "Sarah Mitchell",
              role: "Partner, Mitchell & Associates",
            },
            {
              initials: "DC",
              q:
                "The AI-powered insights have given us a competitive edge in complex litigation. It's like having a research team working 24/7.",
              who: "David Chen",
              role: "Senior Litigator, Chen Law Group",
            },
            {
              initials: "MR",
              q:
                "Finally, a platform that understands the intricacies of litigation management. Our entire workflow is now seamlessly integrated.",
              who: "Maria Rodriguez",
              role: "Legal Operations Director",
            },
          ].map((t, i) => (
            <Reveal key={t.initials} delay={0.05 * i}>
              <div className="rounded-2xl border border-border/50 bg-background p-6">
                <blockquote className="text-[1.05rem] italic border-l-4 pl-4 border-primary">
                  {t.q}
                </blockquote>
                <div className="flex items-center gap-3 mt-4">
                  <div className="size-10 rounded-full bg-primary text-black font-semibold grid place-items-center">
                    {t.initials}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{t.who}</div>
                    <div className="text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section id="cta" className="text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ready to Transform Your Legal Practice?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted max-w-xl mx-auto">
            Join thousands of legal professionals who trust Lexshastra to streamline their litigation management.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/app">
              <Button>Start Your Free Trial Today</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-semibold mb-3">Product</div>
            <ul className="space-y-2 text-muted">
              <li><a href="#features">Features</a></li>
              <li>Pricing</li>
              <li>Security</li>
              <li>Integrations</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Resources</div>
            <ul className="space-y-2 text-muted">
              <li>Documentation</li>
              <li>Blog</li>
              <li>Case Studies</li>
              <li>Webinars</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-muted">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li id="contact">Contact</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Legal</div>
            <ul className="space-y-2 text-muted">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>System Status</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-muted pb-10">
          © {new Date().getFullYear()} Lexshastra. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
