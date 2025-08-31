"use client";

import {
  PhotoProvider as DefaultPhotoProvider,
  PhotoView,
} from "react-photo-view";
import RotateCwIcon from "@/modules/common/icons/rotate-cw";
import ZoomInIcon from "@/modules/common/icons/zoom-in";
import ZoomOutIcon from "@/modules/common/icons/zoom-out";

function PhotoProvider(
  props: React.ComponentProps<typeof DefaultPhotoProvider>
) {
  return (
    <DefaultPhotoProvider
      toolbarRender={({ rotate, onRotate, scale, onScale }) => {
        return (
          <>
            <button
              onClick={() => onScale(scale + 1)}
              className="cursor-pointer text-white/70 transition-colors hover:text-white mr-3.5"
              title="Povećaj sliku"
              aria-label="Povećaj sliku"
            >
              <ZoomInIcon className="size-5" />
            </button>
            <button
              onClick={() => onScale(scale - 1)}
              className="cursor-pointer text-white/70 transition-colors hover:text-white mr-3.5"
              title="Smanji sliku"
              aria-label="Smanji sliku"
            >
              <ZoomOutIcon className="size-5" />
            </button>
            <button
              onClick={() => onRotate(rotate + 90)}
              className="cursor-pointer text-white/70 transition-colors hover:text-white"
              title="Rotiraj sliku"
              aria-label="Rotiraj sliku"
            >
              <RotateCwIcon className="size-5" />
            </button>
          </>
        );
      }}
      {...props}
    />
  );
}

export { PhotoProvider, PhotoView };
