'use client';

import SponsorCard from './SponsorCard';
import { useGetSponsorsQuery } from '@/lib/store/sponsorsApi';
import RefreshCountdown from './RefreshCountdown';
import { useState, useEffect, useRef, useCallback } from 'react';

const REFRESH_INTERVAL = 30000; // 30 seconds
const DIALOG_INTERVAL = 60000; // 60 seconds
const RESET_INTERVAL = 300000; // 5 minutes

export default function SponsorList() {
  const { data: sponsors, isLoading, error, refetch } = useGetSponsorsQuery();
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(
    null
  );
  const [countdown, setCountdown] = useState(DIALOG_INTERVAL);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const selectedSponsorIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedSponsorIdRef.current = selectedSponsorId;
  }, [selectedSponsorId]);

  // Helper to pick a random sponsor (not the current one)
  const pickRandomSponsor = useCallback(() => {
    if (!sponsors || sponsors.length === 0) return;
    let available = sponsors;
    const currentId = selectedSponsorIdRef.current;
    if (currentId && sponsors.length > 1) {
      available = sponsors.filter((s) => s.id !== currentId);
    }
    const random = available[Math.floor(Math.random() * available.length)];
    setSelectedSponsorId(random.id);
    console.log(
      '[SponsorList] Dialog opened automatically for sponsor:',
      random.id
    );
  }, [sponsors]);

  // Timer logic
  useEffect(() => {
    if (!sponsors || sponsors.length === 0) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCountdown(DIALOG_INTERVAL);

    // Countdown bar interval
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1000) return 0;
        return prev - 1000;
      });
    }, 1000);

    // Dialog open timer
    timerRef.current = setTimeout(() => {
      console.log(
        '[SponsorList] Timer elapsed (60s), opening dialog automatically.'
      );
      pickRandomSponsor();
    }, DIALOG_INTERVAL);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedSponsorId, sponsors, pickRandomSponsor]);

  // Reset timer to 5 minutes on interaction
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCountdown(RESET_INTERVAL);

    // Countdown bar interval
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1000) return 0;
        return prev - 1000;
      });
    }, 1000);

    timerRef.current = setTimeout(() => {
      console.log(
        '[SponsorList] Timer elapsed (5min after interaction), opening dialog automatically.'
      );
      pickRandomSponsor();
    }, RESET_INTERVAL);
  }, [pickRandomSponsor]);

  // Log timer statuses every 10 seconds
  useEffect(() => {
    const logInterval = setInterval(() => {
      console.log('[SponsorList Timer Status]', {
        selectedSponsorId,
        countdown,
        dialogTimerRemaining: timerRef.current ? 'active' : 'inactive',
      });
    }, 10000);
    return () => clearInterval(logInterval);
  }, [selectedSponsorId, countdown]);

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
                onSelect={(id) => {
                  setSelectedSponsorId(id);
                  resetTimer();
                }}
                isSelected={selectedSponsorId === sponsor.id}
                countdown={
                  selectedSponsorId === sponsor.id ? countdown : undefined
                }
                onDialogInteract={resetTimer}
              />
            </div>
          );
        })}
      </div>

      <RefreshCountdown
        interval={REFRESH_INTERVAL}
        onRefresh={refetch}
        size="lg"
      />
    </>
  );
}
