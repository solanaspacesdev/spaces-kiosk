import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SponsorFields } from '@/types/SponsorFields';

interface Sponsor {
  id: string;
  fields: SponsorFields;
}

interface CompanyInfo {
  id: string;
  fields: {
    Name: string;
    'Company Description': string;
    'Company Photo': Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getSponsors: builder.query<Sponsor[], void>({
      query: () => 'sponsors',
    }),
    getCompanyInfo: builder.query<CompanyInfo[], void>({
      query: () => 'company',
    }),
  }),
});

export const { useGetSponsorsQuery, useGetCompanyInfoQuery } = api;
