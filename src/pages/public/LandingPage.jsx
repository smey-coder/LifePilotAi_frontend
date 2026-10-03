import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles} from "lucide-react";
import useAuth from "../../hooks/useAuth";
// import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Array រូបភាព/Features សម្រាប់រត់ Auto-scroll Carousel
  const carouselItems = [
    {
      id: 1,
      title: "Task Management Board",
      description: "រៀបចំកិច្ចការងារប្រចាំថ្ងៃតាម priority និង status",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      tag: "Productivity",
    },
    {
      id: 2,
      title: "AI Chat Assistant",
      description: "ជំនួយការឆ្លាតវៃជួយសរសេរ សង្ខេប និងរៀបចំកាលវិភាគ",
      image:
        "https://cdn.prod.website-files.com/6720b95e7f51200beb62e9fd/690a0b4df0c3871031657ffd_ChatGPT%20Image%20Nov%203%2C%202025%2C%2006_23_20%20PM.webp",
      tag: "AI Powered",
    },
    {
      id: 3,
      title: "Analytics & Progress",
      description: "តាមដានការរីកចម្រើន និងទម្លាប់ប្រចាំថ្ងៃរបស់អ្នក",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      tag: "Analytics",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  // Auto Scroll logic 3 វិនាទីម្តង
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [carouselItems.length]);
  const activeFeature = carouselItems[currentIndex];
  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
              P
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              LifePilot AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition">
              លក្ខណៈពិសេស (Features)
            </a>
            <a
              href="#how-it-works"
              className="hover:text-indigo-600 transition"
            >
              របៀបប្រើប្រាស់ (How It Works)
            </a>
            <a
              href="#ai-assistant"
              className="hover:text-indigo-600 transition"
            >
              AI Assistant
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
              >
                ទៅកាន់ Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-700 hover:text-indigo-600 text-sm font-semibold transition"
                >
                  ចូលប្រើប្រាស់ (Login)
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition"
                >
                  បង្កើតគណនី (Sign Up)
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH ANIMATION & MOCKUP */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 animate-pulse">
          <span>✨ ជំនួយការ AI ឆ្លាតវៃសម្រាប់ជីវិតប្រចាំថ្ងៃ</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          គ្រប់គ្រងការងារ និងជីវិតរបស់អ្នកដោយភាពឆ្លាតវៃជាមួយ{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            LifePilot AI
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-8 leading-relaxed">
          ប្រព័ន្ធគ្រប់គ្រង Task, Note, Goal និង Habit ដែលមាន AI
          ជួយរៀបចំកាលវិភាគ ធ្វើសង្ខេបមេរៀន
          និងបង្កើនផលិតភាពការងាររបស់អ្នកឱ្យកាន់តែប្រសើរ។
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button
            onClick={handleGetStarted}
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl text-base font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition duration-200"
          >
            ចាប់ផ្ដើមប្រើប្រាស់ឥតគិតថ្លៃ
          </button>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-base font-semibold hover:bg-slate-50 transition"
          >
            មើលរបៀបប្រើប្រាស់
          </a>
        </div>

        {/* UI Dashboard Preview Card */}
        <div className="relative max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">
          <div className="bg-slate-900 rounded-xl p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span className="text-xs text-slate-400 ml-2">
                lifepilot.ai/dashboard
              </span>
            </div>

            {/* Mock Dashboard UI Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Today's Tasks
                </p>
                <div className="mt-3 space-y-2">
                  <div className="p-2 bg-slate-700/50 rounded text-xs text-emerald-400 flex justify-between">
                    <span>✓ Design React Landing Page</span>
                    <span>Done</span>
                  </div>
                  <div className="p-2 bg-slate-700/50 rounded text-xs text-slate-200 flex justify-between">
                    <span>• Setup PostgreSQL Schema</span>
                    <span>Pending</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                <p className="text-xs text-indigo-400 font-semibold uppercase">
                  AI Recommendation
                </p>
                <p className="mt-2 text-xs text-slate-300 italic">
                  "អ្នកមានកិច្ចការចំនួន ៣ ដែលត្រូវបញ្ចប់នៅថ្ងៃនេះ។
                  ខ្ញុំបានរៀបចំអទិភាពសម្រាប់អ្នករួចរាល់!"
                </p>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                <p className="text-xs text-amber-400 font-semibold uppercase">
                  Habit Tracker
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-4/5"></div>
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">
                    80%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
      id="features"
      className="relative overflow-hidden border-y border-slate-200/80 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 py-20 lg:py-28"
    >
      {/* Background Decorative Glow Effect */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column: Image Card with Hover & Smooth Fade Animation */}
          <div className="lg:col-span-7">
            <div className="group relative overflow-hidden rounded-2xl bg-slate-900 p-2 shadow-2xl shadow-indigo-950/10 ring-1 ring-slate-200/50 transition-all duration-500 hover:shadow-indigo-500/10">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-950">
                <img
                  key={activeFeature.image}
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 animate-slide-up"
                />
                
                {/* Image Overlay Gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />
                
                {/* Dynamic Floating Badge on Top of Image */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md ring-1 ring-white/10">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>{activeFeature.tag}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content & Controls */}
          <div className="lg:col-span-5">
            <div key={activeFeature.title} className="animate-slide-up">
              
              {/* Badge Tag */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                {activeFeature.tag}
              </div>

              {/* Title */}
              <h2
                id="ai-assistant"
                className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
              >
                {activeFeature.title}
              </h2>

              {/* Description */}
              <p className="mb-8 text-base leading-relaxed text-slate-600 sm:text-lg">
                {activeFeature.description}
              </p>

              {/* Navigation Controls */}
              <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous feature"
                    onClick={() =>
                      setCurrentIndex(
                        (currentIndex - 1 + carouselItems.length) %
                          carouselItems.length
                      )
                    }
                    className="inline-flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    aria-label="Next feature"
                    onClick={() =>
                      setCurrentIndex((currentIndex + 1) % carouselItems.length)
                    }
                    className="inline-flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </div>

                {/* Counter & Progress Dots */}
                <div className="ml-auto flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {carouselItems.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentIndex === idx
                            ? 'w-6 bg-indigo-600'
                            : 'w-2 bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <span
                    className="text-xs font-semibold text-slate-400"
                    aria-live="polite"
                  >
                    0{currentIndex + 1} / 0{carouselItems.length}
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

      {/* 3. HOW IT WORKS (3 EASY STEPS) */}
      <section
        id="how-it-works"
        className="py-20 bg-white border-y border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              របៀបប្រើប្រាស់ LifePilot AI
            </h2>
            <p className="text-slate-600">
              ត្រឹមតែ ៣ ជំហានងាយៗដើម្បីរៀបចំជីវិត
              និងកិច្ចការងាររបស់អ្នកឱ្យមានរបៀបរៀបរយ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                បង្កើតគណនី (Sign Up)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                ចុះឈ្មោះដោយប្រើប្រាស់ អុីមែល ឬ Google OAuth
                ត្រឹមតែប៉ុន្មានវិនាទី ដើម្បីទទួលបានគណនីប្រើប្រាស់។
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                បញ្ចូល Tasks & Goals
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                បង្កើតកិច្ចការ (Tasks), កត់ត្រាព័ត៌មាន (Notes) និងរៀបចំគោលដៅ
                (Goals) របស់អ្នកក្នុងប្រព័ន្ធ។
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                ឱ្យ AI ជួយសម្រួល
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                ប្រើប្រាស់ AI Assistant ដើម្បីសង្ខេប Note, ណែនាំ Priority
                កិច្ចការងារ និងបង្កើត Schedule ស្វ័យប្រវត្តិ។
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION FOOTER */}
      <section className="py-20 bg-indigo-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ត្រៀមខ្លួនរួចរាល់ក្នុងការបង្កើនផលិតភាពហើយឬនៅ?
          </h2>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
            ចូលរួមជាមួយ LifePilot AI ថ្ងៃនេះ
            ដើម្បីទទួលបានបទពិសោធន៍ថ្មីក្នុងការគ្រប់គ្រងពេលវេលា។
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-indigo-900 rounded-xl text-base font-bold hover:bg-slate-100 transition shadow-lg"
            >
              បង្កើតគណនីឥឡូវនេះ
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 border border-indigo-400 text-white rounded-xl text-base font-semibold hover:bg-indigo-800 transition"
            >
              ចូលប្រើប្រាស់ (Login)
            </Link>
          </div>
          <p className="mt-10 text-sm text-indigo-300">
            &copy; {currentYear} LifePilot AI. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
