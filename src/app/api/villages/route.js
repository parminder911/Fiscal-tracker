import { mockVillages, calculateDistrictSummary } from '@/data/mockData';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const villageId = searchParams.get('id');

    if (villageId) {
      const village = mockVillages.find(v => v.id === parseInt(villageId));
      if (!village) {
        return new Response(
          JSON.stringify({ error: 'Village not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ success: true, data: village }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: mockVillages }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Villages fetch error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch villages' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
