import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const LOGO_SIZE = 64;

type HeaderProps = {
  ToolbarRight?: ReactNode;
};

export default function Header({ ToolbarRight }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src="/logo-no-bg.png"
            alt="Logo"
            width={LOGO_SIZE}
            height={LOGO_SIZE}
          />
        </Link>
        <span className="font-semibold text-xl">Document Editor</span>
      </div>
      {ToolbarRight && ToolbarRight}
    </header>
  );
}
