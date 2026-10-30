export interface ServiceItem {
  id: string;
  title: string;
  category: 'printing' | 'design' | 'corporate' | 'events';
  shortDesc: string;
  fullDesc: string;
  hasDimensions: boolean;
  defaultUnit?: 'feet' | 'inches' | 'meters';
  defaultDimensions?: { width: number; height: number };
  materials: string[];
  recommendedQuantity?: number;
  modelType: 'banner' | 'card' | 'brochure' | 'stamp' | 'canvas' | 'packaging';
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'flex' | 'branding' | 'invitations' | 'social' | 'print';
  categoryLabel: string;
  image: string;
  description: string;
  specs: string;
  serviceId: string;
  highlightTag?: string;
}

export const BUSINESS_INFO = {
  name: 'Mashallah Flex Printing and Advertising',
  shortName: 'Mashallah Printing',
  owner: 'Attique Bhatti',
  monogram: 'AB',
  email: 'aliattique685@gmail.com',
  phone: '+92 343 4758685',
  phoneClean: '923434758685',
  whatsappUrl: 'https://wa.me/923434758685',
  location: 'Bhatta Chowk, Bedian Road, Lahore Cantt, Lahore, Pakistan',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bhatta+Chowk%2C+Bedian+Road%2C+Lahore+Cantt%2C+Lahore%2C+Pakistan',
  tagline: 'Designing Ideas. Printing Impact.',
  heroSubtitle: 'High-precision wide-format flex printing, luxury bespoke stationery, brand identity, and complete advertising print craft tailored for businesses, retail shops, and events.',
  establishedYear: 'Verified Studio Craft',
} as const;

