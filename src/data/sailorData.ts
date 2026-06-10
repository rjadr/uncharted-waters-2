export const sailorSkills = [
  'Celestial Navigation',
  'Accounting',
  'Negotiation',
  'Gunnery',
  'Cartography',
] as const;
export type SailorSkills = typeof sailorSkills[number];

export type Sailor = {
  name: string;
  age: number;
  stats: {
    leadership: number;
    seamanship: number;
    knowledge: number;
    intuition: number;
    courage: number;
    swordplay: number;
    charm: number;
    luck: number;
  };
  navigationLevel: number;
  battleLevel: number;
  skills: SailorSkills[];
};

const sailorData: { [key: string]: Sailor } = {
  '5': {
    name: 'Pietro Conti',
    age: 22,
    stats: {
      leadership: 70,
      seamanship: 68,
      knowledge: 88,
      intuition: 75,
      courage: 70,
      swordplay: 65,
      charm: 80,
      luck: 60,
    },
    navigationLevel: 2,
    battleLevel: 1,
    skills: ['Accounting', 'Negotiation'],
  },
  '2': {
    name: 'Catalina Erantzo',
    age: 21,
    stats: {
      leadership: 82,
      seamanship: 80,
      knowledge: 65,
      intuition: 90,
      courage: 95,
      swordplay: 95,
      charm: 78,
      luck: 65,
    },
    navigationLevel: 3,
    battleLevel: 10,
    skills: ['Gunnery'],
  },
  '3': {
    name: 'Otto Baynes',
    age: 30,
    stats: {
      leadership: 75,
      seamanship: 92,
      knowledge: 95,
      intuition: 80,
      courage: 78,
      swordplay: 72,
      charm: 72,
      luck: 55,
    },
    navigationLevel: 10,
    battleLevel: 3,
    skills: ['Celestial Navigation', 'Cartography'],
  },
  '6': {
    name: 'Ali Vezas',
    age: 25,
    stats: {
      leadership: 75,
      seamanship: 75,
      knowledge: 80,
      intuition: 85,
      courage: 88,
      swordplay: 90,
      charm: 70,
      luck: 60,
    },
    navigationLevel: 4,
    battleLevel: 8,
    skills: ['Negotiation'],
  },
  '4': {
    name: 'Ernst Von Bohr',
    age: 28,
    stats: {
      leadership: 80,
      seamanship: 78,
      knowledge: 90,
      intuition: 78,
      courage: 72,
      swordplay: 80,
      charm: 75,
      luck: 50,
    },
    navigationLevel: 5,
    battleLevel: 5,
    skills: ['Accounting', 'Celestial Navigation'],
  },
  '1': {
    name: 'João Franco',
    age: 18,
    stats: {
      leadership: 78,
      seamanship: 75,
      knowledge: 73,
      intuition: 85,
      courage: 82,
      swordplay: 82,
      charm: 89,
      luck: 50,
    },
    navigationLevel: 1,
    battleLevel: 1,
    skills: ['Negotiation'],
  },
  '32': {
    name: 'Rocco Alemkel',
    age: 65,
    stats: {
      leadership: 75,
      seamanship: 82,
      knowledge: 84,
      intuition: 90,
      courage: 93,
      swordplay: 92,
      charm: 70,
      luck: 70,
    },
    navigationLevel: 30,
    battleLevel: 32,
    skills: ['Celestial Navigation', 'Gunnery'],
  },
  '33': {
    name: 'Enrico Malione',
    age: 24,
    stats: {
      leadership: 66,
      seamanship: 48,
      knowledge: 93,
      intuition: 55,
      courage: 62,
      swordplay: 48,
      charm: 82,
      luck: 100,
    },
    navigationLevel: 1,
    battleLevel: 1,
    skills: ['Accounting'],
  },
};

const getSailor = (id: string) => sailorData[id];

export default getSailor;
