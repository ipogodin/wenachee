/**
 * Camping site configuration — fill in the numbers before the event.
 * @typedef {{ id: number, name: string, capacity: number | null, amenities: string[], mapX: number, mapY: number, color: string }} CampingSite
 * @type {CampingSite[]}
 */
export const SITES = [
  {
    id: 196,
    name: 'Site 196',
    capacity: null, // fill in
    amenities: ['Fire ring', 'Picnic table', 'Near entrance road', 'Restrooms nearby'],
    mapX: 55.4,
    mapY: 22.9,
    color: '#ff6b35',
  },
  {
    id: 197,
    name: 'Site 197',
    capacity: null, // fill in
    amenities: ['Fire ring', 'Picnic table', 'Swim area nearby', 'Restrooms nearby'],
    mapX: 50.8,
    mapY: 28.1,
    color: '#ffd23f',
  },
  {
    id: 195,
    name: 'Site 195',
    capacity: null, // fill in
    amenities: ['Fire ring', 'Picnic table', 'Swim area nearby', 'Restrooms nearby'],
    mapX: 50.6,
    mapY: 32.5,
    color: '#06d6a0',
  },
  {
    id: 194,
    name: 'Site 194',
    capacity: null, // fill in
    amenities: ['Fire ring', 'Picnic table', 'Swim area nearby', 'Beach access'],
    mapX: 56.4,
    mapY: 32.5,
    color: '#118ab2',
  },
];

export const TOTAL_CAPACITY = 22;
