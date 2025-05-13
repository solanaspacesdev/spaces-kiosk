import Image from "next/image";
import Link from "next/link";

interface SponsorCardProps {
  name: string;
  description: string;
  webUrl: string;
  socialsUrl: string;
  sponsorImage: {
    url: string;
    width: number;
    height: number;
  };
}

export default function SponsorCard({ name, description, webUrl, socialsUrl, sponsorImage }: SponsorCardProps) {
  return (
    <div className="relative group bg-white/10 backdrop-blur-sm rounded-3xl p-4 hover:bg-white/20 transition-all duration-300">
      <div className="aspect-[3/2] relative mb-4 rounded-lg overflow-hidden">
        <Image
          src={sponsorImage.url}
          alt={description}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <h3 className="text-lg font-medium text-white mb-4">{name}</h3>
    
      <p className="text-sm text-white/80 mb-4">{description}</p>
      
      <div className="flex justify-center gap-4">
        <Link 
          href={webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </Link>
        
        <Link 
          href={socialsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
          </svg>
        </Link>
      </div>
    </div>
  );
} 