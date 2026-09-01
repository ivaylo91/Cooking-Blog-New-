import Link from "next/link";
import { ChefHat } from "lucide-react";
import { CookingBackground } from "@/components/CookingBackground";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border-subtle bg-surface-muted">
      <CookingBackground variant="absolute" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-10 text-center">
        <span className="flex items-center gap-2 font-heading text-base font-semibold">
          <ChefHat size={18} className="text-accent" />
          Кулинарният блог на Иво
        </span>
        <p className="max-w-sm text-sm text-muted-foreground">
          Домашни рецепти, изпробвани в собствената ми кухня — за всеки, който
          обича да готви за удоволствие.
        </p>
        <div className="flex gap-4 text-sm">
          <Link href="/recepti" className="hover:text-accent">
            Рецепти
          </Link>
          <Link href="/za-ivo" className="hover:text-accent">
            За Иво
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Кулинарният блог на Иво
        </p>
      </div>
    </footer>
  );
}
