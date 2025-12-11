import { mockVillages, calculateDistrictSummary } from '@/data/mockData';

export async function GET(request) {
  try {
    const summary = calculateDistrictSummary(mockVillages);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...summary,
          timestamp: new Date().toISOString(),
          message: `Total funds allocated this month: ₹${(summary.totalAllocated / 10000000).toFixed(2)} crore. Largest allocation: School Building project. Projects at risk: ${summary.statusCount['At Risk']}`
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Summary fetch error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch summary' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
