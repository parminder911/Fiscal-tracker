import axios from 'axios';

const BASE_URL = 'https://india-location-hub.in/api';

export async function getStates() {
  try {
    const response = await axios.get(`${BASE_URL}/locations/states`);
    return response.data.data.states;
  } catch (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
}

export async function getDistrictsByStateId(stateId) {
  try {
    const response = await axios.get(`${BASE_URL}/locations/districts`, {
      params: { state_id: stateId }
    });
    return response.data.data.districts;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
}

export async function getPunjabDistricts() {
  try {
    const states = await getStates();
    const punjabState = states.find(state => state.name.toUpperCase() === 'PUNJAB');
    
    if (!punjabState) {
      throw new Error('Punjab state not found');
    }
    
    const districts = await getDistrictsByStateId(punjabState.id);
    return districts;
  } catch (error) {
    console.error('Error fetching Punjab districts:', error);
    throw error;
  }
}
