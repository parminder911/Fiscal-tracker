import csc from 'country-state-city';

export function getIndianStates() {
  try {
    const states = csc.State.getAllStates();
    const indianStates = states.filter(state => state.countryCode === 'IN');
    return indianStates;
  } catch (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
}

export function getPunjabDistricts() {
  try {
    const states = csc.State.getAllStates();
    const punjabState = states.find(
      state => state.countryCode === 'IN' && state.name === 'Punjab'
    );
    
    if (!punjabState) {
      throw new Error('Punjab state not found');
    }
    
    const cities = csc.City.getCitiesByStateCode('IN', punjabState.isoCode);
    return cities || [];
  } catch (error) {
    console.error('Error fetching Punjab districts:', error);
    throw error;
  }
}

export function getStateByCode(countryCode, stateCode) {
  try {
    const state = csc.State.getStateByCodeAndCountry(stateCode, countryCode);
    return state;
  } catch (error) {
    console.error('Error fetching state:', error);
    throw error;
  }
}
