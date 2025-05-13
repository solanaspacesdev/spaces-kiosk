export interface SponsorFields {
  Name: string;
  Description: string;
  'Web URL': string;
  'Socials URL': string;
  'Sponsor Image': Array<{
    url: string;
    width: number;
    height: number;
  }>;
}
