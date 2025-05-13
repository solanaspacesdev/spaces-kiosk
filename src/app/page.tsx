import SolanaSpacesLogo from "@/components/SolanaSpacesLogo";
import SponsorCard from "@/components/SponsorCard";
import { AIRTABLE_PAT } from "@/lib/server/constants";
import { airTableService } from "@/lib/server/services/AirTableService";
import { SponsorFields } from "@/types/SponsorFields";



export default async function Home() {
  if (!AIRTABLE_PAT) {
    throw new Error("Airtable API key is not configured");
  }

  const sponsors = await airTableService.getSponsors();

  return (
    <div className="flex flex-col items-center py-12 px-4 overflow-y-auto">
      <SolanaSpacesLogo className="max-w-full w-[600px] h-[200px] mb-12 px-5" />
      
      <div>
        {sponsors.length > 0 && <h2 className="text-center mb-14">Sponsors</h2>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {sponsors.map((sponsor) => {
          const fields = sponsor.fields as unknown as SponsorFields;
          if (!fields["Sponsor Image"]?.[0]) return null;
          
          return (
            <SponsorCard
              key={sponsor.id}
              name={fields.Name}
              description={fields.Description}
              webUrl={fields["Web URL"]}
              socialsUrl={fields["Socials URL"]}
              sponsorImage={fields["Sponsor Image"][0]}
            />
          );
        })}
      </div>
    </div>
  );
}
