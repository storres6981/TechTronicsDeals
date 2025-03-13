import { NextResponse } from 'next/server';
import { syncDeals } from '@/lib/services/dealService';

export async function POST() {
  try {
    await syncDeals();
    return NextResponse.json({ message: 'Deals synced successfully' });
  } catch (error) {
    console.error('Error syncing deals:', error);
    return NextResponse.json(
      { error: 'Failed to sync deals' },
      { status: 500 }
    );
  }
}