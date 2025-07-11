'use client';

import Image from 'next/image';
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
  onSelect: (id: string | null) => void;
  isSelected: boolean;
  countdown?: number;
  onDialogInteract?: () => void;
  initialCountdown?: number;
}

export default function SponsorCard({
  id,
  name,
  description,
  sponsorImage,
  onSelect,
  isSelected,
  countdown,
  onDialogInteract,
  initialCountdown,
}: SponsorCardProps) {
  const handleSelect = () => {
    onSelect(id);
    if (onDialogInteract) onDialogInteract();
  };

  return (
    <>
      <button onClick={handleSelect} className="group w-full h-full ">
        <div className="rounded-2xl relative aspect-[3/2] overflow-hidden">
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
        isOpen={isSelected}
        onClose={() => {
          onSelect(null);
          if (onDialogInteract) onDialogInteract();
        }}
        id={id}
        name={name}
        description={description}
        sponsorImage={sponsorImage}
        countdown={countdown}
        onDialogInteract={onDialogInteract}
        initialCountdown={initialCountdown}
      />
    </>
  );
}
