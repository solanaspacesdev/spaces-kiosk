import SolanaSpacesLogo from '@/components/SolanaSpacesLogo';
import SponsorList from '@/components/SponsorList';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Only show full page if mode === 'kiosk'
  const { mode } = await searchParams;
  const isKiosk = mode === 'kiosk';

  if (!isKiosk) {
    return (
      <div className="flex flex-col items-center py-12 px-4 overflow-y-auto">
        <SolanaSpacesLogo className="max-w-full w-[600px] h-[200px] mb-12 px-5" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen py-12 px-4">
      <SolanaSpacesLogo className="max-w-full w-[600px] h-[200px] mb-12 px-5" />

      <div>
        <h2 className="text-center mb-14">Sponsors</h2>
      </div>
      <SponsorList />
    </div>
  );
}
