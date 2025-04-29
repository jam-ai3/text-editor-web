import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { UNAUTH_REDIRECT_PATH } from "@/lib/constants";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const IMAGE_HEIGHT = 600;
const IMAGE_WIDTH = 600;

export default async function HomePage() {
  const session = await getSession();

  return (
    <>
      <Header />
      <main
        className="gap-24 grid grid-cols-[1fr_2fr] px-12 py-12"
        style={{ height: `calc(100vh - var(--header-height)` }}
      >
        <section className="place-items-center grid h-full">
          <div className="flex flex-col gap-6">
            <p className="font-bold text-2xl">Improve Your Writing</p>
            <p className="text-muted-foreground text-lg">
              Get real-time writing help with an AI editor that not only
              improves your text but also explains each change. Learn as you
              write with clear, thoughtful suggestions that help you become a
              better writer.
            </p>
            <Button asChild className="w-fit">
              <Link href={session ? "/" : UNAUTH_REDIRECT_PATH}>
                <span>{session ? "Start Writing" : "Login"}</span>
                {session ? <ArrowRight /> : <LogIn />}
              </Link>
            </Button>
          </div>
        </section>
        <section className="place-items-center grid h-full">
          <Image
            src="/home-image.png"
            alt="logo"
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            className="shadow-md rotate-6"
          />
        </section>
      </main>
      <Footer absolute />
    </>
  );
}
