import { Link } from "react-router-dom";
import FeatureAccordionCard from "../../components/ui/FeatureAccordionCard";
import FaqAccordionItem from "../../components/ui/FaqAccordionItem";

export default function Home() {
  const features = [
    {
      icon: "🛡️",
      title: "Secure Booking",
      details:
        "Our platform uses industry-standard protection to help keep your booking experience safe. Protected routes ensure only authorized users can access booking and admin features.",
    },
    {
      icon: "🛏️",
      title: "Modern Rooms",
      details:
        "Experience comfort like never before. Our partner hostels offer clean, well-ventilated spaces designed for both study and relaxation, with availability shown before you book.",
    },
    {
      icon: "🔔",
      title: "Instant Notifications",
      details:
        "Stay updated with real-time alerts. Get notified immediately about booking confirmations, reminders, and important announcements so you never miss an update.",
    },
  ];

  const faqs = [
    {
      q: "How to book?",
      a: "Simply browse through our list of hostels, select your preferred room, and click “Book now”. You’ll need to be logged in, and your booking will be confirmed instantly after the request completes.",
    },
    {
      q: "How to cancel?",
      a: "You can cancel your booking from your Dashboard. Open Dashboard → your booking → Cancel. Note: cancellation policies may vary by hostel.",
    },
  ];

  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-[0_25px_60px_rgba(15,23,42,0.10)]">
        <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-violet-500/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-sky-400/18 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-24 h-56 w-56 rounded-full bg-fuchsia-500/12 blur-3xl" />

        <div className="relative p-8 sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            RBAC Enabled • Admin & Student
          </div>

          <div className="mt-10 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-slate-900">
              Your Home
            </h1>
            <h2 className="mt-3 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-violet-600">
              Away From Home
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-base sm:text-lg text-slate-600">
              Find and book your perfect room in minutes. Secure, modern, and
              designed for the modern student lifestyle.
            </p>

            {/* KEEP THESE BUTTONS EXACTLY AS IS */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/hostels"
                className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
              >
                Explore Hostels
              </Link>

              <Link
                to="/dashboard"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US (added like your Image 15) */}
      <section className="py-2">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Why Choose Us?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            We provide the best living experience for students
          </p>
        </div>

        {/* FEATURE ACCORDIONS (independent open/close) */}
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-start">
          {features.map((f) => (
            <div key={f.title} className="md:flex-1">
              <FeatureAccordionCard
                icon={f.icon}
                title={f.title}
                details={f.details}
                maxContentHeight={220}
              />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-violet-600/10 ring-1 ring-violet-500/15">
            <span className="text-3xl text-violet-700">?</span>
          </div>

          <h2 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-5">
          {faqs.map((x, i) => (
            <FaqAccordionItem
              key={x.q}
              question={x.q}
              answer={x.a}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}