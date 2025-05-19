'use client';


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
    <div className="grid grid-cols-2 gap-x-8 w-full px-4">
          {sponsors.map((sponsor) => {
            const fields = sponsor.fields;
            if (!fields['Sponsor Image']?.[0]) return null;

            return (
              <div key={sponsor.id} className="w-full">
                <SponsorCard
                  id={sponsor.id}
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

      <RefreshCountdown interval={REFRESH_INTERVAL} onRefresh={refetch} size="lg" />
    </>
  );
}
