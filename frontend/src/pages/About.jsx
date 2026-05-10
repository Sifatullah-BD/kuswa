import React from "react";
import { useLang } from "../context/LanguageContext";
import { KUSWA_IMAGES } from "../lib/images";
import { Target, Eye, Heart, Award } from "lucide-react";

export default function About() {
  const { t, lang } = useLang();
  const blocks = [
    { Icon: Target, en_t: "Our Mission", bn_t: "আমাদের লক্ষ্য",
      en: "To uplift our community through education, humanitarian aid and sustainable social development.",
      bn: "শিক্ষা, মানবিক সহায়তা ও টেকসই সামাজিক উন্নয়নের মাধ্যমে আমাদের সম্প্রদায়কে এগিয়ে নেওয়া।" },
    { Icon: Eye, en_t: "Our Vision", bn_t: "আমাদের ভিশন",
      en: "A self-reliant, educated and empathetic society where no one is left behind.",
      bn: "একটি স্বনির্ভর, শিক্ষিত ও মানবিক সমাজ যেখানে কেউ পিছিয়ে থাকবে না।" },
    { Icon: Heart, en_t: "Our Values", bn_t: "আমাদের মূল্যবোধ",
      en: "Integrity, transparency, compassion, volunteerism and community-first action.",
      bn: "সততা, স্বচ্ছতা, সহমর্মিতা, স্বেচ্ছাসেবা ও সমাজকেন্দ্রিক কাজ।" },
    { Icon: Award, en_t: "Our Impact", bn_t: "আমাদের প্রভাব",
      en: "Two decades of consistent service in education, relief and youth empowerment.",
      bn: "শিক্ষা, ত্রাণ ও যুব ক্ষমতায়নে দুই দশকের অবিচ্ছিন্ন সেবা।" },
  ];
  return (
    <div data-testid="about-page">
      <section className="bg-gradient-soft py-20">
        <div className="container-x">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {lang === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
          </h1>
          <p className="mt-4 max-w-3xl text-kuswa-muted text-lg">
            {lang === "bn"
              ? "কুশিয়ারা কল্যাণ সংসদ (কুশা) ২০০৪ সালে যাত্রা শুরু করে। সমাজের পিছিয়ে পড়া মানুষের কল্যাণ, শিক্ষা সহায়তা ও মানবিক ত্রাণ সরবরাহই আমাদের মূল কাজ।"
              : "Kushiara Welfare Association (KUSWA) started its journey in 2004. Welfare for marginalized communities, education aid, and humanitarian relief are our core focus."}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid md:grid-cols-2 gap-6">
          {blocks.map(({ Icon, en_t, bn_t, en, bn }, i) => (
            <div key={i} className="card-soft" data-testid={`about-block-${i}`}>
              <div className="w-12 h-12 grid place-items-center rounded-xl bg-gradient-section text-white mb-4">
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-bold text-kuswa-dark-blue">{lang === "bn" ? bn_t : en_t}</h3>
              <p className="mt-2 text-kuswa-muted leading-relaxed">{lang === "bn" ? bn : en}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-kuswa-bg">
        <div className="container-x grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-soft">
              <img src={KUSWA_IMAGES.president_message} alt="President's Message" className="w-full h-auto object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 className={`text-3xl font-bold mb-4 ${lang === "bn" ? "font-bn" : "font-display"}`}>
              <span className="text-gradient-brand">{lang === "bn" ? "সভাপতির বাণী" : "President's Message"}</span>
            </h2>
            <p className="text-kuswa-muted leading-relaxed text-lg">
              {lang === "bn"
                ? "যতদিন পর্যন্ত প্রতিটি নাগরিকের জন্য সুস্থ, সচ্ছল এবং সম্মানজনক জীবন নিশ্চিত না হবে, ততদিন পর্যন্ত আমাদের এই সংগ্রাম, আমাদের এই সাধনা চলতেই থাকবে — ইনশাআল্লাহ। আর আমাদের দৃষ্টি থাকবে জান্নাতের দিকে। জীবনের শেষ রক্তবিন্দু আমাদের শরীরে থাকা পর্যন্ত আমরা সামনে এগিয়ে যাব। যতদিন না পর্যন্ত আমরা জান্নাতে পৌছাবো ততদিন পর্যন্ত এই কাফেলা থামবে না।"
                : "Until a healthy, prosperous and dignified life is ensured for every citizen, our struggle will continue, Insha'Allah. Our gaze will remain on Jannah. We will keep moving forward as long as the last drop of blood remains in our body. This caravan will not stop until we reach Jannah."}
            </p>
            <div className="mt-6">
              <div className="font-bold text-kuswa-dark-blue">
                {lang === "bn" ? "— হাফেজ মাওলানা ছফিউল্লাহ" : "— Hafez Maulana Sofiullah"}
              </div>
              <div className="text-sm text-kuswa-orange font-semibold">
                {lang === "bn" ? "সভাপতি, কুশিয়ারা কল্যাণ সংসদ (কুশা)" : "President, Kushiara Welfare Association (KUSWA)"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
