'use client';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import SponsorCard from './SponsorCard';
import { useGetSponsorsQuery } from '@/lib/store/sponsorsApi';
import RefreshCountdown from './RefreshCountdown';

const REFRESH_INTERVAL = 30000; // 30 seconds

export default function SponsorList() {
  const { data: sponsors, isLoading, error, refetch } = useGetSponsorsQuery();

  if (isLoading) {
    return <div className="text-center text-white">Loading sponsors...</div>;
  }

  if (error) {
    return <div className="text-center text-white">Error loading sponsors</div>;
  }

  if (!sponsors?.length) {
    return <div className="text-center text-white">No sponsors found</div>;
  }

  return (
    <>
      <SimpleBar className="w-full max-w-7xl h-[calc(100vh-400px)]" autoHide={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full px-4">
          {sponsors.map((sponsor) => {
            const fields = sponsor.fields;
            if (!fields['Sponsor Image']?.[0]) return null;

            return (
              <div key={sponsor.id} className="w-full h-[300px]">
                <SponsorCard
                  name={fields.Name}
                  description={fields.Description}
                  webUrl={fields['Web URL']}
                  socialsUrl={fields['Socials URL']}
                  sponsorImage={fields['Sponsor Image'][0]}
                />
              </div>
            );
          })}
        </div>
      </SimpleBar>
      <RefreshCountdown interval={REFRESH_INTERVAL} onRefresh={refetch} size="lg" />
    </>
  );
}
