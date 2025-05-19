'use client';

import CompanyInfo from "../CompanyInfo";
import SolanaSpacesLogo from "../SolanaSpacesLogo";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import SponsorList from "../SponsorList";

export default function HomeView() {
  return <SimpleBar className="w-full max-w-7xl" autoHide={true}>
   <div className="flex flex-col items-center py-12 px-4">
      <div className="flex flex-col items-center mb-12">
        <SolanaSpacesLogo className="max-w-full w-[600px] h-[200px] mb-8 px-5" />
        <CompanyInfo />
      </div>

      <div>
        <h1 className="text-center mb-6">Partners</h1>
      </div>
      <SponsorList />
    </div>
  </SimpleBar>
}
