import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const today = "2026-08-19";
const displayDate = "August 19, 2026";
const siteUrl = "https://elettro.com";

const organization = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${siteUrl}/#organization`,
  name: "Elettro Incorporated",
  alternateName: "Elettro",
  url: `${siteUrl}/`,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/images/ElettroLogo-Black-PNG-Transparent-larger.png`
  },
  foundingDate: "1998",
  email: "contact@elettro.com",
  telephone: "+1-310-408-6687",
  priceRange: "Project-based",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2231 SW 97th Road",
    addressLocality: "Davie",
    addressRegion: "FL",
    postalCode: "33324",
    addressCountry: "US"
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "South Florida" },
    { "@type": "Country", name: "United States" }
  ],
  founder: { "@id": `${siteUrl}/#dean-palermo` },
  sameAs: [
    "https://www.linkedin.com/company/elettro",
    "https://www.facebook.com/elettrocom/",
    "https://x.com/ELETTRO",
    "https://www.youtube.com/@Elettrotv",
    "https://www.bbb.org/us/fl/davie/profile/web-design/elettro-inc-0633-90088959"
  ]
};

const founder = {
  "@type": "Person",
  "@id": `${siteUrl}/#dean-palermo`,
  name: "Dean Palermo",
  jobTitle: "Founder and Executive Producer",
  worksFor: { "@id": `${siteUrl}/#organization` },
  url: "https://deanpalermo.com/",
  sameAs: ["https://www.linkedin.com/in/deanpalermo"]
};

const commonProcess = [
  {
    title: "Discovery",
    body: "We define the audience, business goal, existing assets, technical constraints, conversion path, and evidence needed to support the project."
  },
  {
    title: "Architecture",
    body: "We organize pages, messages, search intent, calls to action, structured data, and production requirements before visual execution begins."
  },
  {
    title: "Production",
    body: "We design and build the approved system, then connect content, media, analytics, search controls, forms, and required integrations."
  },
  {
    title: "Validation",
    body: "We test responsive behavior, links, metadata, schema, accessibility, performance, forms, and conversion tracking before launch."
  }
];

