"use client";

import Image from "next/image";
import { useState } from "react";
import SponsorDialog from "./SponsorDialog";

interface SponsorCardProps {
  name: string;
  description: string;
  webUrl: string;
  socialsUrl: string;
  sponsorImage: {
    url: string;
    width: number;
    height: number;
  };
}

export default function SponsorCard({ name, description, webUrl, socialsUrl, sponsorImage }: SponsorCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="group relative w-full aspect-[3/2] rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
      >
        <Image
          src={sponsorImage.url}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">{name}</h3>
      </button>

      <SponsorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        name={name}
        description={description}
        webUrl={webUrl}
        socialsUrl={socialsUrl}
        sponsorImage={sponsorImage}
      />
    </>
  );
} 