// en.updated.ts
const en = {
  header: {
    nav: {
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
      progress: "Progress",
    },
    theme: {
      ariaToLight: "Switch to light mode",
      ariaToDark: "Switch to dark mode",
      titleLight: "Light mode",
      titleDark: "Dark mode",
      labelLight: "Light",
      labelDark: "Dark",
      mobileLight: "Light mode",
      mobileDark: "Dark mode",
    },
    lang: {
      label: "Language",
      nb: "NO",
      en: "EN",
      aria: "Switch language",
    },
    logoAlt: "Morning Coffee Labs",
    mobileMenu: {
      open: "Open menu",
      close: "Close menu",
    },
  },

  footer: {
    copyright: "Morning Coffee Labs",
    links: {
      termsPurchase: "Purchase terms",
      termsUse: "Terms of use",
      privacy: "Privacy policy",
      refund: "Refund",
    },
  },

  home: {
    hero: {
      title: "Simple tools for complex work",
      tagline:
        "Digital tools for structure, overview, and delivery – built for reality, not for demos.",
      sub:
        "Here we prioritize clear structure, predictable functionality, and tools that are easy to adopt, even as needs grow. Solutions made for daily use, under real constraints.",
    },

    sections: {
      building: "What we build",
      principles: "Principles",
      audience: "Who this fits for",
    },

    cards: {
      progress: {
        title: "Manage Progress",
        body:
          "Manage Progress is a user-friendly tool for planning and follow-up of projects. It is built to provide fast overview, clear structure, and control – without heavy setup, complex terminology, or unnecessary choices.",
        cta: "See Progress →",
        launchNote: "(launching February 1)",
        contactCta: "Questions? Get in touch →",
      },

      services: {
        title: "From challenge to solution",
        body:
          "We build tools that start from a real challenge, take shape as a clear idea, and end as a solution that works in practice. You can commission an app you own, or share an idea that can become an MCL product.",
        cta: "See services and idea bank →",
      },

      documentation: {
        title: "Structure and documentation",
        body:
          "Solutions that make it easy to follow up work, decisions, and changes, and retrieve it again when it actually matters.",
      },

      realWorld: {
        title: "Tools that hold up in reality",
        body:
          "Built for daily use under time pressure, change, and real constraints – not for perfect demo scenarios.",
      },
    },

    principles: {
      singleSource: {
        title: "One source of truth",
        body:
          "No duplicated logic, no hidden magic. What applies, applies – and can be explained, debugged, and trusted.",
      },
      predictability: {
        title: "Predictability over effects",
        body:
          "Progress is built with predictability as the priority. The same action should produce the same result, and the design should support the function – not distract from it.",
      },
      respect: {
        title: "Built with respect for the user’s time",
        body:
          "The goal of Progress is for the solution to feel predictable and calm. You shouldn’t have to spend time and energy on the tool – you should be able to focus on the work that needs to get done.",
      },
    },

    audience:
      "These are tools for people who work in a structured way with projects, follow-up, and execution, who want overview, control, and documentation – without the tool itself becoming a burden.",
  },

  about: {
    hero: {
      title: "About Morning Coffee Labs",
      tagline:
        "A small product workshop that builds digital work tools – with low threshold, high precision, and respect for how work is actually done.",
    },

    started: {
      title: "How this started",
      p1:
        "Morning Coffee Labs came from a fairly simple need: to create better flow and overview in work that is often complex and full of dependencies, where changes often happen along the way. We don’t believe that more “system” always gives more control. Often it’s the opposite: control comes from clear choices, predictability, and tools that don’t get in the way.",
      p2:
        "That’s why we’d rather build a few things properly than many things halfway. Like a workshop – not a factory.",
    },

    workshop: {
      title: "A workshop, not a factory",
      p1:
        "We build with the same mindset as good craft: it should withstand use, withstand time, and be easy to understand. The pace can be high, but the direction is stable: low threshold, high precision, and zero tolerance for noise.",
      p2:
        "When we add something, it should make the job easier – not just add more buttons.",
    },

    quality: {
      title: "Quality means control",
      p1:
        "For us, quality is more about control than perfection: control of data, flow, ownership, and consequence. The same action should produce the same result. What’s stored should be explainable. And what’s shown should be trustworthy.",
      p2:
        "We prioritize robustness over “smart” magic that works – until it doesn’t.",
    },

    principles: {
      title: "Our principles",
      lead:
        "We have a few simple principles that show up in everything we build. They are not “nice words” – they are working rules:",
      bullets: {
        singleSource: "One source of truth",
        singleSourceBody: "no duplicated logic, no hidden deviations.",
        predictability: "Predictability over effects",
        predictabilityBody:
          "design and engineering must align, otherwise it works poorly.",
        respect: "Respect for the user’s time and focus",
        respectBody:
          "anything that steals focus without adding value is removed.",
        realWork: "Built for real work",
        realWorkBody:
          "also when it needs to be printed, documented, and verified.",
      },
      outro: "The result should feel calm:",
      outroEm: "it works, and that’s enough.",
    },

    deliver: {
      title: "What we deliver",
      p1:
        "We build our own products – and we can also build solutions on commission. The common denominator is always the same: clear structure, low friction, and practical value.",
      linkLead: "Want to read more about how we work?",
      linkCta: "See working models →",
    },

    direction: {
      title: "Products and direction",
      p1:
        "The first product out is Manage Progress: a clean Gantt app with low threshold and high precision. Over time, more tools may come – but never at the expense of clarity, structure, and real usefulness.",
      linkLead: "See the product here:",
      linkCta: "Manage Progress →",
    },
  },

  contact: {
    title: "Contact",
    tagline:
      "For general inquiries, email or phone is the best way to reach us.",
    emailLabel: "Email:",
    phoneLabel: "Phone:",
  },

  services: {
    hero: {
      title: "Services",
      tagline:
        "From challenges to ideas – and onward to solutions that hold up in reality.",
      p1:
        "Morning Coffee Labs builds digital work tools with low threshold and high precision. Whether it’s commissioned development or the idea bank, the goal is the same: clear structure, predictable functionality, and solutions that hold up in real use over time.",
      p2:
        "We start with a problem that actually costs time, focus, or quality. Then we turn it into an idea that can be tested and built. Finally, we deliver a solution that is easy to adopt, easy to maintain, and clear in what it does.",
      back: "← Back to home",
      contact: "Get in touch →",
    },

    model1: {
      label: "Model 1",
      title: "Commissioned development",
      lead:
        "For companies that need a concrete tool – delivered as the customer’s property.",
      bullets: {
        b1Strong: "Need → delivery:",
        b1: "you describe goals, constraints, and the desired result",
        b2Strong: "Development:",
        b2: "delivered for an agreed payment and scope",
        b3Strong: "Ownership:",
        b3: "the solution is handed over and owned by the customer",
      },
      p1:
        "On handover, the solution becomes the customer’s property. A limited service period can be agreed, but responsibility for long-term operation and any further development will normally rest with the customer.",
      cta: "Get in touch about commissioned development →",
    },

    model2: {
      label: "Model 2",
      title: "Idea bank",
      lead:
        "For ideas that can become a new MCL product. Here, ownership and risk stay with MCL – and the product can later be offered as a licensed solution.",
      bullets: {
        b1Strong: "You share an idea:",
        b1: "problem, target group, and desired impact",
        b2Strong: "We evaluate:",
        b2: "practical value, low threshold, and product direction",
        b3Strong: "If the idea is built:",
        b3: "it’s developed as an MCL product and launched",
      },
      p1a:
        "The idea bank is not a commission and gives no guarantee of realization. But if the idea ends up as a launched MCL app, the idea giver receives as a thank you",
      p1bStrong: "lifetime access",
      p1c: "to the product (free subscription).",
      submitEmailCta: "Submit an idea →",
    },

    interesting: {
      title: "What makes an idea interesting",
      lead:
        "The best ideas have low threshold and high value: a concrete problem, a clear user group, and a result that can be documented.",
      bullets: {
        b1: "Describe today’s workflow and where the friction occurs",
        b2: "Describe what must become easier or safer",
        b3: "Describe who uses the tool – and in what situation",
        b4: "Describe what should be “enough” – and what isn’t needed",
      },
      exampleLead: "Want an example of an MCL product?",
      exampleCta: "See Progress →",
    },
  },

  progressPage: {
    hero: {
      tagline: "Progress planning without noise.",
      intro:
        "Manage Progress is a focused Gantt tool for project-based work. Developed for daily use under time pressure – and for situations where overview, predictability, and documentation truly matter.",
      badge: "Launching February 1",
      notifyCta: "Want a notification at launch? Get in touch →",
    },

    cards: {
      oneTruth: {
        title: "One plan, one truth",
        body:
          "The table is the source of truth. The Gantt view mirrors the exact same content. No hidden logic, no surprises.",
      },
      realProjects: {
        title: "Built for real projects",
        body:
          "Changes, dependencies, shifts, and replanning are handled without the structure collapsing. This is made for projects that actually live.",
      },
      print: {
        title: "Printing is a feature",
        body:
          "Print and export are not afterthoughts. Plans can be brought to meetings, added to documentation, and used further – with predictable results every time.",
      },
      lowFriction: {
        title: "Low threshold, high precision",
        body:
          "Get started quickly and keep the plan tidy. The focus is to provide structure and control – without the tool becoming a project in itself.",
      },
    },

    audience: {
      title: "Who this fits for",
      body:
        "Manage Progress fits project managers, technical environments, and teams who work project-based and need a plan that holds up under change, can be documented, and is easy to bring along to meetings and deliveries.",
    },

    next: {
      title: "Next",
      body:
        "Manage Progress is part of what over time will become Manage System – an ecosystem of small, independent tools that can also work together when the need arises.",
      back: "← Back to Morning Coffee Labs",
    },
  },

  legal: {
    terms: {
      title: "Terms of use",
      intro:
        "These terms of use govern how you may use services and apps delivered by Mathisens Morning Coffee Labs.",
      s1: {
        title: "1. License and use",
        body:
          "You receive a personal, non-transferable license to use the service in accordance with the selected license model. The license grants the right to normal internal use within your own business, but not resale or redistribution of the service.",
      },
      s2: {
        title: "2. Account and access",
        body:
          "Where the service requires login, you are responsible for keeping your login information secure and ensuring that unauthorized parties do not gain access. Misuse or suspected misuse must be reported to us as soon as possible.",
      },
      s3: {
        title: "3. Acceptable use",
        body:
          "The services must not be used in a way that violates applicable law, infringes others’ rights, or attempts to circumvent technical limitations and licensing mechanisms.",
      },
      s4: {
        title: "4. Availability and changes",
        body:
          "We strive for stable operation, but cannot guarantee 100% uptime. The services may be updated or changed over time, including to improve functionality or security.",
      },
      s5: {
        title: "5. Limitation of liability",
        body:
          "The services are provided “as is”. We are not liable for indirect losses, such as lost profit or downtime, to the extent permitted by applicable law.",
      },
      s6: {
        title: "6. Changes to these terms",
        body:
          "These terms may be updated as needed. Material changes will be announced through the website or via email. An updated version will always be available here.",
      },
    },

    privacy: {
      title: "Privacy policy",
      intro:
        "This privacy policy describes how Mathisens Morning Coffee Labs processes personal data in connection with our websites and digital services.",
      s1: {
        title: "1. Data controller",
        body:
          "Mathisens Morning Coffee Labs is the data controller for personal data collected through the website and the services.",
      },
      s2: {
        title: "2. What data we collect",
        lead: "Typical data we may process includes, for example:",
        bullets: [
          "Name and contact information (for example, email address)",
          "Billing information for purchases (primarily handled via Stripe)",
          "Text submitted via contact forms, the idea bank, or other forms",
          "Technical data about use of the service (for example, which pages are visited)",
        ],
      },
      s3: {
        title: "3. Purpose and legal basis",
        lead: "The information is used, among other things, to:",
        bullets: [
          "deliver and administer services and licenses",
          "handle purchases, payment, and customer service",
          "improve and further develop the services",
          "send relevant information if you have consented to this (newsletters, etc.).",
        ],
      },
      s4: {
        title: "4. Storage and deletion",
        body:
          "We store personal data as long as necessary for the purpose for which it was collected, or as long as required by accounting and bookkeeping rules. Data that is no longer necessary is deleted or anonymized.",
      },
      s5: {
        title: "5. Your rights",
        body:
          "You have the right to access, correct, and in some cases delete personal data we hold about you. You may also object to or request restriction of processing, and withdraw any consents you have given.",
      },
      s6: {
        title: "6. Third parties and processors",
        body:
          "We may use subcontractors (for example, Stripe for payment and hosting providers) to process data on our behalf. These are bound by data processing agreements and may not use the data for their own purposes.",
      },
      s7: {
        title: "7. Changes to this privacy policy",
        body:
          "This privacy policy may be updated as needed. An updated version will always be available on this page.",
      },
      s8: {
        title: "8. Contact",
        body:
          "If you have questions about privacy, you can contact us via the contact form on the website.",
      },
    },

    purchase: {
      title: "Purchase terms",
      intro:
        "These purchase terms apply to purchases of digital products from Mathisens Morning Coffee Labs (“we”, “us” or “the seller”).",
      s1: {
        title: "1. The parties",
        body:
          "The seller is Mathisens Morning Coffee Labs. The buyer is the person or business that completes the order in the online store or via our apps.",
      },
      s2: {
        title: "2. Product and license",
        body:
          "Our products are delivered as digital services and software. When purchasing, you receive a non-exclusive license to use the service according to the selected license model (for example monthly, yearly, or one-time license), and within the scope described in the product information.",
      },
      s3: {
        title: "3. Price and payment",
        body:
          "The prices shown in the online store apply at the time of ordering and are stated in NOK, and in some cases also as an indicative price in EUR. Payment is handled via Stripe. For subscriptions, the amount will be charged automatically at each renewal until the subscription is cancelled.",
      },
      s4: {
        title: "4. Delivery of digital content",
        body:
          "The license is normally activated immediately after payment is completed. By confirming the purchase, you consent to delivery starting before the withdrawal period has expired.",
      },
      s5: {
        title: "5. Right of withdrawal and cancellation",
        body:
          "For digital services delivered immediately, the right of withdrawal lapses when you have consented to delivery starting before the withdrawal period expires. A subscription can be cancelled at any time and will then run until the end of the current paid period.",
      },
      s6: {
        title: "6. Complaints",
        body:
          "If the service does not work as described, you can contact us via the contact page on the website. We will then try to fix the issue, provide guidance, or offer another reasonable solution.",
      },
      s7: {
        title: "7. Changes to these terms",
        body:
          "We may update these terms as needed. For material changes, we will inform via the website or email. An updated version will always be available on this page.",
      },
      s8: {
        title: "8. Contact information",
        body:
          "Questions about purchases or licenses can be directed via the contact page on the website.",
      },
    },

    refund: {
      title: "Refund and complaints",
      intro:
        "Here we describe how we handle refunds, cancelled purchases, and complaints for digital licenses.",
      s1: {
        title: "1. Digital goods and right of withdrawal",
        p1:
          "Our licenses are delivered digitally and are activated immediately after payment is completed. Under the Norwegian Right of Withdrawal Act (Angrerettloven) §22 n and the EU Digital Content Directive, the right of withdrawal lapses when:",
        bullets: [
          "you request immediate delivery, and",
          "you confirm that the right of withdrawal lapses when the license is delivered and activated.",
        ],
        p2: "This consent is given in the purchase flow before payment.",
      },
      s2: {
        title: "2. Refund in case of technical issues",
        p1:
          "If you have paid but do not get access to the license or PRO features due to a technical error on our side, we will:",
        bullets: [
          "attempt to fix the issue and activate the license as quickly as possible",
          "consider a refund or extension of the license period if the issue cannot be resolved within a reasonable time",
        ],
      },
      s3: {
        title: "3. Subscription cancellation",
        body:
          "With a subscription, you can stop further renewals at any time via Stripe or by contacting us. Periods already charged are normally not refunded, but you keep access through the current period.",
      },
      s4: {
        title: "4. Incorrect charge",
        body:
          "If you believe you were charged incorrectly, please contact us as soon as possible, and no later than 30 days after you discovered the error. We will review the transaction together with you and Stripe.",
      },
      s5: {
        title: "5. How to contact us",
        lead: "Send an email to",
        bodyAfterEmail: "with:",
        bullets: [
          "name and email address",
          "which product the license applies to",
          "date of purchase and (if available) the Stripe receipt",
          "a short description of the issue",
        ],
      },
    },
  },

  paywall: {
    common: {
      close: "Close",
    },

    trial: {
      title: "Try Full version free for 10 days",
      body: "Enter email and password to start the trial.",
      cta: "Start trial",
      success:
        "Trial started. You can now use Full version features for 10 days.",
    },

    buy: {
      title: "Buy a Full version license",
      body: "Fill in the information once, choose license type, and go to payment.",

      licenseTypeTitle: "License type",
      purchase: {
        subscription: "Subscription",
        oneTime: "One-time purchase",
      },

      billingTitle: "With billing:",
      billing: {
        month: "Monthly",
        year: "Yearly",
      },

      durationTitle: "Duration",
      duration: {
        oneMonth: "1 month",
        oneYear: "1 year",
      },

      ctaCheckout: "Proceed to payment",
    },

    buyer: {
      company: "Company",
      private: "Private",
    },

    fields: {
      emailLabel: "Email address",
      emailPlaceholder: "name@company.com",

      passwordLabel: "Password",
      passwordPlaceholder: "At least 6 characters",

      orgNameLabel: "Company name",
      orgNamePlaceholder: "Company Ltd",

      orgNrLabel: "Org. no.",
      orgNrPlaceholder: "9 digits",

      contactNameLabel: "Contact person",
      contactNamePlaceholder: "Jane Doe",

      phoneLabel: "Phone",
      phonePlaceholder: "+47 ...",

      fullNameLabel: "Name",
      fullNamePlaceholder: "Jane Doe",

      countryLabel: "Country",
      countryPlaceholder: "Norway",
    },

    validation: {
      invalidEmail: "Enter a valid email address.",
      invalidPassword: "Password must be at least 6 characters.",
    },

    calc: {
      price: "Price",
      vat: "VAT",
      total: "Price",
      perMonth: "NOK/mo",
      perYear: "NOK/yr",
    },
    vatNotice:
      "Sales are currently exempt from VAT. Once the registration threshold is reached, 25% VAT will be added in accordance with Norwegian regulations.",


    errors: {
      missingRequired: "Fill in all required fields.",
      invalidOrgNr: "Org. no. doesn’t look right (9 digits).",
      network: "Something went wrong. Check that the Worker endpoints are correct.",
      wrongEndpoint:
        "It looks like the checkout call is hitting the wrong address (not the Worker). Check VITE_PROGRESS_WORKER_BASE_URL.",
      noCheckoutUrl: "Worker returned no checkout url (expected { url }).",
    },
  },

  checkout: {
    titleSuccess: "Purchase completed 🎉",
    titleCanceled: "Purchase cancelled",
    titleDefault: "Status",

    bodySuccess:
      "You are now upgraded to Pro. If the status doesn’t update immediately, refresh the app.",
    bodyCanceled: "The purchase was cancelled. You can try again anytime.",
    bodyDefault:
      "No status found in the link. Go back to pricing and try again.",

    primaryOpenProgress: "Open Progress",
    primaryToPricing: "To pricing",

    secondaryTryAgain: "Try again",
    secondarySeePricing: "See pricing",
  },

  progressOverview: {
    title: "How Progress works",
    lead:
      "Here’s the short explanation – with screenshots. Progress is built to make progress visible, understandable, and easy to adjust along the way.",
    tryFreeCta: "Try Progress for free",
    closeLabel: "Close",
    imageViewerLabel: "Image viewer",
    screenshotLabel: "Screenshot",
    missingTitle: "Missing image",
    missingBodyPrefix: "Place the file in",
    pairs: [
      {
        factTitle: "The table is the source of truth",
        factBody:
          "You enter activity, dates, and information in the table. The Gantt view shows the exact same rows – as time blocks. That means fewer surprises and less manual work.",
        imgAlt: "Screenshot: Plan in table and Gantt",
        imgCaption: "Table and Gantt match – same rows, same plan.",
      },
      {
        factTitle: "A visual plan that’s easy to read",
        factBody:
          "You get a plan that’s easy to present to others, and easy to understand for yourself. The goal is calm and overview – not more administration.",
        imgAlt: "Screenshot: Overview and readability",
        imgCaption: "Readability first: a calm layout that’s easy to share.",
      },
      {
        factTitle: "Fast to change when reality changes",
        factBody:
          "Plans are never perfect. What matters is that it’s quick to update and adjust, without having to redesign everything from scratch.",
        imgAlt: "Screenshot: Print / sharing",
        imgCaption: "Built for sharing and printing without becoming messy.",
      },
      {
        factTitle: "Built for printing and sharing",
        factBody:
          "A plan often has a recipient. Progress is built so you can show, share, and print without losing readability.",
        imgAlt: "Screenshot: Details and flow",
        imgCaption: "Details when you need them without losing the flow.",
      },
    ],
  },

  progressHero: {
    title: "Progress planning that creates calm",
    tagline:
      "A good progress plan is not a necessary evil. It is a tool for creating overview, predictability, and progress – so stress doesn’t take over.",
    lead1:
      "When several tasks depend on each other, time is limited, and people and tasks rely on one another, the same need appears: to see the whole and understand the sequence.",
    lead2:
      "A progress plan makes the workload concrete. It reveals dependencies, clarifies what must happen first, what can be done in parallel, and what can or must wait.",
    lead3:
      "Used correctly, the plan becomes a management tool: you see consequences before you make decisions, and you can adjust along the way without losing control.",
    articles: {
      lead:
        "Want to read a bit more before you continue? Here are two short articles that explain what a progress plan is and how you use it effectively:",
      ctaWhat: "What is a progress plan? →",
      ctaHow: "How to use the plan effectively →",
    },
  },

  progressSell: {
    title: "From insight to practice",
    lead:
      "Once you have a plan, the key is keeping it alive: adjusting when reality changes, seeing consequences quickly, and sharing status clearly. Manage Progress is built for exactly this, without noise – without heavy setup.",
    ctaOverview: "Read more about Progress",
    ctaApp: "Open Progress",
    ctaPrices: "See pricing and license",
  },

  progress: {
    hero: {
      tagline: "Progress planning without noise.",
      lead1:
        "Progress is a simple tool for planning what actually needs to get done, without unnecessary features, complicated setup, or buzzwords.",
      lead2:
        "A progress plan is about overview, prioritization, and getting to the finish line. Planning has always been a natural part of how people perform work – long before there were methods, tools, and terminology for project management, work was planned and mental progress plans were created.",
      lead3:
        "When something is to be built, learned, or carried out over time, the same need appears again and again: to see the whole, see sub-tasks, understand the sequence, and know when something is actually finished.",
      lead4:
        "Progress is built to support this need in practice – whether it’s a project, a semester, a sales effort, or a private plan.",
    },

    why: {
      title: "What does a progress plan actually give you?",
      lead:
        "Many know they should plan. Fewer know what they actually get in return.",
      bullets: [
        { title: "Overview", body: "What needs to be done? And in what order?" },
        { title: "Predictability", body: "What happens now, and what comes later?" },
        { title: "Prioritization", body: "What matters, and what can wait?" },
        { title: "Progress", body: "A clear feeling of moving forward." },
        { title: "Decision support", body: "You see consequences before you choose." },
      ],
      close:
        "Progress helps you get this in place in practice by making progress visible, understandable, and easy to adjust along the way.\n\nThe same need shows up in many different situations. Below are some typical examples.",
    },

    tiles: [
      {
        title: "Project managers",
        body:
          "When multiple activities depend on each other, and you need to see sequence, milestones, and deadlines, and be able to adjust without everything falling apart.",
      },
      {
        title: "Sales representatives",
        body:
          "When an offer has many sub-runs: gathering input, follow-up, clarifications, and internal deadlines, and you need overview of what’s urgent now and what’s waiting.",
      },
      {
        title: "Teachers",
        body:
          "When teaching, periods, and deliveries must fit together over time, and you want to be able to move things without losing overview.",
      },
      {
        title: "Pupils and students",
        body:
          "When you have multiple tasks and deadlines at the same time, and you need a plan that makes the workload manageable week by week.",
      },
      {
        title: "Travelers",
        body:
          "When a trip consists of a timeline with transport, stays, and activities, and you want to see the whole and avoid “holes” in the plan.",
      },
      {
        title: "Private individuals",
        body:
          "When something needs to be carried out in several steps – renovations, moving, or an event – and you want to see what comes first and what must be finished at the end.",
      },
    ],

    tilesNote:
      "If it needs planning, Progress fits.\nNo matter the role, it’s the same thing: seeing the sequence, keeping deadlines, and making progress visible.",

    see: {
      title: "Do you want to see how Progress actually works?",
      lead: "Progress is best when you see it in use.",
    },

    cta: {
      moreBtn: "Read more about Progress",
      appBtn: "Open Progress",
      pricesBtn: "See pricing and license",
    },

    readMore: {
      title: "Read more",
      lead:
        "Here are two short articles that explain what a progress plan is, and how you use it effectively in practice:",
      ctaWhat: "What is a progress plan? →",
      ctaHow: "How to use the plan effectively →",
    },
  },

  progressPricing: {
    title: "Pricing and license",
    lead: "Choose the level that fits. Start free and upgrade anytime.",

    openApp: "Open Progress",

    banner: {
      successMsg:
        "✅ Payment registered. Open the app – status updates automatically (sometimes after a refresh).",
      canceledMsg: "↩️ The purchase was cancelled. You are not upgraded.",
      dismissAria: "Dismiss message",
      tryAgain: "Try again",
    },

    free: {
      title: "Free version",
      lead:
        "Start without friction. The free version requires no registration – you can open Progress and start planning immediately.",

      whatTitle: "What you get in the free version",
      what: [
        "Local storage, limited to one project at a time",
        "Print / PDF export with watermark",
        "Import projects exported from Full version users",
      ],

      trial: {
        title: "Try Full version free for 10 days",
        body:
          "You can test full functionality for 10 days completely free. The only thing you need to do is register.",
        cta: "Start trial →",
      },
    },

    pro: {
      title: "Full version",
      lead:
        "For you who use Progress regularly, especially if you work in multiple projects at the same time and want full flow with cloud storage and export.",

      whatTitle: "What you get in the full version",
      what: [
        "Everything in the free version",
        "Cloud storage of multiple projects",
        "Print / PDF without watermark",
        "Export projects (save locally wherever you want) – open later or share with others",
        "Export to .TSV",
        "License for professional use",
      ],

      priceHeader: "Price",
      priceLine: "{{month}} NOK/mo or {{year}} NOK/yr",
      introNote:
        "Introductory price for early users. This price is kept as long as the license is active.",
      vatNotice:
        "Sales are currently exempt from VAT. Once the registration threshold is reached, 25% VAT will be added in accordance with Norwegian regulations.",


      buyCta: "Buy a Full version license",
    },

    footerNote:
      "Progress is developed continuously. New features may over time form the basis for an expanded selection of licenses. The Full version will under no circumstances lose functionality.",
  },

  progressArticles: {
    fremdriftsplan: {
      meta: {
        title:
          "What is a progress plan and why is it one of the most important tools you can learn?",
        description:
          "Learn what a progress plan is, why it provides control and predictability, and how it goes from a static plan to a living management tool.",
      },
      hero: {
        tagline:
          "If you’ve ever been part of a project that started with good intentions, but ended in stress, misunderstandings, and delays, chances are the progress plan either was missing – or wasn’t used as intended. Far too often, progress plans are created for the archive, not for everyday work, because people don’t understand their value or how they’re actually meant to be used in practice.",
      },
      cta: {
        back: "← Back to Progress",
        openApp: "Open the Progress app",
        next: "Next: Use the plan effectively →",
      },
      sections: {
        what: {
          title: "What is a progress plan?",
          body:
            "A progress plan is, in its simplest form, an overview that shows what needs to be done, in what order, and when. But in practice it is far more than a timeline. Used correctly, the progress plan is one of the most powerful tools we have to create structure, predictability, and control – regardless of domain.",
        },
        why: {
          title: "Why do we need progress plans?",
          p1:
            "A project – whether it’s building a school, developing software, planning a school year, or rehabilitation after injury – always consists of many tasks that are time-limited, with limited resources, and both people and tasks that depend on each other.",
          lead: "Without a progress plan, the same thing often happens:",
          bullets: [
            "Tasks are done in the wrong order",
            "Important activities are forgotten",
            "Deadlines are set without a holistic assessment",
            "No one has the full overview",
          ],
          close:
            "A progress plan forces us to think through the project before we start. It makes it possible to ask the right questions early enough that it’s still easy to adjust if the answers don’t match expectations.",
        },
        static: {
          title: "The planning tool (the static phase)",
          p1:
            "In many projects, the progress plan starts as a static planning tool. This phase is often underestimated, but it is crucial for a good end result.",
          lead: "Here, the plan is used to:",
          bullets: [
            "break the project down into concrete tasks",
            "consider sequence and dependencies",
            "estimate time",
            "plan staffing and resources",
          ],
          p2:
            "That is why progress plans are often used as attachments in offers and tenders, as decision support for management and owners, and as a shared reference in early planning.",
          p3:
            "It is completely normal – and completely right – that the plan in this phase is shared as a static PDF document. It then works as a fixed snapshot of how the project is intended to be executed, given today’s assumptions.",
        },
        reality: {
          title: "When the plan meets reality",
          p1:
            "All projects are living. When execution starts, reality shows up: deliveries are delayed, resources change, new tasks appear, something takes less time than assumed, and something else takes longer.",
          p2: "Then the progress plan moves into its next role: a living management tool.",
        },
        living: {
          title: "The living management tool",
          p1:
            "A living progress plan is used to adjust timelines when something changes, see consequences before decisions are made, communicate status and expectations, and make better decisions along the way.",
          lead: "Instead of creating stress, the plan gives safety:",
          p2: "You see what is affected – and what isn’t.",
        },
        who: {
          title: "Who benefits from progress plans?",
          p1:
            "A common misunderstanding is that progress plans are only for project managers. In reality, they are needed at many levels and across many domains.",
          build: {
            title: "Construction, industry, and project work",
            bullets: [
              "Coordination of activities",
              "Planning sequence and staffing",
              "Predictable progress",
            ],
          },
          it: {
            title: "IT and development",
            bullets: [
              "Sprint planning",
              "Deliveries and milestones",
              "Dependencies between tasks",
            ],
          },
          school: {
            title: "Schools and education",
            body:
              "Progress plans are used here at multiple levels: owners and administration plan the school year, teachers structure teaching, and pupils/students plan semesters, assignments, and exams.",
          },
          health: {
            title: "Health and rehabilitation",
            body:
              "Progress over time is central: training, rehabilitation programs, and collaboration. A progress plan provides structure and clear intermediate goals – often crucial for motivation and mastery.",
          },
          personal: {
            title: "Private and alternative use cases",
            bullets: [
              "Moving",
              "Renovation",
              "Events",
              "Personal goals and life planning",
            ],
          },
        },
        gain: {
          title: "What do you stand to gain?",
          bullets: [
            "better control",
            "fewer surprises",
            "clearer communication",
            "less stress",
            "higher chance of success",
          ],
          close:
            "And perhaps most importantly: you go from reacting to problems to anticipating them – and it changes the entire dynamic of the project.",
        },
        practice: {
          title: "From theory to practice",
          p1:
            "Want to try this in practice? Today, there are simple digital tools that let you create, adjust, and use progress plans without unnecessary complexity.",
          p2:
            "Progress is one of them – built to be easy to start using, whether the plan is static or living.",
          ctaTry: "Try Progress for free",
          ctaPrices: "See pricing",
        },
      },
    },

    bruk: {
      meta: {
        title:
          "How to use a progress plan effectively and what you actually stand to gain from it",
        description:
          "Practical guide: break down the project, clarify dependencies, set realistic estimates, and use the plan actively as a management and communication tool.",
      },
      hero: {
        tagline:
          "Creating a progress plan is one thing. Using it correctly is something else entirely.",
      },
      cta: {
        back: "← Back: What is a progress plan?",
        openApp: "Open the Progress app",
        prices: "See pricing",
      },
      sections: {
        step1: {
          title: "First step: Understand what the project actually consists of",
          p1:
            "The first – and perhaps most important – step in all progress planning is breaking the project down into main and sub tasks. Large projects rarely fail because one task is difficult. They fail because tasks are defined too broadly, relationships aren’t clear, and no one sees the whole picture.",
          lead: "A good plan starts with the question:",
          quote: "What actually needs to be done for the project to be finished?",
          bullets: [
            "break the project into manageable tasks",
            "define milestones",
            "separate main tasks from sub tasks",
          ],
        },
        deps: {
          title: "Sequence and dependencies; the core of good planning",
          p1:
            "Some tasks can be done in parallel. Others must wait until something else is finished. These are dependencies, and this is where many plans become too optimistic.",
          bullets: [
            "map what must happen before something else",
            "identify critical tasks",
            "understand which delays actually have consequences",
          ],
          close:
            "You go from hope-based planning to realistic planning.",
        },
        estimates: {
          title: "Time estimates: From gut feeling to structure",
          p1:
            "No one expects perfect estimates. But they should be thought through. When time is put into a plan, assumptions become visible, disagreements surface early, and risk can be discussed before it occurs.",
          p2:
            "The progress plan forces us to be honest: Is this realistic – or just wishful thinking?",
        },
        static: {
          title: "The static plan – the foundation",
          p1:
            "At the start, the plan is often used as a static document. This is both right and necessary. It is used as decision support, in offers/tenders, for resource assessment, and communication with stakeholders.",
          p2:
            "A well-prepared static plan provides confidence: “We know what we are going to do – and why.”",
        },
        execution: {
          title: "When execution starts: Use the plan actively",
          p1:
            "When a project moves from planning to execution, it’s about what actually happens – and what the consequences are. Good project leaders use the plan to adjust along the way, assess consequences before decisions are made, and communicate changes clearly.",
          bullets: [
            "adjust along the way",
            "assess consequences before decisions are made",
            "communicate changes clearly",
          ],
        },
        comms: {
          title: "The progress plan as a communication tool",
          p1:
            "A good plan creates shared understanding, reduces misunderstandings, and makes expectations clear. When everyone sees the same progress plan, collaboration becomes easier and the level of conflict drops.",
          p2:
            "Projects that have a plan but don’t use it often end up in ad hoc changes and firefighting. Ironically, that is exactly when people say: “We don’t have time to update the plan.”",
        },
        payoff: {
          title: "The payoff",
          p1:
            "When progress plans are used correctly – from planning to execution – projects become more predictable, changes are handled calmly, decisions are made based on overview, stress is reduced, and quality increases. You get enough control to steer the project, instead of being steered by it.",
        },
      },
      bottomCtas: {
        try: "Try Progress for free",
        screens: "See screenshots",
        back: "Back to Progress",
      },
    },
  },
} as const;

export default en;
