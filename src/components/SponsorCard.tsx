'use client';

import Image from 'next/image';
import { useState } from 'react';
import SponsorDialog from './SponsorDialog';

interface SponsorCardProps {
  id: string;
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
  id,
  name,
  description,
  sponsorImage,
}: SponsorCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="group w-full h-full "
      >
       <div className="rounded-2xl relative aspect-[3/2] overflow-hidden bg-gradient-to-t from-white/60 to-transparent">
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
       </div>
       <h3 className="font-semibold text-white p-4 text-center min-h-[70px]">
          {name}
        </h3>
      </button>

      <SponsorDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        id={id}
        name={name}
        description={description}
        sponsorImage={sponsorImage}
      />
    </>
  );
}