export const SERVICES: ServiceItem[] = [
  {
    id: 'flex-banner',
    title: 'Flex Banner Design & Printing',
    category: 'printing',
    shortDesc: 'Weather-resistant large-format outdoor & indoor vinyl banners with high-tensile eyelets.',
    fullDesc: 'Commercial heavy-duty flex banners printed with UV-stable and solvent inks for vivid color durability. Ideal for shop fascias, real-estate billboards, roadside gantries, promotional events, and trade fairs.',
    hasDimensions: true,
    defaultUnit: 'feet',
    defaultDimensions: { width: 10, height: 3 },
    materials: ['Heavy Frontlit 440gsm Vinyl', 'Star Backlit Flex 510gsm', 'Blackout Vinyl', 'Matte Exhibition Grade'],
    recommendedQuantity: 1,
    modelType: 'banner',
    features: ['Reinforced folded hems', 'Heavy brass eyelets', 'Solvent-resistant vibrant inks', 'Custom pole pockets available']
  },
  {
    id: 'business-cards',
    title: 'Business Cards',
    category: 'corporate',
    shortDesc: 'Bespoke corporate identity cards with velvet lamination, metallic foil stamping, and spot UV.',
    fullDesc: 'Make an enduring first impression with premium cardstocks, crisp micro-typography, luxury velvet touch, embossed metallic foil, or sleek spot gloss finishes.',
    hasDimensions: false,
    materials: ['350gsm Velvet Matt Card', 'Textured Cotton Art Board', 'Gold / Silver Foil Stamped', 'Spot UV Lamination'],
    recommendedQuantity: 500,
    modelType: 'card',
    features: ['Sharp laser edges', 'Dual-sided full color', 'Luxury tactile texture', 'Round or square corner cut']
  },
  {
    id: 'logo-design',
    title: 'Logo Design & Brand Identity',
    category: 'design',
    shortDesc: 'Memorable, scalable vector brand marks, typography guidelines, and complete corporate identity.',
    fullDesc: 'Crafting distinct logos engineered for impact across all media—from microscopic business card embossing to massive 50-foot roadside flex banners without losing crispness.',
    hasDimensions: false,
    materials: ['Vector AI / EPS Source Files', 'High-Res Transparent PNG', 'CMYK Print Ready PDF', 'Brand Style Sheet'],
    recommendedQuantity: 1,
    modelType: 'canvas',
    features: ['Original vector marks', 'Color system & typography guide', 'Social media ready exports', 'Unlimited preliminary revisions']
  },
  {
    id: 'stamp-printing',
    title: 'Stamp Printing',
    category: 'corporate',
    shortDesc: 'Automated self-inking rubber stamps, official brass seal marks, and durable pocket stamps.',
    fullDesc: 'Precision laser-engraved rubber dies for crisp, clean impressions every press. Perfect for doctor registrations, legal verifications, shop receipts, and bank endorsement stamps.',
    hasDimensions: false,
    materials: ['Trodat Self-Inking Body', 'Laser-Engraved Polymer Rubber', 'Solid Brass Heavy Seal', 'Pocket Stamp Format'],
    recommendedQuantity: 1,
    modelType: 'stamp',
    features: ['Thousands of clean impressions', 'Re-inkable pad compartment', 'Sharp micro-seal detail', 'Instant ready turnaround']
  },
  {
    id: 'social-media-post',
    title: 'Social Media Post Design',
    category: 'design',
    shortDesc: 'Eye-catching promotional banners, carousel sets, and brand ads for Instagram, Facebook & WhatsApp.',
    fullDesc: 'Digital advertising creatives tailored for maximum engagement, high-conversion product announcements, festive sales campaigns, and daily brand visibility.',
    hasDimensions: false,
    materials: ['1080x1080px Square Grid', '1080x1920px Story / Reel Format', 'Editable Figma / PSD', 'Optimized JPG / PNG'],
    recommendedQuantity: 10,
    modelType: 'canvas',
    features: ['Color calibrated for mobile screens', 'Compelling typographic hierarchy', 'Discount & sale callouts', 'Fast digital delivery']
  },
  {
    id: 'brochures',
    title: 'Brochures & Flyers',
    category: 'printing',
    shortDesc: 'Tri-fold, bi-fold, and multi-page catalog brochures with precision crease and high-gloss coating.',
    fullDesc: 'Comprehensive sales and service presentation collateral on premium gloss or silk art paper with clean mechanical folding and rich photo reproduction.',
    hasDimensions: true,
    defaultUnit: 'inches',
    defaultDimensions: { width: 8.5, height: 11 },
    materials: ['130gsm Gloss Art Paper', '170gsm Silk Matt', '300gsm Premium Folded Card', 'Spot Gloss Finish'],
    recommendedQuantity: 1000,
    modelType: 'brochure',
    features: ['Clean mechanical scores', 'Tri-fold & Z-fold alignments', 'Vibrant photo fidelity', 'Bulk commercial packaging']
  },
  {
    id: 'wedding-invitations',
    title: 'Wedding Invitation Cards',
    category: 'events',
    shortDesc: 'Regal wedding stationery with laser-cut lace sleeves, gold foil calligraphy, and custom wax seals.',
    fullDesc: 'Celebrate matrimonial milestones with bespoke invitations crafted on textured shimmer paperboards, royal calligraphy, matching inserts, and gilded envelopes.',
    hasDimensions: false,
    materials: ['Metallic Shimmer Board', 'Laser-Cut Filigree Sleeve', 'Raised Gold Thermography', 'Wax Seal & Ribbon Band'],
    recommendedQuantity: 250,
    modelType: 'brochure',
    features: ['Custom couple monogram', 'Multi-event insert suite', 'Matching RSVP & envelope', 'Bespoke calligraphy styling']
  },
  {
    id: 'letterheads',
    title: 'Letterheads',
    category: 'corporate',
    shortDesc: 'Executive commercial letterheads on smooth bond paper, compatible with laser and inkjet printers.',
    fullDesc: 'Professional stationery representing your company credibility in official correspondence, legal contracts, quotations, and official notices.',
    hasDimensions: true,
    defaultUnit: 'inches',
    defaultDimensions: { width: 8.27, height: 11.69 },
    materials: ['100gsm Super White Bond Paper', '120gsm Textured Executive Paper', 'Foil Embossed Header'],
    recommendedQuantity: 500,
    modelType: 'brochure',
    features: ['Printer-safe offset inks', 'Crisp watermark positioning', 'Standard A4 / Letter cut', 'Padding & loose leaf options']
  },
  {
    id: 'bill-books',
    title: 'Bill Books & Invoices',
    category: 'corporate',
    shortDesc: 'Carbonless duplicate and triplicate invoice pads with serial numbering and perforated tear-off.',
    fullDesc: 'Custom printed NCR bill books, cash memos, delivery challans, and receipt pads formatted for your exact business inventory and billing workflow.',
    hasDimensions: true,
    defaultUnit: 'inches',
    defaultDimensions: { width: 7, height: 9 },
    materials: ['NCR Carbonless Duplicate (2-ply)', 'NCR Triplicate (3-ply)', 'Single Sheet Bond Pad', 'Hardboard Backing'],
    recommendedQuantity: 10,
    modelType: 'card',
    features: ['Sequential red serial numbering', 'Micro-perforation for easy tear', 'Heavy protective cover', '50 or 100 sets per book']
  },
  {
    id: 'file-covers',
    title: 'File Covers & Document Folders',
    category: 'corporate',
    shortDesc: 'Rigid presentation folders with die-cut document pockets, business card slots, and protective laminates.',
    fullDesc: 'Sturdy branded presentation folders that keep client proposals, certificates, property documents, and contracts pristine and organized.',
    hasDimensions: true,
    defaultUnit: 'inches',
    defaultDimensions: { width: 9, height: 12 },
    materials: ['350gsm Coated SBS Board', 'Rigid Hardboard Cloth Laminated', 'Matt Lamination + Spot UV'],
    recommendedQuantity: 100,
    modelType: 'brochure',
    features: ['Internal pocket with business card slot', 'Durable crease spine', 'Scuff-resistant coating', 'Standard legal & A4 capacity']
  },
  {
    id: 'advertising-materials',
    title: 'Custom Advertising & Printing',
    category: 'printing',
    shortDesc: 'Roll-up standees, backlit signboards, vinyl stickers, acrylic plates, and promotional event displays.',
    fullDesc: 'Turnkey advertising solutions for indoor exhibitions, store storefronts, road signage, and custom marketing rollouts built to your exact requirements.',
    hasDimensions: true,
    defaultUnit: 'feet',
    defaultDimensions: { width: 6, height: 4 },
    materials: ['Roll-up Banner with Aluminum Stand', 'Reflective Vinyl Sheet', 'Die-Cut Vinyl Stickers', 'Translucent Backlit Acrylic'],
    recommendedQuantity: 1,
    modelType: 'banner',
    features: ['Portable luxury pull-up hardware', 'Full-spectrum UV flatbed printing', 'Outdoor weather endurance', 'Turnkey assembly']
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'High-Impact Highway Gantry Flex Banner',
    category: 'flex',
    categoryLabel: 'Flex Banner Showcase',
    image: '/src/assets/images/portfolio_flex_billboard_1792940199255.jpg',
    description: 'Outdoor large-format billboard advertisement for urban commercial corridor. Features ultra-crisp photo reproduction, high-contrast typography, and UV-solvent inks that withstand monsoon rains and intense sunlight.',
    specs: '30ft x 10ft · Heavy 510gsm Backlit Vinyl · High-Tensile Corner Eyelets',
    serviceId: 'flex-banner',
    highlightTag: 'Featured Large-Format'
  },
  {
    id: 'port-2',
    title: 'Executive Corporate Stationery & Gilded Foil Cards',
    category: 'branding',
    categoryLabel: 'Brand Identity & Stationery',
    image: '/src/assets/images/portfolio_branding_stationery_1792940200141.jpg',
    description: 'Complete brand identity suite for Aurora Asset Management, featuring double-thick cotton business cards with hot gold foil stamping, custom letterhead, and deep navy presentation folders.',
    specs: '400gsm Cotton Art Paper · Metallic Gold Foil Stamp · Precision Creased Pocket Folders',
    serviceId: 'business-cards',
    highlightTag: 'Luxury Stationery'
  },
  {
    id: 'port-3',
    title: 'Bespoke Royal Matrimonial Invitation Suite',
    category: 'invitations',
    categoryLabel: 'Wedding Invitation Suite',
    image: '/src/assets/images/portfolio_wedding_invitation_1792940200078.jpg',
    description: 'Intricate laser-cut filigree sleeve wedding invitation suite with embossed gold calligraphy, shimmering pearlescent cardstock, custom wax monogram seal, and gold-gilded matching inserts.',
    specs: '320gsm Shimmer Ivory Card · Laser Filigree Cut · Hand-Poured Wax Monogram Seal',
    serviceId: 'wedding-invitations',
    highlightTag: 'Royal Craft'
  },
  {
    id: 'port-4',
    title: 'Commercial Retail Shop Fascia Flex Signage',
    category: 'flex',
    categoryLabel: 'Flex Banner & Signboard',
    image: '/src/assets/images/portfolio_flex_billboard_1792940199255.jpg',
    description: 'Custom high-visibility storefront flex signage engineered for nighttime illumination with vibrant backlit vinyl and sturdy structural framing.',
    specs: '24ft x 4ft · Star Backlit 510gsm · Weather-Proof Welded Edges',
    serviceId: 'flex-banner'
  },
  {
    id: 'port-5',
    title: 'Official Laser-Engraved Self-Inking Verification Stamps',
    category: 'print',
    categoryLabel: 'Stamp Printing',
    image: '/src/assets/images/portfolio_branding_stationery_1792940200141.jpg',
    description: 'Heavy-duty official company seal stamps and compact portable pocket stamps engraved with sub-millimeter precision for legal and receipt stamping.',
    specs: 'Trodat Mechanism · Laser Engraved Vulcanized Polymer Die · Red & Blue Dual Ink',
    serviceId: 'stamp-printing'
  },
  {
    id: 'port-6',
    title: 'High-Conversion Social Media Product Campaign Set',
    category: 'social',
    categoryLabel: 'Social Media Creatives',
    image: '/src/assets/images/portfolio_branding_stationery_1792940200141.jpg',
    description: 'Series of promotional ad creatives engineered for WhatsApp status campaigns, Instagram reels, and Facebook advertising with clear typography and promo badges.',
    specs: '1080x1080px & 1080x1920px · High-Res Vector Assets · Calibrated RGB Gamut',
    serviceId: 'social-media-post'
  }
];

export const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Consultation & Dimensions',
    desc: 'Share your exact banner measurements, card quantities, branding preferences, or sample ideas via our interactive form or direct WhatsApp.'
  },
  {
    step: '02',
    title: 'Creative Design & Digital Proofing',
    desc: 'Attique Bhatti personally crafts high-resolution vector artwork, typography, and color grading, providing a realistic mockup preview for your approval.'
  },
  {
    step: '03',
    title: 'Precision Printing & Finishing',
    desc: 'Using industrial flex printers, precision laser cutters, and luxury foil stamping equipment, your project is produced on selected heavy-duty media.'
  },
  {
    step: '04',
    title: 'Quality Inspection & Fast Handover',
    desc: 'Every print job undergoes inspection for color saturation, hem stitching, eyelet strength, and clean packaging before prompt delivery or collection.'
  }
];
