import { NextResponse } from 'next/server';
import { getAllDeals, searchDeals } from '@/lib/services/dealService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const deals = query
      ? await searchDeals(query)
      : await getAllDeals();

    return NextResponse.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}