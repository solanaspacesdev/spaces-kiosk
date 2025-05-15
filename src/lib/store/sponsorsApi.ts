import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SponsorFields } from '@/types/SponsorFields';

interface Sponsor {
  id: string;
  fields: SponsorFields;
}

export const sponsorsApi = createApi({
  reducerPath: 'sponsorsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getSponsors: builder.query<Sponsor[], void>({
      query: () => 'sponsors',
      pollingInterval: 30000, // 30 seconds
    }),
  }),
});

export const { useGetSponsorsQuery } = sponsorsApi;
