export interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
  author: {
    name: string;
    bio: string;
  };
  social: {
    email?: string;
  };
  siteUrl: string;
  baseUrl: string;
}

export const config: SiteConfig = {
  title: "The Red Soil",
  tagline:
    "For people and planet: eco-socialist analysis for justice, solidarity, and a liveable world",
  description:
    "Critical eco-socialist reporting and analysis from Africa and beyond — connecting struggles for democracy, equality, and ecological survival, and imagining life beyond profit and domination.",
  author: {
    name: "The Red Soil Collective",
    bio: "Eco-socialist and decolonial analysis from Africa — confronting capitalism, empire, and ecological collapse through solidarity, research, and collective imagination.",
  },
  social: {
    email: "contact@theredsoil.co.za",
  },
  siteUrl: "https://theredsoil.co.za",
  baseUrl: "/",
};
