import Image from "next/image";
import Link from "next/link";
import { AIRTABLE_PAT } from "@/lib/server/constants";
import { airTableService } from "@/lib/server/services/AirTableService";

interface SponsorFields {
  Description: string;
  "Web URL": string;
  "Socials URL": string;
  "Sponsor Image": Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

export default async function SponsorPage({
  params,
}: {
  params: { name: string };
}) {
  if (!AIRTABLE_PAT) {
    throw new Error("Airtable API key is not configured");
  }

  const records = await airTableService.getSponsor(params.name);
  if (records.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-white">Sponsor not found</h1>
      </div>
    );
  }

  const sponsor = records[0];
  const fields = sponsor.fields as unknown as SponsorFields;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square relative rounded-2xl overflow-hidden">
              <Image
                src={fields["Sponsor Image"][0].url}
                alt={params.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white mb-4">{params.name}</h1>
              <p className="text-lg text-white/80 mb-8">{fields.Description}</p>

              <div className="flex flex-col gap-4 mt-auto">
                <Link
                  href={fields["Web URL"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  <span>Visit Website</span>
                </Link>

                <Link
                  href={fields["Socials URL"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                  <span>Follow on X</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}