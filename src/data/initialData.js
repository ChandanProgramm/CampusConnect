export const INITIAL_USER_PROFILE = {
  name: "Vivek Kumar",
  email: "vivek.kumar@campus.edu",
  role: "Full Stack Developer",
  college: "KIIT University",
  bio: "Full Stack Developer passionate about building modern applications and collaborating with student teams.",
  initialConnectionsCount: 128,
  projectsCount: 8,
  skills: [
    "React",
    "Node.js",
    "Python",
    "MySQL",
    "JavaScript",
    "Git",
    "MongoDB",
    "Tailwind",
    "REST APIs",
    "Docker",
    "TypeScript",
    "Figma"
  ],
  myProjects: [
    {
      id: 1,
      title: "Smart Campus Attendance",
      description: "AI-powered facial recognition & geo-fenced student attendance tracker.",
      techStack: ["React", "Node.js", "MySQL", "Python"],
      status: "Active"
    },
    {
      id: 2,
      title: "Campus Connect App",
      description: "Mobile-first platform for student collaboration and hackathon team building.",
      techStack: ["React", "JavaScript", "Tailwind", "Firebase"],
      status: "Active"
    },
    {
      id: 5,
      title: "Alumni Mentorship Portal",
      description: "Direct bridge between students and graduated alumni for career mentoring.",
      techStack: ["React", "Node.js", "PostgreSQL"],
      status: "Completed"
    }
  ]
};

