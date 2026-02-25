import { getRentiqeListings } from "@/lib/data/rentiqe";
import clearHtmlFromString from "@/lib/utils/clear-html-from-string";
import { cn } from "@/lib/utils/cn";
import getRentiqeImageUrl from "@/lib/utils/rentiqe-image-loader";
import { buttonClassName } from "@/modules/common/components/button";
import DisplayHTML from "@/modules/common/components/display-html";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dvorane",
};

export default async function DvoranePage() {
  const { listings } = await getRentiqeListings();

  return (
    <main className="max-w-6xl mx-auto min-h-screen px-4 md:px-6 lg:px-10 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center">Događanja</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {listings.map((listing) => (
          <li key={listing.id}>
            <figure>
              {listing.images[0] ? (
                <Image
                  src={getRentiqeImageUrl(listing.images[0].url, 600)}
                  alt={listing.images[0].alt || listing.name}
                  className="w-full h-[250px] object-cover rounded-lg"
                  width={600}
                  height={250}
                />
              ) : null}
              <DisplayHTML
                as="figcaption"
                className="text-center mt-3"
                html={clearHtmlFromString(listing.name)}
              />
            </figure>
            <DisplayHTML
              as="p"
              className="mt-3"
              html={clearHtmlFromString(listing.description)}
            />
            <div className="mt-4 flex justify-center">
              <Link
                href={`/checkout?listingId=${listing.id}`}
                className={cn(buttonClassName, "text-base")}
              >
                Iznajmi sada
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
