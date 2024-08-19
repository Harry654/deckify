"use client";
import { useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";
import { TPlan } from "@/types/plan";
import { useRouter } from "next/navigation";
import getStripe from "@/utils/get-stripe";
import { useAuth } from "@/context/AuthContext";
import { Slide } from "react-awesome-reveal";

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const pricingPlans: TPlan[] = [
    {
      id: "basic",
      title: "Basic Plan",
      monthly_price: 10,
      yearly_price: 120,
      description:
        "Get started with the essentials. Our Basic Plan provides you with everything you need to begin your learning journey.",
      features: [
        "Create up to 1,000 flashcards",
        "Access to basic templates",
        "Study on 1 device",
        "Basic progress tracking",
        "Limited to 3 shared decks",
      ],
    },
    {
      id: "standard",
      title: "Standard Plan",
      monthly_price: 20,
      yearly_price: 240,
      description:
        "Upgrade your learning experience with the Standard Plan. Enjoy additional features like advanced progress tracking, adaptive quizzes, and access to a broader range of study materials.",
      features: [
        "Create up to 5,000 flashcards",
        "Access to all templates",
        "Sync across 3 devices",
        "Advanced progress tracking",
        "Unlimited shared decks",
        // "Export decks as PDFs",
      ],
    },
    {
      id: "premium",
      title: "Premium Plan",
      monthly_price: 30,
      yearly_price: 360,
      description:
        "Unlock the full potential of your learning with the Premium Plan. Gain exclusive access to all features, including real-time collaboration, AI-powered recommendations, and priority support.",
      features: [
        "Unlimited flashcards",
        // "Custom templates and themes",
        "Sync across unlimited devices",
        // "Detailed analytics and insights",
        "Collaboration on shared decks",
        "Priority customer support",
        "Offline access to decks",
      ],
    },
  ];

  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (plan: TPlan) => {
    if (!isSignedIn) return router.push("/sign-in");

    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        origin: process.env.NEXT_PUBLIC_HOST_ORIGIN || "",
      },
      body: JSON.stringify({
        product_id: plan.id,
        product_name: plan.title,
        product_price: isMonthly ? plan.monthly_price : plan.yearly_price,
      }),
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Simple and Affordable Pricing"
          paragraph="Choose a plan that fits your learning needs. Our transparent pricing offers flexibility without compromising on features."
          center
          width="665px"
        />

        <div className="w-full">
          <div className="mb-8 flex justify-center md:mb-12 lg:mb-16">
            <span
              onClick={() => setIsMonthly(true)}
              className={`${
                isMonthly
                  ? "pointer-events-none text-primary"
                  : "text-dark dark:text-white"
              } mr-4 cursor-pointer text-base font-semibold`}
            >
              Monthly
            </span>
            <div
              onClick={() => setIsMonthly(!isMonthly)}
              className="flex cursor-pointer items-center"
            >
              <div className="relative">
                <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                <div
                  className={`${
                    isMonthly ? "" : "translate-x-full"
                  } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                >
                  <span className="active h-4 w-4 rounded-full bg-white"></span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsMonthly(false)}
              className={`${
                isMonthly
                  ? "text-dark dark:text-white"
                  : "pointer-events-none text-primary"
              } ml-4 cursor-pointer text-base font-semibold`}
            >
              Yearly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan: TPlan, index) => (
            <Slide
              key={index}
              direction="left"
              delay={index * 100}
              triggerOnce={true}
            >
              <PricingBox
                isMonthly={isMonthly}
                plan={plan}
                handleSubmit={handleSubmit}
              >
                {plan.features.map((feature, index) => (
                  <OfferList key={index} text={feature} status="active" />
                ))}
              </PricingBox>
            </Slide>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
