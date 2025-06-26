'use client';

import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

interface SponsorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  description: string;
  sponsorImage: {
    url: string;
    width: number;
    height: number;
  };
  countdown?: number;
  onDialogInteract?: () => void;
  initialCountdown?: number;
}

export default function SponsorDialog({
  isOpen,
  onClose,
  id,
  name,
  description,
  sponsorImage,
  countdown,
  onDialogInteract,
  initialCountdown = 60000,
}: SponsorDialogProps) {
  const [visible, setVisible] = useState(isOpen);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setVisible(true), 10); // allow for mount
    } else if (visible) {
      setVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 2000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!shouldRender) return null;

  // Create a URL for the sponsor's page by id
  const sponsorPageUrl = `${window.location.origin}/sponsor/${encodeURIComponent(id)}`;

  // Calculate countdown bar width (0-100%)
  const countdownPercent =
    countdown !== undefined && initialCountdown
      ? Math.max(0, Math.min(100, (countdown / initialCountdown) * 100))
      : 0;

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDialogInteract) onDialogInteract();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-4xl backdrop-blur-md rounded-3xl p-8"
        onClick={handleDialogClick}
      >
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
            <div className="mb-4">
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
        {/* Countdown bar at the bottom */}
        {countdown !== undefined && (
          <div className="absolute left-0 bottom-0 w-full h-2 bg-white/20 rounded-b-3xl overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-1000"
              style={{ width: `${countdownPercent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
