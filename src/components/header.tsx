import { Share } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

const LOGO_SIZE = 32;

export default function Header() {
  return (
    <header className="p-4 border-b-2">
      <nav className="items-center grid grid-cols-3 w-full">
        <Image
          src="/logo-no-bg.png"
          alt="logo"
          width={LOGO_SIZE}
          height={LOGO_SIZE}
        />
        <h1 className="justify-self-center font-bold text-xl">Text Editor</h1>
        <ul className="flex justify-self-end gap-4">
          <li>
            <Button>
              <span>Export</span>
              <Share />
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
