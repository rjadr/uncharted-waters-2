// The six playable captains of Uncharted Waters 2: New Horizons.
// Starting conditions sourced from DATA1.015 binary analysis and game documentation.

export interface CaptainConfig {
  sailorId: string;      // references sailorData.ts
  firstName: string;
  lastName: string;
  nationality: string;
  startingPortId: string;
  startingGold: number;
  goal: string;
  description: string;
  stats: {
    navigation: number;
    combat: number;
    intuition: number;
    endurance: number;
    rhetoric: number;
    art: number;
    sword: number;
  };
}

// Captain IDs match the order in the original game's captain select screen.
export const captainData: Record<string, CaptainConfig> = {
  '1': {
    sailorId: '1',
    firstName: 'João',
    lastName: 'Franco',
    nationality: 'Portuguese',
    startingPortId: '1', // Lisbon
    startingGold: 0,     // receives gold through intro quests
    goal: 'Uncover the secret of Atlantis',
    description:
      'Son of a Portuguese duke. Young and inexperienced but intuitive. ' +
      'Begins with nothing but his father\'s blessing and Rocco\'s guidance.',
    stats: { navigation: 78, combat: 75, intuition: 85, endurance: 73, rhetoric: 82, art: 82, sword: 89 },
  },
  '2': {
    sailorId: '2',
    firstName: 'Catalina',
    lastName: 'Erantzo',
    nationality: 'Spanish',
    startingPortId: '2', // Seville
    startingGold: 1500,
    goal: 'Avenge your brother and become a feared pirate',
    description:
      'A fierce Spanish privateer. Her brother was killed by a Portuguese ' +
      'admiral — she sails under the Spanish crown, hunting enemies on the high seas.',
    stats: { navigation: 80, combat: 190, intuition: 170, endurance: 65, rhetoric: 86, art: 92, sword: 95 },
  },
  '3': {
    sailorId: '3',
    firstName: 'Otto',
    lastName: 'Baynes',
    nationality: 'English',
    startingPortId: '30', // London
    startingGold: 2000,
    goal: 'Chart every undiscovered corner of the globe',
    description:
      'An English explorer with an insatiable thirst for discovery. ' +
      'Equipped with the finest instruments, he seeks to fill in every blank on the map.',
    stats: { navigation: 92, combat: 72, intuition: 140, endurance: 61, rhetoric: 88, art: 86, sword: 82 },
  },
  '4': {
    sailorId: '4',
    firstName: 'Ernst',
    lastName: 'Von Bohr',
    nationality: 'Dutch',
    startingPortId: '36', // Hamburg
    startingGold: 2000,
    goal: 'Establish a global trading network for the Dutch Republic',
    description:
      'A methodical Dutch merchant and strategist. ' +
      'He builds alliances and trade routes where others see only risks.',
    stats: { navigation: 78, combat: 92, intuition: 86, endurance: 120, rhetoric: 62, art: 53, sword: 90 },
  },
  '5': {
    sailorId: '5',
    firstName: 'Pietro',
    lastName: 'Conti',
    nationality: 'Italian',
    startingPortId: '9', // Genoa
    startingGold: 1000,
    goal: 'Become the wealthiest merchant in the world',
    description:
      'An Italian merchant with a sharp head for numbers. ' +
      'Dreams of building a trading empire spanning every sea.',
    stats: { navigation: 84, combat: 80, intuition: 75, endurance: 110, rhetoric: 53, art: 61, sword: 81 },
  },
  '6': {
    sailorId: '6',
    firstName: 'Ali',
    lastName: 'Vezas',
    nationality: 'Ottoman',
    startingPortId: '3', // Istanbul
    startingGold: 1000,
    goal: 'Recover the lost treasures of your homeland',
    description:
      'An Ottoman trader with connections throughout the Mediterranean and Indian Ocean. ' +
      'He seeks ancient relics scattered by the crusades.',
    stats: { navigation: 80, combat: 86, intuition: 84, endurance: 120, rhetoric: 53, art: 42, sword: 80 },
  },
};

// Mate IDs assigned to each captain at game start (first mate + bookkeeper if available)
export const captainInitialMates: Record<string, string[]> = {
  '1': ['1'],          // João: just himself initially (Rocco+Enrico via quests)
  '2': ['2'],          // Catalina: herself
  '3': ['3'],          // Otto: himself
  '4': ['4'],          // Ernst: himself
  '5': ['5'],          // Pietro: himself
  '6': ['6'],          // Ali: himself
};