const pages = [
  {
    path: "/services/",
    title: "Digital Production Services | Elettro South Florida",
    description: "Explore Elettro web design, SEO, AIO, AI automation, video, branding, music, website redesign, and digital production services in South Florida.",
    kicker: "Integrated Digital Production",
    h1: "Digital production services built around business outcomes",
    lede: "Elettro combines website production, SEO, AI search optimization, automation, video, branding, and audio inside one senior-led production system.",
    answerLabel: "What does Elettro do?",
    answer: "Elettro plans, designs, builds, and improves digital experiences for businesses, public organizations, healthcare providers, hospitality brands, artists, and product companies. Work is scoped around a defined audience, measurable action, and maintainable delivery system.",
    sectionTitle: "One production partner across the full digital system",
    sectionIntro: "Start with one service or connect several disciplines under a single project plan.",
    items: [
      { title: "Web Design and Development", body: "Responsive websites with clear navigation, conversion paths, search structure, analytics, and maintainable code.", url: "/web-design/" },
      { title: "SEO and AIO Optimization", body: "Technical search foundations, answer-ready content, entity clarity, structured data, local search, and measurement.", url: "/seo-aio/" },
      { title: "AI Automation", body: "Practical workflows for content operations, research, routing, reporting, knowledge organization, and repetitive production tasks.", url: "/ai-automation/" },
      { title: "Video Production", body: "Strategy, editing, motion graphics, social video, promotional content, music visuals, and distribution-ready formats.", url: "/video-production/" },
      { title: "Branding and Graphic Design", body: "Identity systems, campaign graphics, infographics, social assets, presentations, and production templates.", url: "/branding-graphic-design/" },
      { title: "Music and Audio Production", body: "Original music, branded audio, editing, sound design, mixes, and digital release support.", url: "/music-audio-production/" },
      { title: "Website Redesign", body: "Structured migrations from outdated websites into faster, clearer, search-ready digital properties.", url: "/website-redesign/" },
      { title: "Hospitality Web Design", body: "Websites and content systems for independent hotels, resorts, marinas, destinations, and tourism brands.", url: "/hospitality-web-design/" },
      { title: "Healthcare Web Design", body: "Clear, accessible, provider-focused websites with careful claims, source structure, and local search support.", url: "/healthcare-web-design/" }
    ],
    deliverables: ["Senior-led project planning", "Responsive production", "SEO and AIO foundations", "Conversion-focused content", "Analytics and event tracking", "Launch validation", "Documentation and handoff", "Ongoing improvement support"],
    answerTitle: "How should you choose the right starting service?",
    answerText: [
      "Start with the business constraint creating the most friction. A company with an outdated website should begin with architecture and redesign. A strong site with weak visibility should begin with SEO, AIO, and content analysis. A team losing time to repeatable work should begin with automation mapping.",
      "Elettro reviews the current system first, then recommends the smallest useful scope connected to a measurable outcome."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Does Elettro provide complete website projects?", a: "Yes. Elettro handles discovery, information architecture, design, development, content structure, SEO foundations, structured data, analytics, testing, and launch planning. The written scope identifies every included deliverable." },
      { q: "Does Elettro work with an existing marketing team?", a: "Yes. Elettro works as a production partner, project lead, or specialist layer. Responsibilities, approvals, file access, and delivery ownership are defined at the start." },
      { q: "Does Elettro work outside South Florida?", a: "Yes. Elettro is based in Davie, Florida and supports clients across the United States and internationally through remote production workflows." },
      { q: "How does Elettro price projects?", a: "Projects are scoped around goals, pages, systems, content, integrations, production requirements, and review cycles. Elettro provides a written estimate after discovery." },
      { q: "Does Elettro provide ongoing support?", a: "Yes. Ongoing support is available for approved updates, reporting, content expansion, technical maintenance, campaign assets, and optimization work." },
      { q: "What information should I provide before requesting a proposal?", a: "Share your current website, main business goal, target audience, required services, timing, available content, technical constraints, and the action you want visitors to take." }
    ],
    related: [
      { title: "Browse selected work", body: "Review websites, video, music, branding, and application projects.", url: "/portfolio/" },
      { title: "Read common project answers", body: "Review scope, timing, ownership, SEO, AIO, and support questions.", url: "/faqs/" },
      { title: "Start a project", body: "Send goals, timing, and current website details to Elettro.", url: "/contact/" }
    ]
  },
  {
    path: "/web-design/",
    title: "Web Design Company in Davie and South Florida | Elettro",
    description: "Elettro designs and develops responsive, conversion-focused, SEO-ready websites for businesses in Davie, South Florida, and nationwide.",
    kicker: "Web Design and Development",
    h1: "Websites designed to explain, persuade, and convert",
    lede: "Elettro builds responsive business websites with clear architecture, strong visual identity, measurable conversion paths, and technical search foundations.",
    answerLabel: "What is included?",
    answer: "A typical Elettro website project includes discovery, page architecture, responsive design, development, content organization, calls to action, metadata, structured data, analytics, accessibility review, testing, and launch support.",
    sectionTitle: "Website systems built beyond the homepage",
    sectionIntro: "Every page receives a defined search purpose, user purpose, and next action.",
    items: [
      { title: "Information Architecture", body: "Page hierarchy, navigation, internal links, URL structure, and content relationships designed before visual production." },
      { title: "Responsive Design", body: "Layouts designed for phones, tablets, laptops, and large screens with readable type, stable controls, and clear actions." },
      { title: "Conversion Structure", body: "Calls, forms, booking links, email actions, and supporting proof placed around real visitor decisions." },
      { title: "Technical SEO", body: "Titles, descriptions, headings, canonicals, sitemaps, robots controls, image descriptions, schema, and crawlable text." },
      { title: "Content Integration", body: "Existing copy, photography, video, reviews, staff information, services, and brand assets organized into useful pages." },
      { title: "Launch Validation", body: "Link checks, responsive QA, form testing, analytics, schema validation, redirects, and search submission support." }
    ],
    deliverables: ["Custom page architecture", "Mobile-first layouts", "Service and landing pages", "Contact and intake forms", "Analytics integration", "SEO metadata", "Structured data", "Sitemap and crawl controls"],
    answerTitle: "What makes a business website effective?",
    answerText: [
      "An effective website tells the right visitor what the company does, who it serves, why it is credible, and what action to take. It loads reliably, works across devices, presents proof near decisions, and gives search systems enough crawlable context to understand each page.",
      "Visual quality matters. Clear structure, useful content, performance, and measurement determine whether the design produces business value."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Does Elettro build new websites or redesign existing websites?", a: "Both. Elettro builds new sites and replaces outdated sites. Redesign projects include an inventory of valuable existing pages, content, links, search signals, and required redirects." },
      { q: "Will my website work on mobile devices?", a: "Yes. Responsive behavior is part of the core build. Navigation, forms, media, text, buttons, and layout are reviewed across common viewport sizes." },
      { q: "Will the website include SEO?", a: "Every website receives foundational technical and on-page SEO. Broader keyword research, content expansion, local SEO, authority development, and ongoing reporting are scoped through the SEO and AIO service." },
      { q: "Who owns the finished website?", a: "Ownership and access are defined in the project agreement. Elettro provides the approved production files and account handoff described in the scope after final payment." },
      { q: "What platform does Elettro use?", a: "The platform depends on the project. Elettro works with static websites, GitHub-based publishing, WordPress, Shopify, and custom systems when each platform fits the business need." },
      { q: "What content is needed before the project begins?", a: "Useful starting materials include the current site, logo files, brand references, service descriptions, staff information, photos, videos, testimonials approved for publication, legal text, and conversion goals." },
      { q: "How long does a website project take?", a: "Timing depends on page count, content readiness, integrations, review cycles, and technical complexity. The written scope sets milestones and approval dates before production begins." },
      { q: "Does Elettro provide hosting?", a: "Hosting options depend on the platform and traffic requirements. The proposal identifies the hosting owner, monthly cost, publishing workflow, backup responsibility, and required accounts." }
    ],
    related: [
      { title: "Website Redesign", body: "Plan migration, redirects, content retention, and launch validation.", url: "/website-redesign/" },
      { title: "SEO and AIO", body: "Strengthen search visibility and AI answer readiness.", url: "/seo-aio/" },
      { title: "Portfolio", body: "Review selected Elettro website and digital production work.", url: "/portfolio/" }
    ],
    serviceType: "Web design and development"
  },
  {
    path: "/seo-aio/",
    title: "SEO and AIO Optimization Agency in South Florida | Elettro",
    description: "Elettro improves technical SEO, local search, structured data, entity clarity, answer-ready content, and AI search readiness for business websites.",
    kicker: "SEO and AI Search Optimization",
    h1: "Search visibility built on clear technical and content signals",
    lede: "Elettro improves how search engines, AI search systems, and prospective customers understand a business, its services, its evidence, and its geographic relevance.",
    answerLabel: "What is AIO?",
    answer: "AIO means AI search optimization. It strengthens crawlability, entity clarity, answer quality, evidence, page structure, internal relationships, and structured data so AI-supported search experiences have reliable material to retrieve and cite.",
    sectionTitle: "SEO and AIO work as one connected system",
    sectionIntro: "Strong AI search readiness begins with the same indexable, helpful, technically clear foundation required for organic search.",
    items: [
      { title: "Technical Audit", body: "Crawl controls, index status, canonicals, redirects, sitemaps, status codes, metadata, headings, internal links, and structured data." },
      { title: "Search Intent Mapping", body: "Commercial, local, comparison, and informational queries assigned to useful pages without duplicating content." },
      { title: "Answer Readiness", body: "Direct answers, definitions, FAQs, process explanations, evidence, and concise passages integrated into visible page content." },
      { title: "Entity Optimization", body: "Consistent company name, founder, location, services, profiles, contact information, and sameAs relationships across the web." },
      { title: "Local Search", body: "Google Business Profile alignment, local landing content, reviews, citations, service relevance, and location consistency." },
      { title: "Measurement", body: "Search Console, analytics, conversion events, query clusters, landing pages, local actions, and content performance reporting." }
    ],
    deliverables: ["SEO and AIO scorecard", "Index and redirect plan", "Keyword-to-page map", "Title and description system", "Organization and service schema", "FAQ and answer content", "Local entity alignment", "Measurement plan"],
    answerTitle: "What moves SEO and AIO results most?",
    answerText: [
      "The strongest gains usually come from fixing index problems, building pages around real customer intent, publishing original experience and evidence, strengthening internal links, and making company information consistent across the site and external profiles.",
      "Extra schema or repeated keywords do not replace useful pages, crawlable proof, strong case studies, accurate local information, or trusted third-party references."
    ],
    steps: [
      { title: "Audit", body: "Measure crawlability, page targeting, structured data, content depth, local signals, authority, and conversion paths." },
      { title: "Prioritize", body: "Rank issues by expected search impact, business value, implementation effort, and dependency." },
      { title: "Implement", body: "Repair the technical foundation, build or improve pages, connect entities, and add answer-ready content." },
      { title: "Measure", body: "Track indexation, impressions, query growth, local actions, leads, and landing-page performance." }
    ],
    faqs: [
      { q: "What is the difference between SEO and AIO?", a: "SEO improves eligibility and relevance across search engines. AIO focuses on the clarity, evidence, structure, and entity relationships AI-supported search experiences use when assembling answers. The work overlaps because AI search depends on indexed web content." },
      { q: "Does structured data guarantee an AI citation?", a: "No. Structured data helps systems classify visible information, but it does not guarantee rankings or citations. Content quality, relevance, indexation, evidence, authority, and query context remain important." },
      { q: "Does Elettro guarantee first-page rankings?", a: "No. Search platforms control rankings and change results by location, query, competition, and user context. Elettro improves the technical, content, local, and authority signals under the website owner's control." },
      { q: "How are Elettro SEO and AIO scores calculated?", a: "Elettro uses an internal implementation score covering crawl controls, metadata, architecture, content, structured data, local entity signals, evidence, internal links, usability, and measurement. It is an implementation benchmark, not a Google metric." },
      { q: "Does a blog improve SEO and AIO?", a: "A useful expert-led article expands query coverage, internal links, evidence, and answer depth. Generic high-volume articles add less value. Core service pages and case studies should be strong before high-volume publishing begins." },
      { q: "How quickly do search changes appear?", a: "Technical changes appear after crawling and processing. Content and authority gains develop over longer periods. Search Console provides the clearest view of indexation, impressions, clicks, and query movement." },
      { q: "Is llms.txt required for Google AI results?", a: "No. Google states that llms.txt is not required for Google Search or its generative AI features. Elettro treats it as an optional directory for systems outside Google, while prioritizing indexable HTML, sitemaps, internal links, and visible content." },
      { q: "What information is needed for an SEO and AIO audit?", a: "The strongest audit uses the live site, source repository, Search Console, analytics, Google Business Profile, keyword data, conversion history, target services, service areas, and known competitors." }
    ],
    related: [
      { title: "Web Design", body: "Build the crawlable, responsive foundation required for search growth.", url: "/web-design/" },
      { title: "AI Automation", body: "Improve repeatable research, content, routing, and reporting workflows.", url: "/ai-automation/" },
      { title: "SEO and AIO reports", body: "Review live optimization examples on the Elettro homepage.", url: "/#seo-reports" }
    ],
    serviceType: "SEO and AI search optimization"
  },
  {
    path: "/ai-automation/",
    title: "AI Automation Agency in South Florida | Elettro",
    description: "Elettro plans and builds practical AI-assisted workflows for content operations, research, reporting, knowledge organization, and digital production.",
    kicker: "AI Automation and Systems",
    h1: "AI workflows shaped around real production work",
    lede: "Elettro maps repeatable tasks, decisions, files, approvals, and reporting needs before introducing AI or automation into the workflow.",
    answerLabel: "What does AI automation mean?",
    answer: "AI automation combines defined business rules, data sources, software actions, and AI-assisted interpretation to reduce repetitive work. A useful system preserves human review where judgment, accuracy, brand control, or approval matters.",
    sectionTitle: "Automation focused on practical operating needs",
    sectionIntro: "The goal is a clearer process with less manual repetition, stronger traceability, and reliable human oversight.",
    items: [
      { title: "Workflow Mapping", body: "Document triggers, inputs, decisions, owners, approvals, outputs, failure points, and existing software before automation begins." },
      { title: "Content Operations", body: "Create repeatable systems for briefs, variants, formatting, routing, status tracking, metadata, and publishing preparation." },
      { title: "Research Systems", body: "Organize source gathering, comparison, extraction, summaries, traceability, and human review around a defined research goal." },
      { title: "Knowledge Organization", body: "Structure files, naming rules, project context, reusable instructions, reference materials, and retrieval paths." },
      { title: "Reporting Workflows", body: "Collect approved data, calculate defined metrics, assemble recurring reports, and route exceptions for review." },
      { title: "Quality Controls", body: "Add validation, approval gates, logging, fallback behavior, access boundaries, and clear ownership for system outputs." }
    ],
    deliverables: ["Current workflow map", "Automation opportunity list", "Data and access requirements", "Human review design", "Prototype workflow", "Validation rules", "Operating documentation", "Improvement backlog"],
    answerTitle: "What should a business automate first?",
    answerText: [
      "Start with a frequent, rules-based task that consumes meaningful time and uses consistent inputs. Good starting points include file organization, content routing, report assembly, metadata preparation, status notifications, and approved research steps.",
      "Do not begin with a high-risk decision process whose rules, data ownership, review responsibility, or acceptable error rate remain unclear."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Does AI automation replace employees?", a: "Elettro designs systems to reduce repetitive work and support people. Human review remains central where judgment, accuracy, legal responsibility, privacy, brand standards, or client approval matters." },
      { q: "What software does Elettro automate?", a: "The tools depend on the approved workflow and available integrations. Elettro evaluates existing systems, APIs, data access, export formats, security requirements, and operating ownership before selecting a stack." },
      { q: "How does Elettro protect private information?", a: "The workflow design identifies sensitive inputs, access boundaries, retention needs, third-party services, and review responsibilities. Private data should only enter systems approved for its intended use." },
      { q: "Does every automation use generative AI?", a: "No. Many reliable automations use standard rules, scheduled actions, templates, data transforms, and notifications. AI is introduced only where interpretation or generation adds useful value." },
      { q: "How is an automation tested?", a: "Testing covers expected inputs, missing data, invalid data, permission failures, duplicate events, output accuracy, approval behavior, retry limits, logging, and manual recovery." },
      { q: "What happens after launch?", a: "The owner receives operating documentation and a defined support path. Early monitoring identifies edge cases, failed assumptions, changing inputs, and opportunities for controlled improvement." }
    ],
    related: [
      { title: "SEO and AIO", body: "Connect technical search, content, entity, and reporting workflows.", url: "/seo-aio/" },
      { title: "Web Design", body: "Integrate approved automation into a public website or internal tool.", url: "/web-design/" },
      { title: "Services", body: "Review the full Elettro digital production system.", url: "/services/" }
    ],
    serviceType: "AI automation and workflow design"
  },
  {
    path: "/video-production/",
    title: "Video Production Company in South Florida | Elettro",
    description: "Elettro produces promotional video, social content, motion graphics, music visuals, editing, and campaign-ready video formats in South Florida.",
    kicker: "Video and Motion Production",
    h1: "Video built for the screen where your audience will see it",
    lede: "Elettro develops video around the message, platform, viewing behavior, brand system, and action the content should support.",
    answerLabel: "What video services does Elettro provide?",
    answer: "Elettro provides video strategy, editing, motion graphics, promotional content, social video, music visuals, testimonial editing, campaign variants, sound finishing, and delivery across vertical, square, widescreen, and custom display formats.",
    sectionTitle: "A production system from source material to final formats",
    sectionIntro: "One strong production can support websites, social channels, presentations, advertising, events, and sales outreach.",
    items: [
      { title: "Creative Direction", body: "Message, audience, format, pacing, visual reference, brand requirements, and final use defined before editing." },
      { title: "Editing", body: "Source review, selects, story assembly, pacing, titles, graphics, captions, sound, color, and revision management." },
      { title: "Motion Graphics", body: "Branded titles, data graphics, transitions, explainers, product movement, and display-specific visual sequences." },
      { title: "Social Formats", body: "Purpose-built 9:16, 1:1, 4:5, and 16:9 versions with readable text, safe areas, captions, and platform context." },
      { title: "Music and Sound", body: "Music selection or production, voice cleanup, sound design, mix balance, and consistent loudness across deliverables." },
      { title: "Delivery Planning", body: "File naming, codecs, dimensions, thumbnails, captions, platform variants, archive structure, and handoff." }
    ],
    deliverables: ["Creative brief", "Edit and motion plan", "Platform-specific formats", "Captioned versions", "Thumbnail or poster frames", "Audio finishing", "Review links", "Organized master files"],
    answerTitle: "Why should formats be planned before editing?",
    answerText: [
      "A wide website video and a vertical social clip use different compositions, pacing, text placement, and viewer behavior. Planning formats early protects important subjects and text while reducing weak mechanical crops later.",
      "Elettro treats each required ratio as a designed output connected to the same core message."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Does Elettro film original footage?", a: "Production scope depends on location, crew, equipment, talent, and creative requirements. Elettro also edits client footage, licensed material, animation, photography, and approved AI-assisted visuals." },
      { q: "Does Elettro produce vertical video?", a: "Yes. Vertical video is designed for the 9:16 frame with mobile safe areas, readable text, appropriate pacing, and a composition built for the vertical view." },
      { q: "Does Elettro add captions?", a: "Yes. Captioned delivery is available. Captions support accessibility, silent viewing, comprehension, and reuse across platforms." },
      { q: "How are revisions handled?", a: "The project scope defines review stages, decision owners, included revision rounds, feedback format, and the point when structural changes affect cost or timing." },
      { q: "Does Elettro create video for websites?", a: "Yes. Website video is prepared around page purpose, loading behavior, dimensions, poster frames, mobile fallback, compression, and accessibility." },
      { q: "Who provides music rights?", a: "Every project identifies the source and permitted use of music, footage, photography, voice, logos, and other third-party assets. Clients must approve and hold the rights required for supplied material." }
    ],
    related: [
      { title: "Music and Audio", body: "Add original music, sound design, editing, and release support.", url: "/music-audio-production/" },
      { title: "Branding and Design", body: "Build the visual system used across video and campaign assets.", url: "/branding-graphic-design/" },
      { title: "Portfolio", body: "Review selected video and motion production work.", url: "/portfolio/" }
    ],
    serviceType: "Video production and motion graphics"
  },
  {
    path: "/branding-graphic-design/",
    title: "Branding and Graphic Design Agency in South Florida | Elettro",
    description: "Elettro creates brand identity, campaign graphics, infographics, presentations, social assets, and production systems for modern businesses.",
    kicker: "Branding and Graphic Design",
    h1: "Visual systems designed for consistent production",
    lede: "Elettro translates business positioning into recognizable visual rules, practical templates, campaign assets, and digital experiences.",
    answerLabel: "What is a brand system?",
    answer: "A brand system defines how a company presents itself across logos, color, typography, imagery, motion, layout, voice, and recurring production formats. The system should guide real work instead of living only inside a presentation.",
    sectionTitle: "Design that supports daily brand use",
    sectionIntro: "The strongest identity remains recognizable across websites, video, social media, presentations, print, and product experiences.",
    items: [
      { title: "Identity Direction", body: "Visual territory, references, logo treatment, color, typography, imagery, layout, and brand personality." },
      { title: "Campaign Graphics", body: "Coordinated assets for launches, events, offers, content series, websites, email, and social distribution." },
      { title: "Infographics", body: "Structured visual explanations for data, processes, comparisons, reports, presentations, and complex services." },
      { title: "Presentation Design", body: "Branded decks, one-sheets, proposals, reports, speaker materials, and reusable slide systems." },
      { title: "Social Asset Systems", body: "Purpose-built layouts across platform ratios with safe areas, readable type, and repeatable production rules." },
      { title: "Production Guidelines", body: "Clear rules, file naming, templates, source assets, exports, and examples for future brand consistency." }
    ],
    deliverables: ["Brand direction", "Logo usage", "Color and typography system", "Image and layout direction", "Campaign templates", "Social format set", "Presentation assets", "Source and export files"],
    answerTitle: "What makes branding useful after launch?",
    answerText: [
      "Useful branding gives a team repeatable rules and organized source files. People should know which logo to use, how text behaves, which colors carry priority, how photography is treated, and how the system adapts across formats.",
      "Elettro builds brand assets around the production channels the client uses most."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Does Elettro design logos?", a: "Yes. Logo work is available as part of a broader identity scope or a focused design project. Deliverables and permitted variations are defined before production." },
      { q: "Will I receive source files?", a: "The agreement identifies which editable source files and exports are included. Approved final assets are organized for the agreed uses after final payment." },
      { q: "Does Elettro work with an existing logo?", a: "Yes. Elettro often extends an existing identity through updated layouts, typography, colors, image treatment, motion, templates, and usage guidance." },
      { q: "Does Elettro create social media templates?", a: "Yes. Templates are designed around the required platforms, post types, ratios, safe areas, brand controls, and expected production workflow." },
      { q: "What is needed before branding begins?", a: "Useful inputs include business goals, audience, competitors, existing assets, brand history, preferred references, practical use cases, approval owners, and known restrictions." },
      { q: "How are design directions approved?", a: "The project defines presentation, feedback, revision, and approval stages. One decision owner should consolidate feedback before each revision round." }
    ],
    related: [
      { title: "Web Design", body: "Apply the brand system across a responsive business website.", url: "/web-design/" },
      { title: "Video Production", body: "Extend identity through motion, social video, and campaign content.", url: "/video-production/" },
      { title: "Portfolio", body: "Review selected branding and graphic production work.", url: "/portfolio/" }
    ],
    serviceType: "Branding and graphic design"
  },
  {
    path: "/music-audio-production/",
    title: "Music and Audio Production Services | Elettro",
    description: "Elettro provides original music, branded audio, editing, sound design, mixing, release support, and integrated audio for digital projects.",
    kicker: "Music and Audio Production",
    h1: "Original sound designed around the project experience",
    lede: "Elettro produces and organizes music and audio for brands, artists, video, digital experiences, releases, and promotional campaigns.",
    answerLabel: "What audio work does Elettro provide?",
    answer: "Elettro provides original music production, branded audio, editing, arrangement support, sound design, mix preparation, video audio, podcast cleanup, release assets, and digital distribution support based on the approved scope.",
    sectionTitle: "Audio production connected to visual and digital work",
    sectionIntro: "Sound, image, timing, platform requirements, rights, and final use are planned together.",
    items: [
      { title: "Original Music", body: "Custom musical direction developed around mood, audience, pacing, identity, and intended use." },
      { title: "Branded Audio", body: "Sonic elements, intros, outros, themes, stings, and repeatable audio cues for content systems." },
      { title: "Editing and Cleanup", body: "Dialogue, podcast, music, and source editing with noise control, timing, structure, and delivery preparation." },
      { title: "Sound for Video", body: "Music, effects, transitions, dialogue balance, loudness, and final mixes shaped around the visual edit." },
      { title: "Release Support", body: "Metadata, artwork coordination, version organization, platform links, promotional assets, and release planning support." },
      { title: "Archive Organization", body: "Master files, stems, alternate versions, naming rules, credits, rights notes, and delivery folders." }
    ],
    deliverables: ["Creative direction", "Approved audio masters", "Platform versions", "Instrumental or alternate mixes", "Stems when scoped", "Metadata support", "Rights documentation inputs", "Organized archive"],
    answerTitle: "Why should audio rights be planned early?",
    answerText: [
      "The intended platforms, territories, duration, paid advertising use, distribution, ownership, and third-party source material affect what audio is appropriate. Rights questions identified early prevent weak substitutions and delivery delays.",
      "Elettro records the source and approved use of project audio as part of the production handoff."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Does Elettro produce music in different genres?", a: "Yes. Direction begins with references, intended audience, emotional goal, pacing, instrumentation, and final use rather than a single house genre." },
      { q: "Does Elettro mix audio for video?", a: "Yes. Video audio work includes dialogue balance, music, effects, transitions, noise control, and delivery loudness based on the platform." },
      { q: "Are stems included?", a: "Stem delivery depends on the production agreement and source rights. Required stems, alternate versions, instrumentals, and file formats should be identified before production." },
      { q: "Does Elettro help with digital releases?", a: "Yes. Support is available for file preparation, metadata organization, artwork coordination, platform links, promotional assets, and release planning." },
      { q: "Who owns the music?", a: "Ownership, licenses, credits, publishing, master rights, and permitted use must be defined in the written agreement for each project." },
      { q: "Does Elettro edit podcasts or spoken-word audio?", a: "Yes. Spoken-word work includes structural editing, cleanup, level balance, intros, outros, music integration, and delivery preparation." }
    ],
    related: [
      { title: "Video Production", body: "Connect music and sound to social, promotional, and campaign video.", url: "/video-production/" },
      { title: "Branding and Design", body: "Coordinate artwork, visual identity, and promotional formats.", url: "/branding-graphic-design/" },
      { title: "Portfolio", body: "Review selected Elettro music and digital media work.", url: "/portfolio/" }
    ],
    serviceType: "Music and audio production"
  },
  {
    path: "/website-redesign/",
    title: "Website Redesign Company in South Florida | Elettro",
    description: "Elettro redesigns outdated business websites with stronger architecture, responsive design, redirects, SEO, AIO, analytics, and launch validation.",
    kicker: "Website Redesign and Migration",
    h1: "Replace an outdated website without discarding its useful value",
    lede: "Elettro inventories existing pages, search signals, content, media, links, and conversion paths before building the replacement.",
    answerLabel: "What is preserved during a redesign?",
    answer: "A responsible redesign identifies valuable URLs, content, backlinks, rankings, forms, analytics, media, legal pages, and user pathways. Useful assets are improved or migrated, obsolete material is removed, and changed URLs receive a documented redirect plan.",
    sectionTitle: "A redesign is a controlled migration",
    sectionIntro: "The visual refresh matters, but index continuity, content decisions, redirects, testing, and measurement determine launch quality.",
    items: [
      { title: "Existing Site Inventory", body: "Pages, titles, descriptions, traffic, backlinks, conversions, forms, media, downloads, integrations, and legal requirements." },
      { title: "Content Decisions", body: "Keep, improve, combine, replace, redirect, or remove each important page through an explicit content map." },
      { title: "New Architecture", body: "Build the future page hierarchy around services, audiences, proof, search intent, and conversion priorities." },
      { title: "Redirect Planning", body: "Map changed high-value URLs to the closest useful replacement and avoid sending every old page to the homepage." },
      { title: "Launch QA", body: "Test forms, links, status codes, canonicals, metadata, schema, responsive behavior, analytics, sitemaps, and robots controls." },
      { title: "Post-Launch Review", body: "Monitor index coverage, traffic, queries, conversion events, crawl errors, redirects, and unexpected user behavior." }
    ],
    deliverables: ["Current-site inventory", "Keep and redirect map", "New sitemap", "Responsive design", "SEO and AIO migration", "Analytics continuity", "Launch checklist", "Post-launch review"],
    answerTitle: "What is the biggest redesign mistake?",
    answerText: [
      "The biggest mistake is replacing the visual site without understanding the old URL footprint. Valuable pages disappear, weak redirects send unrelated visitors to the homepage, search systems lose context, and measurement breaks at the same moment the new design launches.",
      "Elettro treats the old site as a source of evidence and migration requirements, not a visual template for the new one."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Will a redesign hurt current rankings?", a: "Any major site change introduces risk. A complete inventory, content map, permanent redirects, stable internal links, accurate canonicals, sitemap updates, and post-launch monitoring reduce avoidable losses." },
      { q: "Should every old page be kept?", a: "No. Keep pages with useful content, demand, links, traffic, conversions, or business importance. Combine or remove low-value pages through a documented decision and use the correct status or redirect behavior." },
      { q: "Should every old URL redirect to the homepage?", a: "No. Each moved URL should point to the closest relevant replacement. An unrelated homepage redirect creates a poor user experience and weakens topical continuity." },
      { q: "What access is needed for a redesign?", a: "Useful access includes the current hosting or CMS, domain and DNS, analytics, Search Console, tag manager, forms, email routing, media libraries, third-party integrations, and existing backups." },
      { q: "When should the old site be taken down?", a: "The old site should remain available until the replacement passes content, form, responsive, analytics, SEO, redirect, and launch validation." },
      { q: "What should be monitored after launch?", a: "Monitor index coverage, crawl errors, redirect behavior, impressions, clicks, landing pages, conversion events, Core Web Vitals, forms, and support reports." }
    ],
    related: [
      { title: "Web Design", body: "Review the design and development system behind the replacement.", url: "/web-design/" },
      { title: "SEO and AIO", body: "Protect search foundations and strengthen answer readiness during migration.", url: "/seo-aio/" },
      { title: "Start a redesign", body: "Send the current website and primary business goals.", url: "/contact/" }
    ],
    serviceType: "Website redesign and migration"
  },
  {
    path: "/industries/",
    title: "Industries Served by Elettro | Digital Production Agency",
    description: "Elettro supports healthcare, hospitality, nonprofit, entertainment, ecommerce, municipal, legal, professional service, and technology organizations.",
    kicker: "Industries and Experience",
    h1: "Digital production shaped around the operating context",
    lede: "Elettro works across regulated services, hospitality, entertainment, public organizations, ecommerce, technology, and mission-driven projects.",
    answerLabel: "Does Elettro specialize in one industry?",
    answer: "Elettro brings cross-industry production experience, then adapts the website, content, conversion path, evidence, accessibility, media, and search strategy to the specific organization and audience.",
    sectionTitle: "Experience across service, product, public, and creative organizations",
    sectionIntro: "Industry context changes the questions a website must answer and the evidence a visitor expects.",
    items: [
      { title: "Healthcare and Wellness", body: "Provider-focused websites, careful content structure, local visibility, clear next steps, and source-aware educational information.", url: "/healthcare-web-design/" },
      { title: "Hospitality and Tourism", body: "Destination storytelling, rooms and amenities, local discovery, booking paths, media, and mobile trip-planning behavior.", url: "/hospitality-web-design/" },
      { title: "Nonprofit and Advocacy", body: "Mission clarity, program information, donation paths, archives, resources, supporter proof, and accessible public information." },
      { title: "Music and Entertainment", body: "Artist sites, releases, streaming, merchandise, video, campaigns, audience growth, and original media production." },
      { title: "Ecommerce and Products", body: "Collection structure, merchandising, product content, conversion assets, campaign visuals, and platform integrations." },
      { title: "Municipal and Civic", body: "Public information, tourism content, service navigation, accessibility, event discovery, and stakeholder review." },
      { title: "Professional Services", body: "Clear expertise, service definitions, proof, intake paths, local relevance, and credible educational content." },
      { title: "Technology and Custom Systems", body: "Product interfaces, dashboards, automation, media systems, data workflows, and technical documentation." },
      { title: "Legal and Financial", body: "Careful claims, professional authority, service clarity, structured resources, privacy awareness, and lead qualification." }
    ],
    deliverables: ["Audience and intent map", "Industry-specific page architecture", "Proof and trust plan", "Conversion pathway", "Accessibility review", "Search and entity structure", "Media requirements", "Measurement plan"],
    answerTitle: "Why does industry context matter in web production?",
    answerText: [
      "A hotel guest, medical patient, donor, music fan, public resident, and enterprise buyer arrive with different questions and levels of urgency. They also expect different proof, terminology, privacy, access, and next steps.",
      "Elettro uses industry context to shape the information hierarchy and conversion system without forcing every client into the same template."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Does Elettro work with small businesses?", a: "Yes. Project scope is shaped around the business goal, available assets, required systems, timing, and budget rather than company size alone." },
      { q: "Does Elettro work with public organizations?", a: "Yes. Elettro has experience supporting municipal, nonprofit, advocacy, educational, and public-facing projects with multiple stakeholders." },
      { q: "Does Elettro support regulated industries?", a: "Yes, with careful scope boundaries. The client remains responsible for legal, medical, financial, privacy, and regulatory approval of business claims and required disclosures." },
      { q: "Does Elettro work with entertainment brands?", a: "Yes. Elettro supports artists, managers, media brands, releases, video, websites, digital campaigns, and audience-focused content systems." },
      { q: "Does every industry receive a different website design?", a: "Yes. Shared technical standards remain consistent, while content hierarchy, visual direction, proof, actions, accessibility, and integrations adapt to the audience." },
      { q: "How does Elettro learn a new industry?", a: "Discovery covers the business model, audience, terminology, competitors, user questions, evidence, constraints, conversion path, and approval requirements before architecture begins." }
    ],
    related: [
      { title: "Hospitality Web Design", body: "Web and search systems for hotels, resorts, marinas, and destinations.", url: "/hospitality-web-design/" },
      { title: "Healthcare Web Design", body: "Provider-focused websites with careful content and local visibility.", url: "/healthcare-web-design/" },
      { title: "Portfolio", body: "Review selected work across multiple industries.", url: "/portfolio/" }
    ]
  },
  {
    path: "/hospitality-web-design/",
    title: "Hotel and Hospitality Web Design in South Florida | Elettro",
    description: "Elettro designs hotel, resort, marina, tourism, and destination websites with stronger mobile booking paths, local search, visual storytelling, and AIO structure.",
    kicker: "Hospitality and Tourism",
    h1: "Hospitality websites built around trip decisions",
    lede: "Elettro organizes rooms, amenities, location, experiences, policies, media, local discovery, and booking actions around the questions travelers ask before choosing a stay.",
    answerLabel: "What should a hotel website do?",
    answer: "A hotel website should explain the property quickly, show the stay experience honestly, make rooms and amenities easy to compare, answer practical questions, connect location advantages to traveler intent, and move qualified visitors into a clear booking path.",
    sectionTitle: "A digital property experience before arrival",
    sectionIntro: "Strong hospitality production combines visual atmosphere with clear operational information and direct action.",
    items: [
      { title: "Property Positioning", body: "Define the guest, stay type, location advantage, atmosphere, differentiators, and most valuable booking reasons." },
      { title: "Rooms and Amenities", body: "Create scannable room, suite, marina, dining, pool, beach, parking, accessibility, and policy information." },
      { title: "Booking Path", body: "Place direct booking actions around room discovery, offers, policies, location, and mobile decision points." },
      { title: "Local Search", body: "Connect the property to destination, neighborhood, attraction, marina, beach, event, and travel-intent searches." },
      { title: "Visual Production", body: "Use photography, video, maps, galleries, and room imagery with clear labels, alt text, dimensions, and performance controls." },
      { title: "Guest Answers", body: "Answer parking, check-in, pets, accessibility, resort fees, transport, distance, dining, policies, and booking questions." }
    ],
    deliverables: ["Property and guest-positioning map", "Room and amenity architecture", "Mobile booking paths", "Local destination content", "Hotel structured data", "FAQ content", "Media optimization", "Analytics and booking events"],
    answerTitle: "What creates direct-booking value?",
    answerText: [
      "A direct site earns trust when it gives travelers better property information, clearer policies, stronger visual context, and an easier path to the official booking experience. It should reduce uncertainty instead of adding another marketing layer.",
      "Elettro tracks booking-button use, room-page engagement, offer clicks, calls, directions, and inquiry actions where the booking system permits measurement."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Does Elettro connect hotel booking engines?", a: "Yes. The project identifies the booking platform, supported links or embeds, tracking options, mobile behavior, branding limits, and ownership of reservation data." },
      { q: "Does Elettro write hotel content?", a: "Content support includes structure, page copy, room and amenity descriptions, local context, FAQs, metadata, and calls to action based on accurate property information supplied or approved by the client." },
      { q: "How does local SEO help a hotel?", a: "Local and destination content helps search systems connect the property to its actual location, nearby demand, traveler questions, amenities, and stay types. Business Profile accuracy and trusted citations support the same entity." },
      { q: "What photos are needed?", a: "Priority photography includes exterior arrival, room types, bathrooms, views, amenities, common areas, dining, pool or waterfront, accessibility features, parking, and honest scale references." },
      { q: "Does Elettro support independent hotels?", a: "Yes. Independent hotels, resorts, marinas, and small hospitality groups benefit from a distinctive property story and direct control over content, offers, local pages, and measurement." },
      { q: "What should be measured?", a: "Measure booking clicks, room-page engagement, offer use, calls, directions, form submissions, organic landing pages, local queries, source markets, and assisted conversions." }
    ],
    related: [
      { title: "Website Redesign", body: "Replace an outdated property site through a controlled migration.", url: "/website-redesign/" },
      { title: "SEO and AIO", body: "Strengthen destination visibility and answer readiness.", url: "/seo-aio/" },
      { title: "Seascape work", body: "Review hospitality website and marina work in the portfolio.", url: "/portfolio/#project-seascape" }
    ],
    serviceType: "Hotel and hospitality web design"
  },
  {
    path: "/healthcare-web-design/",
    title: "Healthcare and Medical Web Design in South Florida | Elettro",
    description: "Elettro designs clear, accessible healthcare and medical websites with local SEO, careful claims, provider information, patient answers, and measurable intake paths.",
    kicker: "Healthcare and Medical Websites",
    h1: "Healthcare websites built for clarity, trust, and next-step guidance",
    lede: "Elettro structures provider information, services, eligibility, educational content, local relevance, contact paths, and required review around real patient questions.",
    answerLabel: "What makes a healthcare website useful?",
    answer: "A useful healthcare website explains who provides care, what services are available, who the service fits, how the process works, where care is delivered, how to begin, and which information is educational rather than individual medical advice.",
    sectionTitle: "Patient questions shape the information architecture",
    sectionIntro: "Clear language and careful evidence help people make informed contact decisions without unsupported promises.",
    items: [
      { title: "Provider Clarity", body: "Names, credentials, roles, professional scope, location, and review responsibility presented consistently across pages and schema." },
      { title: "Service Structure", body: "Distinct pages for real services, eligibility, process, follow-up, safety, costs, and next steps without duplicating thin content." },
      { title: "Patient Answers", body: "Direct answers to common scheduling, consultation, payment, preparation, follow-up, location, and policy questions." },
      { title: "Local Visibility", body: "Consistent clinic name, address, phone, service area, provider relationship, Business Profile, and trusted citations." },
      { title: "Editorial Signals", body: "Visible authorship or review, update dates, sources, editorial policy, medical information boundaries, and corrections process." },
      { title: "Intake Measurement", body: "Track calls, contact forms, booking actions, directions, consultation pages, and organic landing paths without exposing sensitive data." }
    ],
    deliverables: ["Patient-intent page map", "Provider and clinic entity structure", "Service and FAQ content", "Local SEO foundation", "Medical and editorial policy pages", "Schema validation", "Accessible intake paths", "Privacy-aware measurement"],
    answerTitle: "How should healthcare marketing claims be handled?",
    answerText: [
      "Claims should be accurate, supportable, reviewed by the responsible business or licensed provider, and presented without guaranteed outcomes. Educational information should distinguish general guidance from individual medical advice.",
      "Elettro structures the website and content workflow. The healthcare business approves clinical accuracy, professional scope, privacy, advertising, and regulatory requirements."
    ],
    steps: commonProcess,
    faqs: [
      { q: "Does Elettro provide medical advice?", a: "No. Elettro provides website, content-structure, SEO, AIO, design, and production services. The healthcare business and its qualified professionals remain responsible for clinical information and patient care." },
      { q: "Who reviews medical website content?", a: "The client should identify the licensed or otherwise qualified reviewer responsible for clinical accuracy. Reviewer name, credentials, review date, and sources should appear where appropriate." },
      { q: "Does Elettro build local healthcare pages?", a: "Yes. Local pages should reflect real locations, providers, services, and patient needs. Elettro avoids creating repeated city pages with minimal unique value." },
      { q: "How are testimonials handled?", a: "Only testimonials approved for publication should appear. They should avoid guarantees, misleading typicality, unsupported clinical claims, private information, and incentives that are not disclosed." },
      { q: "Does Elettro work with appointment platforms?", a: "Yes. Integration depends on the platform, privacy requirements, supported embeds or links, ownership, data handling, accessibility, and tracking limits." },
      { q: "What should a provider page include?", a: "A provider page should include the correct name, role, credentials, education or experience relevant to the service, professional scope, location relationship, photo, and review responsibility where applicable." },
      { q: "How should website analytics handle health information?", a: "Tracking should focus on page and conversion events without collecting sensitive health details in analytics tools. Forms, vendors, consent, storage, access, and privacy language require client review." }
    ],
    related: [
      { title: "SEO and AIO", body: "Improve local visibility, entity clarity, and answer readiness.", url: "/seo-aio/" },
      { title: "Website Redesign", body: "Migrate an outdated healthcare site with controlled URL changes.", url: "/website-redesign/" },
      { title: "Weight Loss Davie", body: "Review a healthcare website and optimization project.", url: "https://weightlossdavie.com/report/" }
    ],
    serviceType: "Healthcare and medical web design"
  },
  {
    path: "/faqs/",
    title: "Elettro FAQs | Web Design, SEO, AIO, AI and Production",
    description: "Answers about Elettro website projects, SEO, AIO, AI automation, video, branding, pricing, timing, ownership, support, and South Florida service coverage.",
    kicker: "Frequently Asked Questions",
    h1: "Direct answers about working with Elettro",
    lede: "Review project scope, process, ownership, platforms, SEO, AIO, automation, content, revisions, measurement, and support before starting a conversation.",
    answerLabel: "Where is Elettro based?",
    answer: "Elettro Incorporated is based in Davie, Florida and serves South Florida, nationwide, and international clients through senior-led digital production workflows.",
    sectionTitle: "Questions organized around real project decisions",
    sectionIntro: "These answers establish the working framework. The written proposal controls the exact deliverables for each project.",
    items: [
      { title: "Website Projects", body: "Architecture, design, development, content, platforms, responsive behavior, hosting, migration, and launch." },
      { title: "SEO and AIO", body: "Technical search, AI readiness, local visibility, structured data, content, measurement, and score methodology." },
      { title: "Creative Production", body: "Branding, graphics, video, music, source assets, formats, revisions, rights, and delivery." },
      { title: "AI and Automation", body: "Workflow design, human review, privacy, testing, software, ownership, and operating documentation." },
      { title: "Scope and Pricing", body: "Discovery inputs, written estimates, milestones, approvals, change requests, payment, and ownership." },
      { title: "Support and Measurement", body: "Analytics, reporting, updates, optimization, hosting responsibility, maintenance, and post-launch review." }
    ],
    deliverables: ["Clear written scope", "Named decision owner", "Defined review stages", "Approved content inputs", "Access checklist", "Launch responsibilities", "Ownership and handoff terms", "Support path"],
    answerTitle: "What creates a smooth digital production project?",
    answerText: [
      "A smooth project has one clear business goal, an identified decision owner, accurate source information, timely access, consolidated feedback, documented approvals, and a written definition of completion.",
      "Elettro uses discovery and milestones to surface dependencies before they create launch delays."
    ],
    steps: commonProcess,
    faqs: [
      { q: "What is Elettro?", a: "Elettro Incorporated is a digital production agency based in Davie, Florida. Services include websites, SEO, AIO, AI automation, branding, graphics, video, music, audio, and project production." },
      { q: "Who leads Elettro?", a: "Dean Palermo is the founder and executive producer. He brings more than 25 years of experience across digital production, websites, video, social media, AI strategy, SEO, branding, and music." },
      { q: "Where does Elettro work?", a: "Elettro serves South Florida, nationwide, and international clients. Remote production supports discovery, reviews, approvals, file exchange, reporting, and delivery." },
      { q: "What types of clients does Elettro support?", a: "Elettro supports small and midsize businesses, public organizations, healthcare providers, hospitality companies, nonprofits, artists, entertainment brands, ecommerce operations, and technology projects." },
      { q: "How do I request a proposal?", a: "Send the current website, business goal, target audience, required services, timing, available assets, technical requirements, and the action visitors should take. Elettro reviews the information before defining scope." },
      { q: "How are projects priced?", a: "Pricing reflects scope, page count, systems, content, integrations, production requirements, review cycles, travel, licensing, and timing. Elettro provides a written estimate after discovery." },
      { q: "Does Elettro require a deposit?", a: "Payment terms are defined in the written agreement. Production begins after the required agreement, initial payment, access, and starting materials are received." },
      { q: "How are project changes handled?", a: "Requests outside the approved scope are reviewed for impact on cost, timing, dependencies, and completed work. Elettro documents approved changes before adding them to production." },
      { q: "Who provides website content?", a: "Content responsibility depends on the scope. Elettro works with approved client content, restructures existing material, writes scoped copy, and organizes source information. The client approves factual accuracy and required legal or professional claims." },
      { q: "Does Elettro use AI in production?", a: "Yes, where it improves research, iteration, organization, automation, or creative development. Human direction, review, brand control, factual checking, rights, and approval remain part of the process." },
      { q: "Will Elettro guarantee search rankings?", a: "No. Search platforms control rankings. Elettro improves crawlability, relevance, structure, content, evidence, local signals, entity consistency, usability, and measurement." },
      { q: "What is an AIO score?", a: "Elettro's AIO score is an internal readiness benchmark covering crawlable answers, entity clarity, structured data, evidence, page relationships, source signals, local information, and retrieval-friendly content. It is not a score issued by Google." },
      { q: "Will I own the final files?", a: "Ownership, licenses, account access, source files, third-party assets, and handoff are defined in the written agreement. Approved deliverables are transferred according to those terms after final payment." },
      { q: "Does Elettro provide ongoing updates?", a: "Yes. Ongoing work is available for approved content updates, technical maintenance, reporting, SEO and AIO expansion, campaign production, automation improvements, and new pages." },
      { q: "Does Elettro host websites?", a: "Hosting responsibility depends on the platform and scope. The proposal identifies the account owner, publishing method, monthly cost, domain and DNS responsibility, backups, and support boundaries." },
      { q: "How does Elettro measure results?", a: "Measurement is matched to the project. Common events include calls, emails, forms, booking clicks, purchases, directions, downloads, portfolio engagement, organic landing pages, and keyword clusters." },
      { q: "What happens after launch?", a: "Elettro confirms the approved pages, forms, links, analytics, redirects, metadata, schema, sitemaps, and responsive behavior, then monitors the areas included in the post-launch scope." },
      { q: "How do I contact Elettro?", a: "Email contact@elettro.com, call 310-408-6687, or use the project form on the Elettro contact page." }
    ],
    related: [
      { title: "Services", body: "Review every primary Elettro production service.", url: "/services/" },
      { title: "About Elettro", body: "Read company, founder, experience, and operating information.", url: "/about/" },
      { title: "Contact Elettro", body: "Send project goals, timing, and current website information.", url: "/contact/" }
    ]
  },
  {
    path: "/about/",
    title: "About Elettro Incorporated and Dean Palermo",
    description: "Learn about Elettro Incorporated, founder Dean Palermo, 25+ years of digital production experience, services, project approach, and South Florida base.",
    kicker: "About Elettro",
    h1: "Senior-led digital production since 1998",
    lede: "Elettro Incorporated is a Davie, Florida digital production agency led by founder and executive producer Dean Palermo.",
    answerLabel: "What makes Elettro different?",
    answer: "Elettro connects strategy, project management, website production, SEO, AI search optimization, automation, branding, video, graphics, music, and audio through one senior-led production relationship.",
    sectionTitle: "Experience across creative, technical, and operational work",
    sectionIntro: "The company combines hands-on execution with structured production management and measurable digital outcomes.",
    items: [
      { title: "25+ Years Active", body: "Elettro's operating history began in 1998 and spans major shifts in websites, media, social platforms, mobile behavior, ecommerce, and AI-assisted production." },
      { title: "Senior Production Leadership", body: "Dean Palermo leads discovery, creative direction, project structure, production decisions, and client communication." },
      { title: "Cross-Discipline Delivery", body: "Website, search, video, brand, automation, audio, and content work stay connected through one project architecture." },
      { title: "Major Brand Experience", body: "Past work includes projects involving Audible, Universal Music Group, City of West Palm Beach, T-Mobile, Samsung, FIU, The Blue Card, and entertainment clients." },
      { title: "Measured Audience Growth", body: "The homepage documents more than 1B video views, more than 1M fans grown, and selected client growth examples." },
      { title: "South Florida Base", body: "Elettro is based in Davie, Florida and serves South Florida, nationwide, and international clients." }
    ],
    deliverables: ["Direct senior involvement", "Structured discovery", "Clear project scope", "Cross-channel production", "Documented review stages", "Technical validation", "Organized handoff", "Ongoing support options"],
    answerTitle: "Who is Dean Palermo?",
    answerText: [
      "Dean Palermo is the founder and executive producer of Elettro and Stashbox. His experience spans websites, global social production, video, branding, AI strategy, SEO, music distribution, and digital project leadership.",
      "He previously served as Senior Global Social Project Manager at Audible and Amazon and has led work across business, entertainment, hospitality, healthcare, public, nonprofit, and ecommerce projects."
    ],
    steps: commonProcess,
    faqs: [
      { q: "When was Elettro founded?", a: "Elettro Incorporated began operating in 1998." },
      { q: "Where is Elettro located?", a: "Elettro is based at 2231 SW 97th Road in Davie, Florida 33324." },
      { q: "Who owns Elettro?", a: "Elettro Incorporated is led by founder and executive producer Dean Palermo." },
      { q: "What services does Elettro provide?", a: "Services include web design and development, website redesign, SEO, AIO, AI automation, branding, graphic design, video, motion graphics, music, audio, and digital project production." },
      { q: "What is Elettro's project approach?", a: "Projects move through discovery, architecture, production, review, validation, launch, and approved support. The scope defines responsibilities and deliverables." },
      { q: "Does Elettro work with large organizations?", a: "Yes. Elettro's experience spans small businesses, public organizations, global brands, entertainment companies, nonprofits, healthcare providers, and technology projects." }
    ],
    related: [
      { title: "Services", body: "Review the complete Elettro production offering.", url: "/services/" },
      { title: "Portfolio", body: "Review selected websites, video, music, branding, and application work.", url: "/portfolio/" },
      { title: "Dean Palermo", body: "Read the founder's extended professional profile.", url: "https://deanpalermo.com/" }
    ],
    aboutPage: true
  },
  {
    path: "/contact/",
    title: "Contact Elettro | Start a Digital Production Project",
    description: "Contact Elettro in Davie, Florida about web design, SEO, AIO, AI automation, branding, video, music, website redesign, or digital production.",
    kicker: "Start a Project",
    h1: "Tell Elettro what needs to move forward",
    lede: "Share the current situation, target audience, timing, available assets, and the business action the project should support.",
    answerLabel: "How do I contact Elettro?",
    answer: "Email contact@elettro.com, call 310-408-6687, or send the project form below. Elettro is based in Davie, Florida and works with South Florida, national, and international clients.",
    sectionTitle: "Useful information for the first project review",
    sectionIntro: "A concise starting brief helps Elettro identify scope, dependencies, risks, and the right next conversation.",
    items: [
      { title: "Current State", body: "Share the existing website, campaign, workflow, brand material, or production files connected to the request." },
      { title: "Primary Goal", body: "State the business result, audience action, operating improvement, or communication problem the work should address." },
      { title: "Required Services", body: "Identify website, SEO, AIO, automation, video, branding, audio, content, or project-management needs." },
      { title: "Timing", body: "Provide the desired launch date, fixed event date, internal review calendar, and known dependencies." },
      { title: "Decision Process", body: "Identify the project owner, reviewers, required approvals, and person authorized to consolidate feedback." },
      { title: "Access and Assets", body: "List available copy, logos, images, video, analytics, hosting, domain access, platform accounts, and source files." }
    ],
    deliverables: ["Project objective", "Audience and action", "Current website or system", "Required services", "Available content and assets", "Technical dependencies", "Target timing", "Decision owner"],
    answerTitle: "What happens after you send the form?",
    answerText: [
      "Elettro reviews the request, current digital property, stated goals, timing, and likely dependencies. The next step is a focused conversation or written follow-up to confirm scope inputs.",
      "A proposal is prepared after the project boundaries, responsibilities, production requirements, review process, and delivery expectations are clear."
    ],
    steps: commonProcess,
    faqs: [
      { q: "What should I include in my first message?", a: "Include the current website or project link, primary goal, target audience, services needed, timing, available content, known technical requirements, and the action you want users to take." },
      { q: "Does Elettro offer a first conversation?", a: "Yes. Elettro reviews the starting information first, then confirms whether a call, written questions, access review, or audit is the most useful next step." },
      { q: "Will I receive a written proposal?", a: "Yes. Approved projects receive written scope, pricing, payment terms, milestones, responsibilities, review expectations, and delivery terms." },
      { q: "Does Elettro accept urgent work?", a: "Urgent timing depends on current capacity, scope clarity, access, asset readiness, review speed, and technical risk. Fixed deadlines should be stated in the first message." },
      { q: "Does Elettro work under confidentiality?", a: "Confidentiality requirements should be identified before private materials are shared. Project agreements define approved handling where needed." },
      { q: "Where is Elettro based?", a: "Elettro Incorporated is based in Davie, Florida and serves clients across South Florida and beyond." }
    ],
    related: [
      { title: "Services", body: "Review available digital production services before sending the brief.", url: "/services/" },
      { title: "FAQs", body: "Review scope, pricing, ownership, timing, and support answers.", url: "/faqs/" },
      { title: "Portfolio", body: "Review selected Elettro work and project categories.", url: "/portfolio/" }
    ],
    contactPage: true
  }
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function absoluteUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path}`;
}

function breadcrumbSchema(page) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(page.path)}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: page.h1, item: absoluteUrl(page.path) }
    ]
  };
}

function schemaFor(page) {
  const canonical = absoluteUrl(page.path);
  const webpageType = page.contactPage ? "ContactPage" : page.aboutPage ? "AboutPage" : "WebPage";
  const graph = [organization, founder, {
    "@type": webpageType,
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    dateModified: today,
    publisher: { "@id": `${siteUrl}/#organization` },
    author: { "@id": `${siteUrl}/#dean-palermo` },
    reviewedBy: { "@id": `${siteUrl}/#dean-palermo` },
    inLanguage: "en-US",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    breadcrumb: { "@id": `${canonical}#breadcrumbs` }
  }, {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: "Elettro",
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US"
  }, breadcrumbSchema(page)];

  if (page.serviceType) {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: page.serviceType,
      serviceType: page.serviceType,
      description: page.description,
      url: canonical,
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: organization.areaServed
    });
  }

  if (page.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      mainEntity: page.faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a }
      }))
    });
  }

  if (page.items?.some(item => item.url)) {
    graph.push({
      "@type": "ItemList",
      "@id": `${canonical}#directory`,
      itemListElement: page.items.filter(item => item.url).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: absoluteUrl(item.url)
      }))
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function header() {
  return `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <header class="site-header">
      <nav class="nav-shell" aria-label="Primary navigation">
        <a class="brand-link" href="/" aria-label="Elettro home">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          <img src="/images/Elettro-logo-white.png" width="520" height="92" alt="Elettro" />
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Open navigation">☰</button>
        <div class="nav-links" id="site-menu">
          <a href="/services/">Services</a>
          <a href="/seo-aio/">SEO &amp; AIO</a>
          <a href="/industries/">Industries</a>
          <a href="/portfolio/">Portfolio</a>
          <a href="/faqs/">FAQs</a>
          <a href="/about/">About</a>
          <a class="nav-cta" href="/contact/">Start a Project</a>
        </div>
      </nav>
    </header>`.trim();
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div>
          <img class="footer-logo" src="/images/Elettro-logo-white.png" width="520" height="92" alt="Elettro" loading="lazy" />
          <p class="footer-about">Elettro Incorporated is a senior-led digital production agency based in Davie, Florida. Services include websites, SEO, AIO, AI automation, branding, video, graphics, music, and audio.</p>
        </div>
        <div class="footer-links">
          <strong>Core Services</strong>
          <a href="/web-design/">Web Design</a>
          <a href="/seo-aio/">SEO &amp; AIO</a>
          <a href="/ai-automation/">AI Automation</a>
          <a href="/website-redesign/">Website Redesign</a>
        </div>
        <div class="footer-links">
          <strong>Creative</strong>
          <a href="/video-production/">Video Production</a>
          <a href="/branding-graphic-design/">Branding &amp; Design</a>
          <a href="/music-audio-production/">Music &amp; Audio</a>
          <a href="/portfolio/">Portfolio</a>
        </div>
        <div class="footer-links">
          <strong>Elettro Incorporated</strong>
          <a href="mailto:contact@elettro.com">contact@elettro.com</a>
          <a href="tel:+13104086687">310.408.6687</a>
          <span>2231 SW 97th Road</span>
          <span>Davie, Florida 33324</span>
          <a href="/faqs/">FAQs</a>
          <a href="/contact/">Contact</a>
        </div>
      </div>
      <div class="wrap footer-bottom">
        <span>© 2026 Elettro Incorporated. All rights reserved.</span>
        <span>Davie, Florida | Serving South Florida and beyond</span>
      </div>
    </footer>`.trim();
}

function renderItems(page) {
  return page.items.map((item, index) => {
    const inner = `<span class="card-number">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p>${item.url ? "<span>Explore service →</span>" : ""}`;
    return item.url
      ? `<a class="related-card" href="${escapeHtml(item.url)}">${inner}</a>`
      : `<article class="info-card">${inner}</article>`;
  }).join("\n");
}

function renderFaqs(page) {
  return page.faqs.map(({ q, a }) => `
    <details>
      <summary>${escapeHtml(q)}</summary>
      <div class="faq-answer"><p>${escapeHtml(a)}</p></div>
    </details>`).join("\n");
}

function renderRelated(page) {
  return page.related.map(item => `
    <a class="related-card" href="${escapeHtml(item.url)}">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
      <span>Open →</span>
    </a>`).join("\n");
}

function renderContactForm() {
  return `
    <section class="section section-soft" id="project-form">
      <div class="wrap contact-grid">
        <div>
          <p class="section-kicker">Direct Contact</p>
          <h2>Contact Elettro</h2>
          <div class="contact-cards">
            <a class="contact-card" href="mailto:contact@elettro.com"><small>Email</small><strong>contact@elettro.com</strong></a>
            <a class="contact-card" href="tel:+13104086687"><small>Phone</small><strong>310.408.6687</strong></a>
            <div class="contact-card"><small>Location</small><strong>Davie, Florida</strong></div>
          </div>
        </div>
        <form class="contact-form" action="https://formspree.io/f/mpqkzdbw" method="POST">
          <div class="form-grid">
            <div class="field"><label for="name">Full name</label><input id="name" name="name" type="text" autocomplete="name" required /></div>
            <div class="field"><label for="email">Business email</label><input id="email" name="email" type="email" autocomplete="email" required /></div>
            <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" /></div>
            <div class="field"><label for="service">Primary service</label><select id="service" name="service" required><option value="">Select a service</option><option>Web Design</option><option>Website Redesign</option><option>SEO and AIO</option><option>AI Automation</option><option>Video Production</option><option>Branding and Graphic Design</option><option>Music and Audio</option><option>Integrated Production</option></select></div>
            <div class="field field-wide"><label for="website">Current website or project link</label><input id="website" name="website" type="url" inputmode="url" placeholder="https://" /></div>
            <div class="field field-wide"><label for="message">Project goal, timing, and required work</label><textarea id="message" name="message" rows="7" required></textarea></div>
            <div class="field-wide"><button class="button-primary" type="submit">Send Project Details</button></div>
          </div>
        </form>
      </div>
    </section>`.trim();
}

function buildPage(page) {
  const canonical = absoluteUrl(page.path);
  const schema = JSON.stringify(schemaFor(page)).replaceAll("</", "<\\/");
  const gridClass = page.items.length > 6 ? "industry-grid" : "card-grid";
  return `<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${canonical}" />
  <meta name="theme-color" content="#050b18" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Elettro" />
  <meta property="og:title" content="${escapeHtml(page.title)}" />
  <meta property="og:description" content="${escapeHtml(page.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${siteUrl}/images/Dean-16x9-GreenScreen-55.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(page.title)}" />
  <meta name="twitter:description" content="${escapeHtml(page.description)}" />
  <meta name="twitter:image" content="${siteUrl}/images/Dean-16x9-GreenScreen-55.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;family=Space+Grotesk:wght@500;600;700;800&amp;display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/seo-pages.css" />
  <script type="application/ld+json">${schema}</script>
</head>
<body>
${header()}
  <main id="main-content">
    <div class="wrap breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-hidden="true">/</li><li aria-current="page">${escapeHtml(page.kicker)}</li></ol></div>
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <p class="eyebrow">${escapeHtml(page.kicker)}</p>
          <h1>${escapeHtml(page.h1)}</h1>
          <p class="hero-lede">${escapeHtml(page.lede)}</p>
          <p class="page-meta">Updated ${displayDate} · Published by Elettro Incorporated · Reviewed by Dean Palermo</p>
          <div class="button-row"><a class="button-primary" href="/contact/">Start a Project</a><a class="button-secondary" href="/portfolio/">View Selected Work</a></div>
        </div>
        <aside class="hero-answer" aria-label="Quick answer"><strong>${escapeHtml(page.answerLabel)}</strong><p>${escapeHtml(page.answer)}</p></aside>
    </section>
    <section class="trust-strip" aria-label="Elettro facts"><div class="wrap trust-grid"><div class="trust-item"><strong>25+ years</strong><span>Digital production experience</span></div><div class="trust-item"><strong>Davie, Florida</strong><span>South Florida headquarters</span></div><div class="trust-item"><strong>Senior-led</strong><span>Direct production leadership</span></div><div class="trust-item"><strong>SEO + AIO</strong><span>Search-ready foundation</span></div></div></section>
    <section class="section">
      <div class="wrap">
        <div class="section-heading"><p class="section-kicker">What Elettro Provides</p><h2>${escapeHtml(page.sectionTitle)}</h2><p>${escapeHtml(page.sectionIntro)}</p></div>
        <div class="${gridClass}">${renderItems(page)}</div>
      </div>
    </section>
    <section class="section section-soft">
      <div class="wrap answer-panel">
        <div><p class="section-kicker">Direct Answer</p><h2>${escapeHtml(page.answerTitle)}</h2></div>
        <div class="answer-copy">${page.answerText.map(text => `<p>${escapeHtml(text)}</p>`).join("")}</div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section-heading"><p class="section-kicker">Included Foundation</p><h2>Practical elements built into the work</h2><p>The final scope selects the elements required for the project.</p></div>
        <ul class="check-list">${page.deliverables.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    </section>
    <section class="section section-soft">
      <div class="wrap">
        <div class="section-heading"><p class="section-kicker">Production Process</p><h2>From discovery through validation</h2><p>Clear milestones connect business intent to the final delivery.</p></div>
        <div class="steps-grid">${page.steps.map((step, index) => `<article class="step-card"><span class="card-number">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.body)}</p></article>`).join("")}</div>
      </div>
    </section>
${page.contactPage ? renderContactForm() : ""}
    <section class="section" id="frequently-asked-questions">
      <div class="wrap">
        <div class="section-heading"><p class="section-kicker">Frequently Asked Questions</p><h2>Answers before the first project conversation</h2><p>Each answer appears as visible page content and matching structured data.</p></div>
        <div class="faq-list">${renderFaqs(page)}</div>
      </div>
    </section>
    <section class="section section-soft">
      <div class="wrap">
        <div class="section-heading"><p class="section-kicker">Related Pages</p><h2>Continue your project research</h2></div>
        <div class="related-grid">${renderRelated(page)}</div>
      </div>
    </section>
    <section class="section"><div class="wrap cta-panel"><div><h2>Ready to define the next move?</h2><p>Send the current website, goal, audience, timing, and required services.</p></div><a class="button-primary" href="/contact/">Contact Elettro</a></div></section>
  </main>
${footer()}
  <script>const toggle=document.querySelector('.menu-toggle');const menu=document.getElementById('site-menu');if(toggle&&menu){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');menu.dataset.open=String(!open)});menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');menu.dataset.open='false'}))}</script>
</body>
</html>`;
}

for (const page of pages) {
  const destination = join(root, page.path.replace(/^\//, ""), "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, buildPage(page), "utf8");
}

console.log(`Built ${pages.length} Elettro SEO and AIO pages.`);
