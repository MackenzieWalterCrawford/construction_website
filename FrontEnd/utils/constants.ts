// NYC coordinates and map settings
export const NYC_CENTER: [number, number] = [40.7128, -73.9360];
export const NYC_BOUNDS: [[number, number], [number, number]] = [
  [40.4774, -74.2591], // Southwest
  [40.9176, -73.7004]  // Northeast
];

export const MAP_CONFIG = {
  defaultZoom: 11,
  minZoom: 9,
  maxZoom: 18,
} as const;

export const CONSTRUCTION_TYPES: Record<string, string> = {
  'A1': 'New Building',
  'A2': 'Addition',
  'A3': 'Alteration',
  'DM': 'Demolition',
  'NB': 'New Building',
  'OT': 'Other',
};

export const NYC_BOROUGHS: Record<string, string> = {
  'MANHATTAN': 'Manhattan',
  'BROOKLYN': 'Brooklyn', 
  'QUEENS': 'Queens',
  'BRONX': 'Bronx',
  'STATEN ISLAND': 'Staten Island',
};