export const INITIAL_PEOPLE = [
  {
    id: "arjun-patel",
    name: "Arjun Patel",
    initials: "AP",
    role: "Frontend Developer",
    college: "KIIT University",
    category: "Developers",
    skills: ["React", "JavaScript", "Tailwind"],
    avatarBg: "#E0E7FF",
    avatarColor: "#3730A3",
    connected: false
  },
  {
    id: "sneha-sharma",
    name: "Sneha Sharma",
    initials: "SS",
    role: "UI/UX Designer",
    college: "NIT Rourkela",
    category: "Designers",
    skills: ["Figma", "Adobe XD", "UI Design"],
    avatarBg: "#FCE7F3",
    avatarColor: "#9D174D",
    connected: false
  },
  {
    id: "rohan-verma",
    name: "Rohan Verma",
    initials: "RV",
    role: "Backend Developer",
    college: "IIIT Bhubaneswar",
    category: "Developers",
    skills: ["Node.js", "Python", "MySQL"],
    avatarBg: "#FEF3C7",
    avatarColor: "#92400E",
    connected: false
  },
  {
    id: "kavya-singh",
    name: "Kavya Singh",
    initials: "KS",
    role: "Content Writer",
    college: "Delhi University",
    category: "Marketing",
    skills: ["Writing", "SEO", "Research"],
    avatarBg: "#EDE9FE",
    avatarColor: "#5B21B6",
    connected: false
  },
  {
    id: "aditya-raj",
    name: "Aditya Raj",
    initials: "AR",
    role: "Mobile App Developer",
    college: "VIT Vellore",
    category: "Developers",
    skills: ["Flutter", "Dart", "Firebase"],
    avatarBg: "#DCFCE7",
    avatarColor: "#166534",
    connected: false
  },
  {
    id: "neha-gupta",
    name: "Neha Gupta",
    initials: "NG",
    role: "Data Scientist",
    college: "BITS Pilani",
    category: "Developers",
    skills: ["Python", "Machine Learning", "Pandas"],
    avatarBg: "#DBEAFE",
    avatarColor: "#1E40AF",
    connected: false
  },
  {
    id: "rahul-mehta",
    name: "Rahul Mehta",
    initials: "RM",
    role: "Marketing Specialist",
    college: "Delhi University",
    category: "Marketing",
    skills: ["Marketing", "SEO", "Content"],
    avatarBg: "#FEE2E2",
    avatarColor: "#991B1B",
    connected: false
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    initials: "PS",
    role: "UI/UX Designer",
    college: "NID Ahmedabad",
    category: "Designers",
    skills: ["Figma", "UI Design", "Research"],
    avatarBg: "#F3E8FF",
    avatarColor: "#6B21A8",
    connected: false
  },
  {
    id: "ananya-patel",
    name: "Ananya Patel",
    initials: "AP2",
    role: "Python Developer",
    college: "IIT Bombay",
    category: "Developers",
    skills: ["Python", "Django", "PostgreSQL"],
    avatarBg: "#E0F2FE",
    avatarColor: "#0369A1",
    connected: false
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "Smart Attendance System",
    description: "AI-driven facial verification & geo-fenced campus attendance system with seamless instructor reporting.",
    about: "Smart Attendance System replaces outdated manual attendance with instantaneous camera-based facial recognition and geo-verification. Built for university classrooms and multi-campus colleges, saving over 15 minutes per lecture.",
    status: "Active",
    techStack: ["React", "Node.js", "MySQL", "Python"],
    membersCount: 4,
    ownership: "My Projects",
    lead: {
      name: "Vivek Kumar",
      initials: "VK",
      role: "Lead",
      college: "KIIT University"
    },
    members: [
      { name: "Vivek Kumar", initials: "VK", role: "Project Lead", college: "KIIT University" },
      { name: "Arjun Patel", initials: "AP", role: "Frontend Lead", college: "KIIT University" },
      { name: "Rohan Verma", initials: "RV", role: "Backend Engineer", college: "IIIT Bhubaneswar" },
      { name: "Sneha Sharma", initials: "SS", role: "UI/UX Designer", college: "NIT Rourkela" }
    ],
    requested: false,
    chatId: "smart-attendance"
  },
  {
    id: 2,
    title: "CampusConnect App",
    description: "The premier student networking and project matchmaking platform built specifically for university innovators.",
    about: "A dedicated mobile ecosystem that allows undergraduate and graduate students to find collaborators, launch hackathon ideas, and showcase their technical and creative portfolios directly to campus recruiters.",
    status: "Active",
    techStack: ["React", "JavaScript", "Tailwind", "Node.js"],
    membersCount: 3,
    ownership: "Joined",
    lead: {
      name: "Sneha Sharma",
      initials: "SS",
      role: "Lead",
      college: "NIT Rourkela"
    },
    members: [
      { name: "Sneha Sharma", initials: "SS", role: "Lead & Design", college: "NIT Rourkela" },
      { name: "Vivek Kumar", initials: "VK", role: "Full Stack Dev", college: "KIIT University" },
      { name: "Kavya Singh", initials: "KS", role: "Growth & Marketing", college: "Delhi University" }
    ],
    requested: false,
    chatId: "project-discussion"
  },
  {
    id: 3,
    title: "EcoTrack Campus",
    description: "IoT and telemetry initiative tracking solar energy yield and food waste reduction across university cafeterias.",
    about: "EcoTrack leverages IoT sensors placed across dining facilities and student union buildings to generate real-time sustainability metrics and incentivize greener campus habits.",
    status: "Planning",
    techStack: ["Python", "Flask", "PostgreSQL", "IoT", "React"],
    membersCount: 2,
    ownership: "Other",
    lead: {
      name: "Neha Gupta",
      initials: "NG",
      role: "Lead",
      college: "BITS Pilani"
    },
    members: [
      { name: "Neha Gupta", initials: "NG", role: "Lead & Data Scientist", college: "BITS Pilani" },
      { name: "Aditya Raj", initials: "AR", role: "Mobile Engineer", college: "VIT Vellore" }
    ],
    requested: false,
    chatId: "eco-track"
  },
  {
    id: 4,
    title: "StudyGroup Sync",
    description: "Peer-to-peer exam prep portal with shared lecture notes, flashcards, and timetable synchronization.",
    about: "StudyGroup Sync empowers student cohorts to coordinate study sprints, share annotated PDF lecture notes, and quiz each other before semester finals.",
    status: "Completed",
    techStack: ["Next.js", "Node.js", "MongoDB", "Express"],
    membersCount: 2,
    ownership: "Other",
    lead: {
      name: "Arjun Patel",
      initials: "AP",
      role: "Lead",
      college: "KIIT University"
    },
    members: [
      { name: "Arjun Patel", initials: "AP", role: "Lead Developer", college: "KIIT University" },
      { name: "Rahul Mehta", initials: "RM", role: "Community Lead", college: "Delhi University" }
    ],
    requested: false,
    chatId: "study-group"
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: "smart-attendance",
    name: "Smart Attendance Team",
    initials: "SA",
    isProject: true,
    projectId: 1,
    time: "10:30 AM",
    unread: 2,
    avatarBg: "#DBEAFE",
    avatarColor: "#1E40AF",
    messages: [
      { id: 1, sender: "Arjun Patel", text: "Hey team, how is the facial model looking?", time: "10:15 AM", isMe: false },
      { id: 2, sender: "Rohan Verma", text: "API endpoints are tested on Postman.", time: "10:20 AM", isMe: false },
      { id: 3, sender: "Vivek Kumar", text: "Awesome. I'll test the client-side integration.", time: "10:25 AM", isMe: true },
      { id: 4, sender: "Arjun Patel", text: "Arjun: I have pushed the latest code.", time: "10:30 AM", isMe: false }
    ]
  },
  {
    id: "arjun-patel",
    name: "Arjun Patel",
    initials: "AP",
    isProject: false,
    time: "9:45 AM",
    unread: 1,
    avatarBg: "#E0E7FF",
    avatarColor: "#3730A3",
    messages: [
      { id: 1, sender: "Arjun Patel", text: "Hey Vivek, are you free for a quick review?", time: "9:30 AM", isMe: false },
      { id: 2, sender: "Vivek Kumar", text: "Yes, I am looking at the PR now!", time: "9:40 AM", isMe: true },
      { id: 3, sender: "Arjun Patel", text: "Sounds good!", time: "9:45 AM", isMe: false }
    ]
  },
  {
    id: "sneha-sharma",
    name: "Sneha Sharma",
    initials: "SS",
    isProject: false,
    time: "Yesterday",
    unread: 0,
    avatarBg: "#FCE7F3",
    avatarColor: "#9D174D",
    messages: [
      { id: 1, sender: "Sneha Sharma", text: "Hi! I just finished the mobile mockups in Figma.", time: "Yesterday 4:00 PM", isMe: false },
      { id: 2, sender: "Vivek Kumar", text: "They look super sleek and clean.", time: "Yesterday 4:15 PM", isMe: true },
      { id: 3, sender: "Sneha Sharma", text: "Can we discuss the UI?", time: "Yesterday 4:30 PM", isMe: false }
    ]
  },
  {
    id: "project-discussion",
    name: "Project Discussion",
    initials: "PD",
    isProject: true,
    projectId: 2,
    time: "Yesterday",
    unread: 0,
    avatarBg: "#EDE9FE",
    avatarColor: "#5B21B6",
    messages: [
      { id: 1, sender: "Kavya Singh", text: "We have 40 students already pre-registered for the pilot!", time: "Yesterday 2:10 PM", isMe: false },
      { id: 2, sender: "Rohan Verma", text: "Rohan: I think we should prepare the cloud database for peak load.", time: "Yesterday 2:45 PM", isMe: false }
    ]
  },
  {
    id: "kavya-singh",
    name: "Kavya Singh",
    initials: "KS",
    isProject: false,
    time: "2 days ago",
    unread: 0,
    avatarBg: "#FEF3C7",
    avatarColor: "#92400E",
    messages: [
      { id: 1, sender: "Vivek Kumar", text: "Shared the deck for the campus expo.", time: "2 days ago", isMe: true },
      { id: 2, sender: "Kavya Singh", text: "Thanks!", time: "2 days ago", isMe: false }
    ]
  },
  {
    id: "aditya-raj",
    name: "Aditya Raj",
    initials: "AR",
    isProject: false,
    time: "2 days ago",
    unread: 0,
    avatarBg: "#DCFCE7",
    avatarColor: "#166534",
    messages: [
      { id: 1, sender: "Aditya Raj", text: "Let's connect tomorrow.", time: "2 days ago", isMe: false }
    ]
  }
];

