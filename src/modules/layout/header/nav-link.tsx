"use client";

import { cn } from "@/lib/utils/cn";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationLink({
  children,
  href,
  className,
  ...props
}: LinkProps & {
  children?: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      href={href}
      className={
        className ??
        cn(
          "group text-base font-bold tracking-wider text-(--background) p-4 relative",
          "before:content-[''] before:absolute before:left-6 before:opacity-0 before:transform before:scale-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-px before:bg-(--background) before:transition-all",
          "after:content-[''] after:absolute after:right-6 after:opacity-0 after:transform after:scale-0 after:top-1/2 after:-translate-y-1/2 after:h-4 after:w-px after:bg-(--background) after:transition-all",
          pathname === href
            ? "before:scale-100 before:opacity-100 before:left-1"
            : "hover:before:scale-100 hover:before:opacity-100 hover:before:left-1",
          pathname === href
            ? "after:scale-100 after:opacity-100 after:right-1"
            : "hover:after:scale-100 hover:after:opacity-100 hover:after:right-1"
        )
      }
      aria-current={pathname === href ? "page" : undefined}
      data-active={pathname === href}
    >
      {children}
    </Link>
  );
}
