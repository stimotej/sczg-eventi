import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { buttonClassName } from "@/modules/common/components/button";

export default function NotFound() {
  return (
    <main className="p-4 md:p-6 lg:p-10">
      <div className="py-52 flex flex-col gap-4 items-center justify-center">
        <p className="text-9xl font-bold">404</p>
        <h1 className="text-2xl font-bold">Stranica nije pronađena</h1>
        <Link href="/" className={cn(buttonClassName, "mt-6")}>
          Povratak na početnu
        </Link>
      </div>
    </main>
  );
}
