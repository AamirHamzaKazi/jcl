export type CampaProduct = {
  id: string;
  name: string;
  category: "classics" | "energy" | "refreshers";
  eyebrow: string;
  description: string;
  image: string;
  accent: string;
  formats: string[];
  source: string;
};

export const productRanges: CampaProduct[] = [
  {
    id: "cola", name: "Cola", category: "classics", eyebrow: "THE ORIGINAL ICON",
    description: "The Great Indian Taste. Bold cola, unmistakably Campa.",
    image: "/images/campa-cola.png", accent: "#b992f5", formats: ["Can", "Bottle"],
    source: "https://campabeverages.com/",
  },
  {
    id: "orange", name: "Orange", category: "classics", eyebrow: "FULL COLOUR. FULL FLAVOUR.",
    description: "A bright orange burst with a playful side and a seriously fizzy finish.",
    image: "/images/campa-orange.png", accent: "#ffae5b", formats: ["Can", "Bottle"],
    source: "https://campabeverages.com/",
  },
  {
    id: "lemon", name: "Lemon", category: "classics", eyebrow: "TURN UP THE ZING",
    description: "Crisp, sparkling lemon refreshment. A little zing goes a long way.",
    image: "/images/campa-lemon.png", accent: "#d4ee6d", formats: ["Can", "Bottle"],
    source: "https://campabeverages.com/",
  },
  {
    id: "zero-sugar", name: "Zero Sugar Cola", category: "classics", eyebrow: "A DIFFERENT KIND OF CLASSIC",
    description: "Discover the cola side of Campa with zero sugar, in a silver can.",
    image: "/images/range/zero-sugar.jpg", accent: "#c3d5dc", formats: ["Can"],
    source: "https://blinkit.com/prn/campa-zero-sugar-cola/prid/1400796",
  },
  {
    id: "neon-boost", name: "Neon Boost", category: "energy", eyebrow: "GO NEON",
    description: "Electric green. Bold citrus. Meet the brighter side of Campa Energy.",
    image: "/images/range/neon-boost.webp", accent: "#b9e33d", formats: ["Can", "Bottle"],
    source: "https://hdms.iopshub.com/catalog/campa-neon-boost-30/",
  },
  {
    id: "powerup-energy", name: "Power Up Can", category: "energy", eyebrow: "A BOLDER BLUE",
    description: "A bold, fizzy Campa Power Up expression in a ready-to-go can.",
    image: "/images/range/powerup-energy.jpg", accent: "#73bbf0", formats: ["Can"],
    source: "https://www.zepto.com/pn/campa-power-up-can/pvid/60bd2a37-b66f-41ee-91b2-0a90fe036f07",
  },
  {
    id: "gold-boost", name: "Gold Boost", category: "energy", eyebrow: "GOLD STANDARD ENERGY",
    description: "Mixed-berry flavour meets the striking black-and-gold Campa Energy can.",
    image: "/images/range/gold-boost.webp", accent: "#eec65d", formats: ["Can"],
    source: "https://www.zepto.com/pn/campa-gold-boost-energy-drink/pvid/e8b3b30f-2035-463c-9448-85776346582f",
  },
  {
    id: "powerup-cola", name: "PowerUp Cola", category: "refreshers", eyebrow: "AB POWER APNE HATH MEIN",
    description: "A strong cola with a bold fusion of flavours. Made for full-on refreshment.",
    image: "/images/range/powerup-cola.png", accent: "#74aae4", formats: ["Bottle"],
    source: "https://campabeverages.com/",
  },
  {
    id: "cricket", name: "Cricket", category: "refreshers", eyebrow: "REFRESH THE JOSH",
    description: "Fizzy, lemony refreshment with electrolytes. Bring your cheering A-game.",
    image: "/images/range/cricket.png", accent: "#bee957", formats: ["Bottle"],
    source: "https://campabeverages.com/",
  },
];
