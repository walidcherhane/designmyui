import Image from "next/image";
import React from "react";

type Props = {
  classNames?: string;
  src?: string | null;
  alt?: string;
  size: number;
  radius?: number;
};

function Avatar({ classNames, alt, src, size, radius }: Props) {
  const imageSrc =
    src || "https://ik.imagekit.io/buw7k7rvw40/avatar_p0Wyeh2b_.svg";
  return (
    <div className={classNames}>
      <Image
        quality={100}
        src={imageSrc}
        className={`h-full w-full object-cover object-center overflow-hidden `}
        alt={alt}
        priority={true}
        width={size}
        height={size}
        style={{
          borderRadius: radius || size / 2,
        }}
      />
    </div>
  );
}

export default Avatar;
