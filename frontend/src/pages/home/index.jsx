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

  const showcaseImages = [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
  ];

  const carouselImages = [...showcaseImages, ...showcaseImages];

  const howItWorksSteps = [
    {
      title: "Search",
      description: "Browse through our curated list of verified hostels.",
      icon: "⌕",
    },
    {
      title: "Select",
      description: "Choose your preferred room type and check availability.",
      icon: "✧",
    },
    {
      title: "Confirm",
      description: "Complete your booking with a secure payment.",
      icon: "✓",
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
    <div className="space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-[#ff6f3d]/25 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,111,61,0.1),0_28px_70px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute -top-24 -left-28 h-72 w-72 rounded-full bg-[#ff6f3d]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-[#ff6f3d]/10 blur-3xl" />

        <div className="relative p-8 text-center sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6f3d]/35 bg-[#ff6f3d]/10 px-4 py-2 text-xs font-semibold text-[#ff9c7a]">
            <span className="h-2 w-2 rounded-full bg-[#ff6f3d]" />
            Trusted by 5000+ Students
          </div>

          <h1 className="mt-10 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your Home
          </h1>
          <h2 className="mt-3 text-5xl font-black leading-[0.95] tracking-tight text-[#ff7a45] [animation:away-glow_2.4s_ease-in-out_infinite] sm:text-6xl lg:text-7xl">
            Away From Home
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base text-slate-400 sm:text-lg">
            Find and book your perfect room in minutes. Secure, modern, and
            designed for the modern student lifestyle.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/hostels"
              className="rounded-2xl bg-[#ff6f3d] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,111,61,0.35),0_14px_35px_rgba(255,111,61,0.35)] hover:bg-[#ff7a45]"
            >
              Explore Hostels
            </Link>

            <Link
              to="/dashboard"
              className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* AUTO-SCROLL IMAGE STRIP (RIGHT -> LEFT) */}
      <section className="relative -mx-4 sm:-mx-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#060914] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#060914] to-transparent" />

        <div className="overflow-hidden py-1">
          <div className="flex w-max gap-5 [animation:gallery-drift_30s_linear_infinite]">
            {carouselImages.map((src, idx) => (
              <img
                key={`${src}-${idx}`}
                src={src}
                alt="Hostel preview"
                className="h-48 w-80 shrink-0 rounded-[28px] object-cover ring-1 ring-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.45)] sm:h-56 sm:w-[26rem]"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 shadow-[0_18px_55px_rgba(0,0,0,0.38)] sm:p-10">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            Three simple steps to your new room
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {howItWorksSteps.map((step) => (
            <div key={step.title} className="text-center">
              <div
                className={[
                  "mx-auto grid h-28 w-28 place-items-center rounded-3xl border transition-all duration-300",
                  "border-[#ff6f3d]/35 bg-white/[0.02] text-[#ff7a45] shadow-[0_0_0_1px_rgba(255,111,61,0.16),0_12px_28px_rgba(0,0,0,0.35)]",
                  "hover:-translate-y-1.5 hover:scale-[1.03] hover:border-[#ff6f3d] hover:bg-[#ff6f3d] hover:text-white",
                  "hover:shadow-[0_0_0_1px_rgba(255,111,61,0.55),0_22px_48px_rgba(255,111,61,0.5)]",
                ].join(" ")}
              >
                <span className="text-4xl">{step.icon}</span>
              </div>

              <h3 className="mt-6 text-3xl font-extrabold text-white">{step.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-base leading-8 text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-2">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Why Choose Us?
          </h2>
          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            We provide the best living experience for students
          </p>
        </div>

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

      {/* FAQ */}
      <section className="py-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#ff6f3d]/12 ring-1 ring-[#ff6f3d]/30">
            <span className="text-3xl text-[#ff8a5f]">?</span>
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
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