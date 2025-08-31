"use client";

import { cn } from "@/lib/utils/cn";
import React, { useState } from "react";

export default function HeaderContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 py-3 z-50 mx-auto gap-4 bg-(--primary) transition-all border-b border-neutral-500",
        isScrolled ? "max-w-full" : "max-w-6xl"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 w-full flex items-center justify-between">
        {children}
      </div>
    </header>
  );
}
