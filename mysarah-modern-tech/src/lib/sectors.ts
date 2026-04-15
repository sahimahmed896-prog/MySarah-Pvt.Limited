export interface Sector {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  active: boolean;
  heroImage: string;
  category:
    | "core-services"
    | "business-industry"
    | "lifestyle-public-services"
    | "technology-innovation"
    | "agriculture";
}

export const sectors: Sector[] = [
  {
    slug: "solar",
    title: "Solar Installation",
    subtitle: "Clean energy for Assam homes and businesses",
    description:
      "End-to-end solar EPC solutions for residential rooftops, commercial campuses, and industrial facilities.",
    active: true,
    heroImage: "/images/solarTransition.png",
    category: "core-services",
  },
  {
    slug: "electrical-services",
    title: "Electrical Services",
    subtitle: "Reliable power systems and field execution",
    description: "Commercial, residential, and industrial electrical installation and maintenance services.",
    active: false,
    heroImage: "/images/electrical-services.jpeg",
    category: "core-services",
  },
  {
    slug: "construction",
    title: "Construction",
    subtitle: "Structured project execution for modern infrastructure",
    description: "End-to-end construction delivery across residential, commercial, and industrial requirements.",
    active: false,
    heroImage: "/images/construction-workers.jpg",
    category: "core-services",
  },
  {
    slug: "event-management",
    title: "Event Management",
    subtitle: "Professional planning and operational control",
    description: "Corporate and public event management with complete planning, coordination, and on-ground execution.",
    active: false,
    heroImage: "/images/home.png",
    category: "lifestyle-public-services",
  },
  {
    slug: "agriculture",
    title: "Agriculture",
    subtitle: "Technology-backed farm growth programs",
    description: "Agriculture initiatives focused on productivity, supply quality, and sustainable field operations.",
    active: false,
    heroImage: "/images/home.png",
    category: "agriculture",
  },
  {
    slug: "education",
    title: "Education",
    subtitle: "Skill and knowledge ecosystem development",
    description: "Education and training programs designed to build future-ready talent and local opportunity.",
    active: false,
    heroImage: "/images/home.png",
    category: "lifestyle-public-services",
  },
  {
    slug: "sports",
    title: "Sports",
    subtitle: "Grassroots to organized performance initiatives",
    description: "Sports programs and event initiatives that support participation, training, and community engagement.",
    active: false,
    heroImage: "/images/home.png",
    category: "lifestyle-public-services",
  },
  {
    slug: "tourism",
    title: "Tourism",
    subtitle: "Destination development and travel services",
    description: "Tourism services and destination-focused initiatives to support local and regional economic growth.",
    active: false,
    heroImage: "/images/home.png",
    category: "lifestyle-public-services",
  },
  {
    slug: "health",
    title: "Health",
    subtitle: "Accessible wellness and healthcare support",
    description: "Health sector initiatives oriented toward service accessibility, awareness, and coordinated care delivery.",
    active: false,
    heroImage: "/images/home.png",
    category: "lifestyle-public-services",
  },
  {
    slug: "entertainment",
    title: "Entertainment",
    subtitle: "Experiences, media, and audience engagement",
    description: "Entertainment business initiatives for events, content collaborations, and public engagement platforms.",
    active: false,
    heroImage: "/images/home.png",
    category: "lifestyle-public-services",
  },
  {
    slug: "export-import",
    title: "Export Import",
    subtitle: "Cross-border trade operations",
    description: "Export and import services with process coordination, compliance awareness, and supply-chain support.",
    active: false,
    heroImage: "/images/home.png",
    category: "business-industry",
  },
  {
    slug: "manufacture",
    title: "Manufacture",
    subtitle: "Scalable production and operations",
    description: "Manufacturing-focused initiatives for process discipline, quality output, and growth-oriented production.",
    active: false,
    heroImage: "/images/hero-grid.svg",
    category: "business-industry",
  },
  {
    slug: "purchases-and-sales",
    title: "Purchases and Sales",
    subtitle: "Procurement and distribution channels",
    description: "Integrated purchase and sales operations to support reliable sourcing and customer-side delivery.",
    active: false,
    heroImage: "/images/home.png",
    category: "business-industry",
  },
  {
    slug: "contract-field",
    title: "Contract Field",
    subtitle: "Project contracts and field execution",
    description: "Contract-based execution services covering manpower coordination, timelines, and field delivery quality.",
    active: false,
    heroImage: "/images/hero-grid.svg",
    category: "business-industry",
  },
  {
    slug: "it-field",
    title: "IT Field",
    subtitle: "Digital platforms and technology services",
    description: "IT services spanning software systems, digital operations, and business process enablement.",
    active: false,
    heroImage: "/images/hero-ev.svg",
    category: "technology-innovation",
  },
  {
    slug: "ai",
    title: "AI",
    subtitle: "Intelligent systems for future operations",
    description: "AI initiatives focused on automation, insight generation, and high-efficiency decision support.",
    active: false,
    heroImage: "/images/hero-grid.svg",
    category: "technology-innovation",
  },
];

export const getSectorBySlug = (slug: string) => sectors.find((sector) => sector.slug === slug);
