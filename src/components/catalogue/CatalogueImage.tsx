import Image, { type ImageProps } from "next/image";

/**
 * next/image for catalogue images, which come from the API: renders nothing
 * when a product or category has no image yet (the frame keeps its subtle
 * background), and serves https URLs as-is since they are not on this site.
 */
export function CatalogueImage({ src, alt, ...props }: Omit<ImageProps, "src"> & { src: string | null | undefined }) {
  if (!src) return null;
  const external = /^https?:\/\//i.test(src);
  return <Image src={src} alt={alt} unoptimized={external} {...props} />;
}