export const NOTIFICATIONS = [
  { id: 1, title: "New Connection", message: "Arjun Patel accepted your connection request.", time: "10m ago" },
  { id: 2, title: "Project Update", message: "Smart Attendance code repository has a new release.", time: "1h ago" },
  { id: 3, title: "Hackathon Alert", message: "Campus Hackathon 2026 team registration closes Friday.", time: "3h ago" }
];

export const INITIAL_HACKATHONS = [
  {
    id: "hack-sih-2026",
    title: "Smart India Hackathon 2026",
    status: "live",
    badgeText: "LIVE NOW",
    organizer: "Ministry of Education & AICTE",
    sponsored: true,
    tagline: "Nationwide innovation marathon solving real governance & civic tech challenges.",
    about: "Smart India Hackathon 2026 is actively underway! Teams are currently competing in software and hardware editions. Final live submissions and code evaluations are ongoing.",
    prizePool: "₹1,00,00,000",
    deadline: "Live coding ends in 14h 30m",
    mode: "Hybrid",
    location: "Nodal Centers & Online",
    teamSize: "4 - 6 Members",
    tags: ["GovTech", "AI/ML", "Cybersecurity", "Smart City"],
    participantsCount: "5,200+ Teams Active",
    accentColor: "#EF4444",
    bannerGradient: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)",
    registered: false,
    registrationDeadline: "Live in Progress",
    link: "https://sih.gov.in"
  },
  {
    id: "hack-ai-blitz-2026",
    title: "Global AI Agents & LLM Blitz",
    status: "ready",
    badgeText: "REGISTRATION OPEN",
    organizer: "Google Cloud & Antigravity Labs",
    sponsored: true,
    tagline: "Design, build and deploy autonomous multi-agent AI assistants for enterprise.",
    about: "Get ready for the premier international AI hackathon of 2026! Free Google Cloud credits, API access to Gemini 1.5/2.0 Pro, and mentorship from leading AI researchers.",
    prizePool: "$50,000 USD",
    deadline: "Registration closes in 4 days (Oct 28)",
    mode: "Online (Global)",
    location: "Remote / Devpost",
    teamSize: "1 - 4 Members",
    tags: ["GenAI", "Agents", "Python", "Cloud"],
    participantsCount: "2,480+ Registered",
    accentColor: "#10B981",
    bannerGradient: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)",
    registered: false,
    registrationDeadline: "Oct 28, 2026",
    link: "https://devpost.com"
  },
  {
    id: "hack-web3-campus",
    title: "Campus Web3 & DeFi Sprint",
    status: "live",
    badgeText: "LIVE NOW",
    organizer: "Ethereum Foundation & Devfolio",
    sponsored: true,
    tagline: "Building zero-knowledge identity, campus micro-payments & DAO governance.",
    about: "The sprint is live! Hundreds of university hackers across the country are pushing smart contracts to testnet. Submit your proof of concept before the timer expires.",
    prizePool: "₹7,50,000",
    deadline: "Sprint ends in 22h 15m",
    mode: "Online",
    location: "Devfolio Virtual",
    teamSize: "2 - 4 Members",
    tags: ["Web3", "Solidity", "Fintech", "Zero Knowledge"],
    participantsCount: "1,140+ Hackers",
    accentColor: "#EF4444",
    bannerGradient: "linear-gradient(135deg, #3B0764 0%, #581C87 50%, #6B21A8 100%)",
    registered: false,
    registrationDeadline: "Live Sprint Active",
    link: "https://devfolio.co"
  },
  {
    id: "hack-health-tech-2026",
    title: "InnovateHealth Student Hackathon",
    status: "ready",
    badgeText: "REGISTRATION OPEN",
    organizer: "Apollo Health & NASSCOM",
    sponsored: true,
    tagline: "Invent wearable diagnostics, mental health tools & remote telemedicine systems.",
    about: "Registration is now open for students across all engineering and design campuses. Gain incubation support, patent filing assistance, and direct investor pitches.",
    prizePool: "₹15,00,000",
    deadline: "Early Bird closes in 6 days",
    mode: "Hybrid",
    location: "Bangalore & Virtual",
    teamSize: "2 - 5 Members",
    tags: ["HealthTech", "IoT", "React Native", "AI"],
    participantsCount: "1,390+ Registered",
    accentColor: "#10B981",
    bannerGradient: "linear-gradient(135deg, #1E293B 0%, #0F766E 50%, #0D9488 100%)",
    registered: false,
    registrationDeadline: "Nov 02, 2026",
    link: "https://innovatehealth.org"
  }
];

