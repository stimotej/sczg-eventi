"use client";

import React from "react";
import Image from "next/image";
import type { RentiqeImage } from "@/lib/data/rentiqe-types";
import { cn } from "@/lib/utils/cn";
import getRentiqeImageUrl from "@/lib/utils/rentiqe-image-loader";
import ChevronLeftIcon from "@/modules/common/icons/chevron-left";
import ChevronRightIcon from "@/modules/common/icons/chevron-right";
import {
  PhotoProvider,
  PhotoView,
} from "@/modules/common/components/photo-view";

type ListingImageCarouselProps = {
  images: RentiqeImage[];
  listingName: string;
};

function getWrappedIndex(index: number, length: number) {
  return (index + length) % length;
}

export default function ListingImageCarousel({
  images,
  listingName,
}: ListingImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const hasMultipleImages = images.length > 1;

  const moveToPrevious = React.useCallback(() => {
    setCurrentIndex((index) => {
      return getWrappedIndex(index - 1, images.length);
    });
  }, [images.length]);

  const moveToNext = React.useCallback(() => {
    setCurrentIndex((index) => {
      return getWrappedIndex(index + 1, images.length);
    });
  }, [images.length]);

  const moveToIndex = React.useCallback(
    (index: number) => {
      if (index < 0 || index > images.length - 1) {
        return;
      }

      setCurrentIndex(index);
    },
    [images.length]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!hasMultipleImages) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveToPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveToNext();
      }

      if (event.key === "Home") {
        event.preventDefault();
        moveToIndex(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        moveToIndex(images.length - 1);
      }
    },
    [hasMultipleImages, images.length, moveToIndex, moveToNext, moveToPrevious]
  );

  if (!images[0]) {
    return null;
  }

  const activeImage = images[currentIndex];
  const activeAlt = activeImage.alt || listingName;

  return (
    <section
      aria-label="Galerija slika prostora"
      className="space-y-0"
      onKeyDown={handleKeyDown}
    >
      <div className="relative">
        <PhotoProvider maskOpacity={0.8}>
          {images.map((image, index) => (
            <PhotoView key={`${image.url}-${index}`} src={getRentiqeImageUrl(image.url, 1800)}>
              {index === currentIndex ? (
                <div className="overflow-hidden rounded-lg cursor-zoom-in">
                  <Image
                    src={getRentiqeImageUrl(activeImage.url, 900)}
                    alt={activeAlt}
                    className="w-full h-[280px] object-cover rounded-lg"
                    width={900}
                    height={280}
                    priority
                  />
                </div>
              ) : (
                <span className="hidden" aria-hidden="true" />
              )}
            </PhotoView>
          ))}
        </PhotoProvider>
        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={moveToPrevious}
              aria-label="Prikaži prethodnu sliku"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={moveToNext}
              aria-label="Prikaži sljedeću sliku"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRightIcon className="size-5" />
            </button>
            <p className="sr-only" aria-live="polite">
              Slika {currentIndex + 1} od {images.length}
            </p>
            <ul
              className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2"
              aria-hidden="true"
            >
              {images.map((image, index) => (
                <li key={`${image.url}-${index}`}>
                  <span
                    className={cn(
                      "block size-2.5 rounded-full transition-all",
                      index === currentIndex
                        ? "bg-white scale-110"
                        : "bg-white/55"
                    )}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
