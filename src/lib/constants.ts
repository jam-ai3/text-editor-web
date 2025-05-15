export const LANDING_PAGE_URL = "/home";
export const MAIN_SITE_URL = "https://jamai.dev";
export const UNAUTH_REDIRECT_PATH = `${MAIN_SITE_URL}/login?from=write`;

export const MD_WIDTH = 768;
export const MAX_CONTEXT_LENGTH = 100;
export const MENU_BUTTON_SIZE = 16;

export const REJECT_COLOR = "#f005";
export const REJECT_COLOR_STRONG = "#d00e";
export const ACCEPT_COLOR = "#0d05";
export const ACCEPT_COLOR_STRONG = "#0b0e";
export const SUGGESTION_COLOR = "#777";

export const SHOULD_SAVE = false;
// export const SHOULD_SAVE = true;

export type Product = {
  id: string;
  name: string;
  description: string;
  priceInPennies: number;
  isSubscription: boolean;
  subscriptionInterval: "day" | "week" | "month" | "year";
  discount?: number;
};

export const FREE_TRIAL: Product = {
  id: "0",
  name: "Free Trial",
  description: "Unlimited use of flashcards generator for a one-week period",
  priceInPennies: 0,
  isSubscription: false,
  subscriptionInterval: "week",
};

export const PRODUCTS: Record<string, Product> = {
  monthly: {
    id: "1",
    name: "Monthly Subscription",
    description: "Unlimited use of flashcards generator for a one-month period",
    priceInPennies: 499,
    isSubscription: true,
    subscriptionInterval: "month",
  },
  yearly: {
    id: "2",
    name: "Yearly Subscription",
    description: "Unlimited use of flashcards generator for a one-year period",
    priceInPennies: 4999,
    isSubscription: true,
    subscriptionInterval: "year",
    discount: 0.17,
  },
};

export const PRODUCTS_ARRAY: Product[] = Object.values(PRODUCTS);
