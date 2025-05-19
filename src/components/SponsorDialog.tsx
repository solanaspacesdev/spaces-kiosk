'use client';

import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

interface SponsorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  description: string;
  sponsorImage: {
    url: string;
    width: number;
    height: number;
  };
}

export default function SponsorDialog({
  isOpen,
  onClose,
  name,
  description,
  sponsorImage,
}: SponsorDialogProps) {
  if (!isOpen) return null;

  // Create a URL for the sponsor's page
  const sponsorPageUrl = `${window.location.origin}/sponsor/${encodeURIComponent(name)}`;

  console.log('sponsorPageUrl', sponsorPageUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl backdrop-blur-md rounded-3xl p-8">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center gap-8 w-full">
          <div className="grid grid-cols-2 items-center justify-center gap-4 w-full">
            <div className='mb-4'>
              <Image
                src={sponsorImage.url}
                alt={name}
                width={sponsorImage.width}
                height={sponsorImage.height}
                className="object-contain max-w-2/3 rounded-2xl"
                sizes="(max-width: 768px) 100vw, (min-width: 300px) 50vw"
              />
            </div>
            <div className="col-span-2 max-h-[300px] overflow-y-auto">
                <h1 className="text-3xl font-semibold text-white mb-4">{name}</h1>
                <p className="text-lg text-white/80 mb-8">{description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="col-span-1 flex items-center justify-center">

              <div className="bg-white p-4 rounded-2xl inline-block">
                <QRCodeSVG
                  value={sponsorPageUrl}
                  size={150}
                  level="H"
                  className="w-full h-full"
                />
              </div>
              <p className="text-white/60 text-sm text-center mt-4 px-6">
                Scan with your phone to learn more
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
