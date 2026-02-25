const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as
  | string
  | undefined;

export default function getRentiqeImageUrl(
  src: string,
  width: number,
  quality?: number,
) {
  if (src.includes("_next")) return src;
  if (src.startsWith("http")) return src;

  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
  let url = src.startsWith("/") ? src : `/${src}`;

  if (
    url.includes("stores") ||
    url.includes("categories") ||
    url.includes("avatar")
  ) {
    if (url.endsWith(".webp")) url = `${url}.webp`;

    if (!cloudinaryCloudName) {
      return url;
    }

    return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${params.join(
      ",",
    )}${url}`;
  }

  return url;
}
