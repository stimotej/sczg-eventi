import Image from "next/image";
import NavigationLink from "./nav-link";
import { mainNavigationLinks } from "@/lib/utils/constants";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/modules/common/components/sheet";
import MenuIcon from "@/modules/common/icons/menu";
import Link from "next/link";
import PhoneIcon from "@/modules/common/icons/phone";
import Socials from "@/modules/common/components/socials";
import HeaderContainer from "./container";

export default function Header() {
  return (
    <HeaderContainer>
      <Link
        href="/"
        aria-label="Idi na početnu"
        className="flex items-center gap-4"
      >
        <Image
          src="/eventi/logo.webp"
          className="w-16 h-auto"
          alt="Studentski Centar Zagreb logo"
          width={64}
          height={44.5}
        />
      </Link>

      {/* MOBILE NAVIGATION */}
      <Sheet>
        <SheetTrigger asChild>
          <button aria-label="Otvori navigaciju" className="lg:hidden">
            <MenuIcon className="size-8 text-(--background)" />
          </button>
        </SheetTrigger>
        <SheetContent className="w-5/6 sm:max-w-3/4 md:w-1/2 lg:max-w-sm">
          <SheetHeader>
            <SheetTitle className="sr-only">Glavna navigacija</SheetTitle>
            <SheetDescription className="sr-only">
              Izbornik glavne navigacije stranice. Koristite tipkovnicu ili miš
              za odabir željene stranice.
            </SheetDescription>
          </SheetHeader>

          <nav aria-label="Glavna navigacija" dir="ltr">
            <ul className="flex flex-col items-center justify-center p-4">
              {mainNavigationLinks.map((link) => (
                <li key={link.href} className="w-full first:[&>a]:border-t">
                  <SheetClose asChild>
                    <NavigationLink
                      href={link.href}
                      className="flex text-sm py-6 w-full font-bold border-b tracking-wider border-black/20 text-(--foreground)/60 data-[active=true]:text-(--primary)"
                    >
                      {link.title}
                    </NavigationLink>
                  </SheetClose>
                </li>
              ))}
              <li className="flex items-center w-full py-6 border-b border-black/20">
                <PhoneIcon className="size-4 text-neutral-400 mr-3" />
                <a
                  href="tel:+ 385 1 4593 621"
                  className="underline text-sm text-(--foreground)/60"
                >
                  + 385 1 4593 621
                </a>
              </li>
              <Socials className="flex items-center gap-4 py-6 w-full" />
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden lg:block" aria-label="Glavna navigacija">
        <ul className="flex items-center gap-2">
          {mainNavigationLinks.map((link) => (
            <li key={link.href}>
              <NavigationLink href={link.href}>{link.title}</NavigationLink>
            </li>
          ))}
        </ul>
      </nav>
    </HeaderContainer>
  );
}
