import Link from "next/link";

type FooterProps = {
  absolute?: boolean;
};

export default function Footer({ absolute = false }: FooterProps) {
  return (
    <footer className={`${absolute ? "absolute bottom-0 w-full" : ""} mb-8`}>
      <nav>
        <ul className="flex justify-evenly text-sm">
          <li>
            <Link href="/privacy-policy.pdf">
              <span className="text-muted-foreground">Privacy Policy</span>
            </Link>
          </li>
          <li>
            <span className="text-muted-foreground">&copy; 2025 JAMAi</span>
          </li>
          <li>
            <Link href="/terms-of-service.pdf">
              <span className="text-muted-foreground">Terms of Service</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
