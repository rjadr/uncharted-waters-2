// Characters are only used during dialog

export type Character = {
  name: string;
  color: string;
};

const characterData: { [key: string]: Character } = {
  '1': {
    name: 'João',
    color: 'text-blue-600',
  },
  '7': {
    name: 'Butler Marco',
    color: 'text-blue-900',
  },
  '19': {
    name: 'Duke Franco',
    color: 'text-red-600',
  },
  '20': {
    name: 'Duchess Christiana',
    color: 'text-yellow-600',
  },
  '32': {
    name: 'Old Sea Hand Rocco',
    color: 'text-amber-800',
  },
  '33': {
    name: 'Brother Enrico',
    color: 'text-purple-800',
  },
  '98': {
    name: 'Carlotta, Owner of the Pub',
    color: 'text-amber-600',
  },
  '99': {
    name: 'Lucia the Waitress',
    color: 'text-pink-600',
  },
  // Pietro Conti (captain 5)
  '5': {
    name: 'Pietro',
    color: 'text-blue-600',
  },
  '17': {
    name: 'Uncle Maurizio',
    color: 'text-amber-800',
  },
  // Catalina Erantzo (captain 2)
  '2': {
    name: 'Catalina',
    color: 'text-red-500',
  },
  '38': {
    name: 'Don Ramiro',
    color: 'text-yellow-700',
  },
  // Otto Baynes (captain 3)
  '3': {
    name: 'Otto',
    color: 'text-blue-700',
  },
  '40': {
    name: 'Lord Hawkins',
    color: 'text-purple-700',
  },
  // Ali Vezas (captain 6)
  '6': {
    name: 'Ali',
    color: 'text-emerald-600',
  },
  '30': {
    name: 'Merchant Suleiman',
    color: 'text-orange-700',
  },
  // Ernst Von Bohr (captain 4)
  '4': {
    name: 'Ernst',
    color: 'text-blue-500',
  },
  '46': {
    name: 'Councillor Van der Berg',
    color: 'text-gray-700',
  },
};

export default characterData;
