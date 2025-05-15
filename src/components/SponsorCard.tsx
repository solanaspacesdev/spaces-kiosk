'use client';

import Image from 'next/image';
import { useState } from 'react';
import SponsorDialog from './SponsorDialog';

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

export default function SponsorCard({
  name,
  description,
  sponsorImage,
}: SponsorCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="group w-full h-full"
      >
       <div className="rounded-2xl relative aspect-[3/2] overflow-hidden hover:scale-105 transition-transform duration-300">
       <div className="absolute inset-8 flex flex-col items-center justify-center z-20 object-contain">
          <Image
            src={sponsorImage.url}
            alt={name}
            width={sponsorImage.width}
            height={sponsorImage.height}
            className="rounded-2xl max-w-2/3"
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent z-10" />
       </div>
       <h3 className="font-semibold text-white p-4 text-center">
          {name}
        </h3>
      </button>

      <SponsorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        name={name}
        description={description}
        sponsorImage={sponsorImage}
      />
    </>
  );
}
