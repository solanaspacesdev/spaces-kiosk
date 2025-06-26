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
  const [mode, setMode] = useState<
    'activity' | 'dialog' | 'pendingAutoAdvance'
  >('activity');
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<'user' | 'auto' | null>(null);
  const [dialogInteracted, setDialogInteracted] = useState(false);
  const [countdown, setCountdown] = useState<number>(ACTIVITY_INTERVAL);
  const [initialCountdown, setInitialCountdown] =
    useState<number>(ACTIVITY_INTERVAL);
  const [lastSponsorId, setLastSponsorId] = useState<string | null>(null);
  const selectedSponsorIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedSponsorIdRef.current = selectedSponsorId;
  }, [selectedSponsorId]);

  // Helper to pick a random sponsor (not the last shown one)
  const pickRandomSponsor = useCallback(() => {
    if (!sponsors || sponsors.length === 0) return null;
    let available = sponsors;
    if (lastSponsorId && sponsors.length > 1) {
      available = sponsors.filter((s) => s.id !== lastSponsorId);
    }
    if (available.length === 0) return null;
    const random = available[Math.floor(Math.random() * available.length)];
    return random.id;
  }, [sponsors, lastSponsorId]);

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

  // State machine for timer transitions
  useEffect(() => {
    if (!sponsors || sponsors.length === 0) return;
    if (countdown > 0) return;

    if (mode === 'activity') {
      // Activity timer expired, open random dialog (auto mode)
      const nextId = pickRandomSponsor();
      if (nextId) {
        setSelectedSponsorId(nextId);
        setDialogMode('auto');
        setDialogInteracted(false);
        setCountdown(DIALOG_INTERVAL);
        setInitialCountdown(DIALOG_INTERVAL);
        setMode('dialog');
        console.log(
          '[SponsorList] No user activity, opening dialog automatically:',
          nextId
        );
      } else {
        // No sponsor to show, restart activity timer
        setCountdown(ACTIVITY_INTERVAL);
        setInitialCountdown(ACTIVITY_INTERVAL);
        setMode('activity');
        console.log(
          '[SponsorList] No sponsor available, restarting activity timer.'
        );
      }
      return;
    }

    if (mode === 'dialog') {
      if (
        dialogMode === 'user' ||
        (dialogMode === 'auto' && dialogInteracted)
      ) {
        // Close dialog, start activity timer
        setLastSponsorId(selectedSponsorId);
        setSelectedSponsorId(null);
        setDialogMode(null);
        setDialogInteracted(false);
        setCountdown(ACTIVITY_INTERVAL);
        setInitialCountdown(ACTIVITY_INTERVAL);
        setMode('activity');
        console.log(
          '[SponsorList] Dialog auto-closed, resuming activity timer.'
        );
      } else if (dialogMode === 'auto' && !dialogInteracted) {
        // Auto-advance to next dialog, but wait for fade-out
        setLastSponsorId(selectedSponsorId);
        setSelectedSponsorId(null);
        setDialogMode(null);
        setDialogInteracted(false);
        setCountdown(ACTIVITY_INTERVAL); // temporary, will be replaced
        setInitialCountdown(ACTIVITY_INTERVAL);
        setMode('pendingAutoAdvance');
        console.log(
          '[SponsorList] Dialog auto-advancing, will open next after fade-out.'
        );
      }
      return;
    }

    if (mode === 'pendingAutoAdvance') {
      // After fade-out, open next dialog or fall back to activity
      const nextId = pickRandomSponsor();
      if (nextId) {
        setSelectedSponsorId(nextId);
        setDialogMode('auto');
        setDialogInteracted(false);
        setCountdown(DIALOG_INTERVAL);
        setInitialCountdown(DIALOG_INTERVAL);
        setMode('dialog');
        console.log(
          '[SponsorList] Auto-advance: opening next dialog after fade-out:',
          nextId
        );
      } else {
        setCountdown(ACTIVITY_INTERVAL);
        setInitialCountdown(ACTIVITY_INTERVAL);
        setMode('activity');
        console.log(
          '[SponsorList] No available sponsor to auto-advance, resuming activity timer.'
        );
      }
      return;
    }
  }, [
    countdown,
    mode,
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
        setMode('activity');
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
      setMode('dialog');
      console.log('[SponsorList] User opened dialog:', id);
    } else {
      setLastSponsorId(selectedSponsorId);
      setSelectedSponsorId(null);
      setDialogMode(null);
      setDialogInteracted(false);
      setCountdown(ACTIVITY_INTERVAL);
      setInitialCountdown(ACTIVITY_INTERVAL);
      setMode('activity');
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
