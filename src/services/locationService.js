const API_BASE_URL = 'https://india-location-hub.in/api';

// Fallback Punjab districts data
const FALLBACK_DISTRICTS = [
  { id: 1, name: 'Amritsar', state: 'Punjab' },
  { id: 2, name: 'Bathinda', state: 'Punjab' },
  { id: 3, name: 'Firozpur', state: 'Punjab' },
  { id: 4, name: 'Faridkot', state: 'Punjab' },
  { id: 5, name: 'Gurdaspur', state: 'Punjab' },
  { id: 6, name: 'Hoshiarpur', state: 'Punjab' },
  { id: 7, name: 'Jalandhar', state: 'Punjab' },
  { id: 8, name: 'Kapurthala', state: 'Punjab' },
  { id: 9, name: 'Ludhiana', state: 'Punjab' },
  { id: 10, name: 'Mansa', state: 'Punjab' },
  { id: 11, name: 'Moga', state: 'Punjab' },
  { id: 12, name: 'Muktsar', state: 'Punjab' },
  { id: 13, name: 'Pathankot', state: 'Punjab' },
  { id: 14, name: 'Patiala', state: 'Punjab' },
  { id: 15, name: 'Rupnagar', state: 'Punjab' },
  { id: 16, name: 'Sangrur', state: 'Punjab' },
  { id: 17, name: 'Shaheed Bhagat Singh Nagar', state: 'Punjab' },
  { id: 18, name: 'Tarn Taran', state: 'Punjab' }
];

// Fallback talukas data
const FALLBACK_TALUKAS = {
  'Amritsar': [
    { id: 1, name: 'Amritsar', district_id: 1 },
    { id: 2, name: 'Ajnala', district_id: 1 },
    { id: 3, name: 'Tarsikka', district_id: 1 }
  ],
  'Ludhiana': [
    { id: 4, name: 'Ludhiana', district_id: 9 },
    { id: 5, name: 'Samrala', district_id: 9 },
    { id: 6, name: 'Khanna', district_id: 9 }
  ],
  'Jalandhar': [
    { id: 7, name: 'Jalandhar', district_id: 7 },
    { id: 8, name: 'Nakodar', district_id: 7 },
    { id: 9, name: 'Shahkot', district_id: 7 }
  ],
  'Patiala': [
    { id: 10, name: 'Patiala', district_id: 14 },
    { id: 11, name: 'Samana', district_id: 14 },
    { id: 12, name: 'Nabha', district_id: 14 }
  ]
};

// Fallback villages data
const FALLBACK_VILLAGES = {
  'Amritsar': [
    { id: 1, name: 'Amritsar City', taluka: 'Amritsar' },
    { id: 2, name: 'Rambagh', taluka: 'Amritsar' },
    { id: 3, name: 'Khalsa', taluka: 'Amritsar' }
  ],
  'Ludhiana': [
    { id: 4, name: 'Ludhiana City', taluka: 'Ludhiana' },
    { id: 5, name: 'Dakha', taluka: 'Ludhiana' },
    { id: 6, name: 'Jagraon', taluka: 'Ludhiana' }
  ],
  'Jalandhar': [
    { id: 7, name: 'Jalandhar City', taluka: 'Jalandhar' },
    { id: 8, name: 'Lohian Khas', taluka: 'Jalandhar' },
    { id: 9, name: 'Phillaur', taluka: 'Jalandhar' }
  ],
  'Patiala': [
    { id: 10, name: 'Patiala City', taluka: 'Patiala' },
    { id: 11, name: 'Samana', taluka: 'Samana' },
    { id: 12, name: 'Nabha', taluka: 'Nabha' }
  ]
};

// Fetch all states
export async function getIndianStates() {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/states`, { timeout: 5000 });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.data?.states || [];
  } catch (error) {
    console.warn('Error fetching states, using fallback:', error);
    return [];
  }
}

// Fetch Punjab districts (first try internal DB API, then data.gov.in fallback, finally hardcoded list)
export async function fetchPunjabDistricts() {
  // Try internal API first
  try {
    const res = await fetch('/api/districts/list');
    if (res.ok) {
      const data = await res.json();
      if (data.districts && data.districts.length > 0) return data.districts;
    }
  } catch (_) {}

  // Fallback to data.gov.in API (villages directory) – extract unique district names
  const API_KEY = '579b464db66ec23bdd00000107a171638a86478478e81d2566c5dd74';
  const url = `https://api.data.gov.in/resource/905bdf64-9799-41b2-965e-b24587ab24c3?api-key=${API_KEY}&format=json&filters[state_name]=PUNJAB&limit=10000&offset=0`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('ext');
    const json = await res.json();
    const unique = [...new Set(json.records.map(r => r.district_name.trim()))].sort();
    return unique.map((name, idx) => ({ id: idx + 1, district_name: name }));
  } catch (error) {
    console.warn('Error fetching Punjab districts, using fallback hardcoded list');
    return [
      { id: 1, district_name: 'Amritsar' },
      { id: 2, district_name: 'Ludhiana' },
      { id: 3, district_name: 'Jalandhar' },
      { id: 4, district_name: 'Patiala' }
    ];
  }
}

// Fetch talukas/tehsils for a district
export async function getDistrictTalukas(districtId) {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/talukas?district_id=${districtId}`, { timeout: 5000 });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    const talukas = data.data?.talukas || [];
    if (talukas.length > 0) return talukas;
    
    // Try to find fallback by district name
    const district = FALLBACK_DISTRICTS.find(d => d.id === districtId);
    return district ? (FALLBACK_TALUKAS[district.name] || []) : [];
  } catch (error) {
    console.warn('Error fetching talukas, using fallback:', error);
    const district = FALLBACK_DISTRICTS.find(d => d.id === districtId);
    return district ? (FALLBACK_TALUKAS[district.name] || []) : [];
  }
}

// Fetch villages for a taluka
export async function getTalukaVillages(state, district, taluka) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/locations/villages?state=${state}&district=${district}&taluka=${taluka}`,
      { timeout: 5000 }
    );
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    const villages = data.data?.villages || [];
    return villages.length > 0 ? villages : (FALLBACK_VILLAGES[district] || []);
  } catch (error) {
    console.warn('Error fetching villages, using fallback:', error);
    return FALLBACK_VILLAGES[district] || [];
  }
}

// Search locations by name
export async function searchLocations(query, limit = 50) {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${query}&limit=${limit}`, { timeout: 5000 });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.warn('Error searching locations:', error);
    return [];
  }
}
