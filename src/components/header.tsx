import { Share } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

const LOGO_SIZE = 32;

export default function Header() {
  return (
    <header className="p-4 border-b-2">
      <nav className="grid grid-cols-3 items-center">
        <Image
          src="/logo-no-bg.png"
          alt="logo"
          width={LOGO_SIZE}
          height={LOGO_SIZE}
        />
        <h1 className="justify-self-center text-xl font-bold">Text Editor</h1>
        <ul className="flex gap-4 justify-self-end">
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
