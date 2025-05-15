'use client';

import { useGetCompanyInfoQuery } from '@/lib/store/sponsorsApi';
import { useState } from 'react';
import Image from 'next/image';

export default function CompanyInfo() {
  const { data: companyInfo, isLoading } = useGetCompanyInfoQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading || !companyInfo?.[0]) {
    return null;
  }

  const { fields } = companyInfo[0];
  const description = fields['Company Description'];
  const photo = fields['Company Photo']?.[0];

  return (
    <>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-white/80 text-lg mb-4 line-clamp-2">{description}</p>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="text-white/60 hover:text-white transition-colors text-sm"
        >
          Read more
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold text-white">Solana Spaces</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
            </div>

            {photo && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                <Image
                  src={photo.url}
                  alt="Company"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}

            <p className="text-white/80 text-lg whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
