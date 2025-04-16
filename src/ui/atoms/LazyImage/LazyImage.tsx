import { headers } from "next/headers";
import Image from "next/image";
import type { HTMLAttributes } from "react";
import React from "react";

interface LazyImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const LazyImage: React.FC<LazyImageProps> = async ({ src, width, height, alt, ...props }) => {
  const headersGetter = headers();
  const currentHost = headersGetter.get("x-host");
  const imageBlur = await fetch(`${currentHost}/assets/imgs/icons/cricap.png`).then(async (res) => {
    return Buffer.from(await res.arrayBuffer()).toString("base64");
  });
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      placeholder="blur"
      blurDataURL={`data:image/png;base64,${imageBlur}`}
      {...props}
    />
  );
};
export default LazyImage;
