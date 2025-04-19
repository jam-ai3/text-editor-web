import Image from "next/image";
import Link from "next/link";
import { ComponentType } from "react";

const LOGO_SIZE = 32;

type HeaderProps = {
  ToolbarRight?: ComponentType;
};

export default function Header({ ToolbarRight }: HeaderProps) {
  return (
    <header className="p-4 border-b-2">
      <nav className="items-center grid grid-cols-3 w-full">
        <Link href="/">
          <Image
            src="/logo-no-bg.png"
            alt="logo"
            width={LOGO_SIZE}
            height={LOGO_SIZE}
          />
        </Link>
        <h1 className="justify-self-center font-bold text-xl">Text Editor</h1>
        {ToolbarRight ? <ToolbarRight /> : <span />}
      </nav>
    </header>
  );
}
