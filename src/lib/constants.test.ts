import * as constants from './constants';

describe('constants', () => {
  it('exports all expected constant objects', () => {
    expect(constants.TRANSPORT_FACTORS).toBeDefined();
    expect(constants.GRID_EMISSION_FACTOR).toBeDefined();
    expect(constants.AC_POWER_KW).toBeDefined();
    expect(constants.APPLIANCE_MULTIPLIERS).toBeDefined();
    expect(constants.DIET_BASE_EMISSIONS).toBeDefined();
    expect(constants.MEAT_MEAL_FACTOR).toBeDefined();
    expect(constants.FOOD_WASTE_MULTIPLIERS).toBeDefined();
    expect(constants.FLIGHT_EMISSIONS_PER_TRIP).toBeDefined();
    expect(constants.SHOPPING_EMISSIONS).toBeDefined();
    expect(constants.RECYCLING_OFFSETS).toBeDefined();
    expect(constants.ECO_LEVELS).toBeDefined();
  });
});
