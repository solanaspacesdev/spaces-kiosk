'use client';

import SponsorCard from './SponsorCard';
import { useGetSponsorsQuery } from '@/lib/store/sponsorsApi';
import { useState, useEffect, useRef, useCallback } from 'react';
import PointerIcon from './icons/PointerIcon';

// const DIALOG_INTERVAL = 60000; // 60 seconds
// const ACTIVITY_INTERVAL = 300000; // 5 minutes
const DIALOG_INTERVAL = 30000;
const ACTIVITY_INTERVAL = 30000;

export default function SponsorList() {
  const { data: sponsors, isLoading, error } = useGetSponsorsQuery();
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<'user' | 'auto' | null>(null);
  const [dialogInteracted, setDialogInteracted] = useState(false);
  const [countdown, setCountdown] = useState<number>(ACTIVITY_INTERVAL);
  const [initialCountdown, setInitialCountdown] =
    useState<number>(ACTIVITY_INTERVAL);
  const selectedSponsorIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedSponsorIdRef.current = selectedSponsorId;
  }, [selectedSponsorId]);

  // Helper to pick a random sponsor (not the current one)
  const pickRandomSponsor = useCallback(() => {
    if (!sponsors || sponsors.length === 0) return null;
    let available = sponsors;
    const currentId = selectedSponsorIdRef.current;
    if (currentId && sponsors.length > 1) {
      available = sponsors.filter((s) => s.id !== currentId);
    }
    const random = available[Math.floor(Math.random() * available.length)];
    return random.id;
  }, [sponsors]);

  // Main timer/logic interval
  useEffect(() => {
    if (!sponsors || sponsors.length === 0) return;
    let interval: NodeJS.Timeout | null = null;
    interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 100) return 0;
        return prev - 100;
      });
    }, 100);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sponsors]);

  // Handle transitions when countdown reaches 0
  useEffect(() => {
    if (!sponsors || sponsors.length === 0) return;
    if (countdown > 0) return;

    if (!selectedSponsorId) {
      // Activity timer expired, open random dialog (auto mode)
      const nextId = pickRandomSponsor();
      if (nextId) {
        setSelectedSponsorId(nextId);
        setDialogMode('auto');
        setDialogInteracted(false);
        setCountdown(DIALOG_INTERVAL);
        setInitialCountdown(DIALOG_INTERVAL);
        console.log(
          '[SponsorList] No user activity, opening dialog automatically:',
          nextId
        );
      }
      return;
    }

    // Dialog timer expired
    if (dialogMode === 'user' || (dialogMode === 'auto' && dialogInteracted)) {
      // Close dialog, start activity timer
      setSelectedSponsorId(null);
      setDialogMode(null);
      setDialogInteracted(false);
      setCountdown(ACTIVITY_INTERVAL);
      setInitialCountdown(ACTIVITY_INTERVAL);
      console.log('[SponsorList] Dialog auto-closed, resuming activity timer.');
    } else if (dialogMode === 'auto' && !dialogInteracted) {
      // Auto-advance to next dialog
      const nextId = pickRandomSponsor();
      if (nextId) {
        setSelectedSponsorId(nextId);
        setDialogMode('auto');
        setDialogInteracted(false);
        setCountdown(DIALOG_INTERVAL);
        setInitialCountdown(DIALOG_INTERVAL);
        console.log('[SponsorList] Auto-advancing to next dialog:', nextId);
      }
    }
  }, [
    countdown,
    dialogMode,
    dialogInteracted,
    selectedSponsorId,
    pickRandomSponsor,
    sponsors,
  ]);

  // Scroll resets activity timer if dialog is not open
  useEffect(() => {
    const handleScroll = () => {
      if (!selectedSponsorId) {
        setCountdown(ACTIVITY_INTERVAL);
        setInitialCountdown(ACTIVITY_INTERVAL);
        console.log('[SponsorList] Activity timer reset on scroll.');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedSponsorId]);

  // User opens dialog
  const handleSelect = (id: string | null) => {
    if (id) {
      setSelectedSponsorId(id);
      setDialogMode('user');
      setDialogInteracted(false);
      setCountdown(DIALOG_INTERVAL);
      setInitialCountdown(DIALOG_INTERVAL);
      console.log('[SponsorList] User opened dialog:', id);
    } else {
      setSelectedSponsorId(null);
      setDialogMode(null);
      setDialogInteracted(false);
      setCountdown(ACTIVITY_INTERVAL);
      setInitialCountdown(ACTIVITY_INTERVAL);
      console.log('[SponsorList] Dialog closed by user.');
    }
  };

  // User interacts with dialog (click, etc.)
  const handleDialogInteract = () => {
    if (dialogMode === 'auto') {
      setDialogInteracted(true);
      setCountdown(DIALOG_INTERVAL);
      setInitialCountdown(DIALOG_INTERVAL);
      console.log(
        '[SponsorList] User interacted with auto-opened dialog, will auto-close after timer.'
      );
    } else if (dialogMode === 'user') {
      setCountdown(DIALOG_INTERVAL);
      setInitialCountdown(DIALOG_INTERVAL);
      console.log(
        '[SponsorList] User interacted with user-opened dialog, will auto-close after timer.'
      );
    }
  };

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
        {sponsors.map((sponsor, i) => {
          const fields = sponsor.fields;
          if (!fields['Sponsor Image']?.[0]) return null;

          return (
            <div key={sponsor.id} className="w-full relative">
              {i === 0 && selectedSponsorId == null && (
                <span className="absolute bottom-0 right-0 text-white text-sm inline-block -rotate-45 fade-in-up-right">
                  <PointerIcon />
                </span>
              )}
              <SponsorCard
                id={sponsor.id}
                name={fields.Name}
                description={fields.Description}
                webUrl={fields['Web URL']}
                socialsUrl={fields['Socials URL']}
                sponsorImage={fields['Sponsor Image'][0]}
                onSelect={handleSelect}
                isSelected={selectedSponsorId === sponsor.id}
                countdown={
                  selectedSponsorId === sponsor.id ? countdown : undefined
                }
                initialCountdown={
                  selectedSponsorId === sponsor.id
                    ? initialCountdown
                    : undefined
                }
                onDialogInteract={handleDialogInteract}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
