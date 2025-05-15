import { airTableService } from '@/lib/server/services/AirTableService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sponsors = await airTableService.getSponsors();
    return NextResponse.json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
}
