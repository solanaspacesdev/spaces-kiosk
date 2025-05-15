import { airTableService } from '@/lib/server/services/AirTableService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const companyInfo = await airTableService.getCompanyInfo();
    return NextResponse.json(companyInfo);
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company info' },
      { status: 500 }
    );
  }
}
