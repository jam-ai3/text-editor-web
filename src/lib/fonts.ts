import {
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Poppins,
  Merriweather,
  Playfair_Display,
  Libre_Baskerville,
  Fira_Code,
  JetBrains_Mono,
  Source_Code_Pro,
  Caveat,
  Pacifico,
  Dancing_Script,
} from "next/font/google";

export const DEFAULT_FONT_FAMILY = "Arial";

export const FONT_FAMILIES = {
  sansSerif: [
    "Arial",
    "Helvetica",
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Segoe UI",
    "Poppins",
  ],
  serif: [
    "Times New Roman",
    "Georgia",
    "Merriweather",
    "Playfair Display",
    "Libre Baskerville",
  ],
  monospace: ["Courier New", "Fira Code", "JetBrains Mono", "Source Code Pro"],
  decorative: ["Comic Sans MS", "Caveat", "Pacifico", "Dancing Script"],
};

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
});

export const firaCode = Fira_Code({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const sourceCodePro = Source_Code_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

export const caveat = Caveat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const pacifico = Pacifico({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

export const fonts = [
  inter,
  roboto,
  openSans,
  lato,
  poppins,
  merriweather,
  playfairDisplay,
  libreBaskerville,
  firaCode,
  jetBrainsMono,
  sourceCodePro,
  caveat,
  pacifico,
  dancingScript,
];
