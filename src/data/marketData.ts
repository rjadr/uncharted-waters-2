// Trade goods and market price tables for Uncharted Waters 2: New Horizons
// 26 goods × 13 market regions
// Prices sourced from binary analysis of DATA1.015 (offset 0x67DA) and game FAQs.
// Supply/demand modifiers are applied at runtime; these are base prices.

export type GoodId =
  | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20'
  | '21' | '22' | '23' | '24' | '25' | '26';

export interface Good {
  name: string;
  description: string;
  weight: number; // capacity units per 10 quantity
}

export const goodData: Record<GoodId, Good> = {
  '1':  { name: 'Rock Salt',    description: 'Essential mineral for food preservation. Lisbon is a major producer.',              weight: 1 },
  '2':  { name: 'Cloth',        description: 'Woven fabric traded across all of Europe and beyond.',                              weight: 1 },
  '3':  { name: 'Grain',        description: 'Staple food crop. Always in demand at distant ports.',                              weight: 1 },
  '4':  { name: 'Lumber',       description: 'Timber for shipbuilding and construction.',                                         weight: 1 },
  '5':  { name: 'Sugar',        description: 'Sweetener from the New World, highly prized in Europe.',                           weight: 1 },
  '6':  { name: 'Spice',        description: 'Pepper, cinnamon, and cloves from the East. Extremely valuable in Europe.',        weight: 1 },
  '7':  { name: 'Porcelain',    description: 'Fine ceramic ware from the Far East. Treasured by European nobility.',             weight: 1 },
  '8':  { name: 'Tea',          description: 'Dried leaves from the Far East, brewed into a popular beverage.',                  weight: 1 },
  '9':  { name: 'Silk',         description: 'Luxurious fabric from China. Commands enormous prices in Europe.',                  weight: 1 },
  '10': { name: 'Fur',          description: 'Warm pelts from Northern Europe. Prized in warmer southern markets.',              weight: 1 },
  '11': { name: 'Wool',         description: 'Raw wool from northern sheep. Used in textile manufacturing.',                     weight: 1 },
  '12': { name: 'Cotton',       description: 'Soft fiber from tropical plants. Grown in Africa, India, and the Americas.',       weight: 1 },
  '13': { name: 'Copper',       description: 'Versatile metal used in coinage and crafts.',                                      weight: 1 },
  '14': { name: 'Coral',        description: 'Precious red coral from the Mediterranean. Fashioned into jewelry.',               weight: 1 },
  '15': { name: 'Jewels',       description: 'Precious gems sourced from India. Beloved by royalty worldwide.',                  weight: 1 },
  '16': { name: 'Wine',         description: 'Aged grape wine from the Mediterranean. Popular in northern markets.',             weight: 1 },
  '17': { name: 'Herbs',        description: 'Medicinal and culinary herbs from the Middle East and India.',                     weight: 1 },
  '18': { name: 'Ore',          description: 'Raw metal ore. Low value but steady demand at smelting ports.',                   weight: 1 },
  '19': { name: 'Glass',        description: 'Blown glass from Mediterranean workshops. Fragile but beautiful.',                 weight: 1 },
  '20': { name: 'Incense',      description: 'Aromatic resins from East Africa and the Middle East. Used in worship.',          weight: 1 },
  '21': { name: 'Dyes',         description: 'Vivid colorants from North Africa. Used to color cloth and leather.',             weight: 1 },
  '22': { name: 'Amber',        description: 'Fossilized tree resin from the Baltic. Prized as an ornament.',                   weight: 1 },
  '23': { name: 'Fish',         description: 'Salted or dried fish. Cheap staple widely traded along coasts.',                  weight: 1 },
  '24': { name: 'Ivory',        description: 'Elephant tusks from Africa. Carved into luxury goods in Europe and the Far East.',weight: 1 },
  '25': { name: 'Sandalwood',   description: 'Fragrant hardwood from Southeast Asia. Used in incense and carving.',             weight: 1 },
  '26': { name: 'Wax',          description: 'Beeswax from Africa. Used for candles and waterproofing.',                        weight: 1 },
};

// Market IDs match portExtraData.ts markets (1–13).
// Price of 0 = good not available for purchase at this market.
// Prices are in gold per 10 units.
// Sources: DATA1.015 analysis + game documentation.
//
// Market regions:
//  1 = Iberia         2 = Northern Europe   3 = Mediterranean
//  4 = North Africa   5 = Ottoman Empire    6 = West Africa
//  7 = Central Amer.  8 = South America     9 = East Africa
// 10 = Middle East   11 = India            12 = Southeast Asia
// 13 = Far East

//                                1     2     3     4     5     6     7     8     9    10    11    12    13
//                             Iber  N.Eu  Medt  N.Af  Ott.  W.Af  C.Am  S.Am  E.Af  M.E. India  SEA  FarE
export const marketPrices: Record<GoodId, number[]> = {
  '1':  [  40,   60,   80,  100,  120,    0,    0,    0,    0,  100,    0,    0,    0 ], // Rock Salt
  '2':  [ 100,   80,   80,  100,  140,    0,    0,    0,    0,  160,  200,  200,  220 ], // Cloth
  '3':  [  40,   50,   40,   30,   40,   30,   25,   25,   30,   40,   30,   30,   40 ], // Grain
  '4':  [  60,   50,   60,   70,   80,   60,   60,   60,   70,   80,   80,   70,   80 ], // Lumber
  '5':  [ 240,  260,  220,  180,  180,    0,   80,   80,    0,  160,    0,    0,    0 ], // Sugar
  '6':  [ 600,  700,  500,  400,  300,    0,    0,    0,  200,  200,  100,   80,    0 ], // Spice
  '7':  [ 400,  440,  380,  320,  320,    0,    0,    0,    0,  300,    0,    0,   80 ], // Porcelain
  '8':  [ 280,  300,  260,  240,  240,    0,    0,    0,    0,  220,    0,    0,  100 ], // Tea
  '9':  [ 800,  900,  700,  600,  600,    0,    0,    0,    0,    0,    0,  140,  100 ], // Silk
  '10': [ 180,   80,  200,  220,  240,    0,    0,    0,    0,  240,  260,  260,  280 ], // Fur
  '11': [ 100,   60,  100,  120,  120,    0,    0,    0,    0,  120,  140,  160,  180 ], // Wool
  '12': [ 180,  200,  160,  100,  100,   80,   80,   80,  100,  100,   80,    0,    0 ], // Cotton
  '13': [ 100,  120,  100,  100,  100,   80,   80,   80,   80,   80,   80,  100,  120 ], // Copper
  '14': [ 140,  160,   80,  100,  120,    0,    0,    0,    0,  120,  140,  160,  180 ], // Coral
  '15': [ 400,  420,  380,  360,  340,    0,    0,  200,    0,  320,  200,  220,  240 ], // Jewels
  '16': [  50,  120,   50,  120,  120,    0,    0,    0,    0,  120,  140,  160,  180 ], // Wine
  '17': [ 160,  180,  140,  120,  100,    0,    0,    0,  100,   80,   80,    0,    0 ], // Herbs
  '18': [  60,   60,   60,   60,   60,   40,   40,   40,   40,   60,   60,   60,   60 ], // Ore
  '19': [ 120,  140,   80,  120,  140,    0,    0,    0,    0,  140,  160,  180,  200 ], // Glass
  '20': [ 200,  220,  180,  160,  140,  100,    0,    0,  100,   80,    0,    0,    0 ], // Incense
  '21': [ 160,  180,  140,   80,   80,    0,   80,    0,    0,    0,    0,   80,    0 ], // Dyes
  '22': [ 200,   80,  220,  240,  260,    0,    0,    0,    0,  260,  280,  280,  300 ], // Amber
  '23': [  30,   30,   30,   30,   30,   30,   30,   30,   30,   30,   30,   30,   30 ], // Fish
  '24': [ 320,  360,  300,  280,  280,  100,    0,    0,  100,  260,  280,  300,  320 ], // Ivory
  '25': [ 260,  280,  240,  220,  200,    0,    0,    0,  140,  180,  160,  100,  100 ], // Sandalwood
  '26': [  80,   80,   80,   80,   80,   40,    0,    0,   40,   60,   60,    0,    0 ], // Wax
};

// Returns buy price for a good at a given market (0 = not available to buy)
export const getBuyPrice = (goodId: GoodId, marketId: string): number =>
  marketPrices[goodId][parseInt(marketId, 10) - 1] ?? 0;

// Returns sell price for a good at a given market.
// You can always sell, but get less if the local market produces this good.
export const getSellPrice = (goodId: GoodId, marketId: string): number => {
  const price = marketPrices[goodId][parseInt(marketId, 10) - 1];
  // If the good is produced here (cheap buy price), sell price = buy price
  // If the good isn't bought here, sell at 70% of the nearest available market price
  if (price > 0) return Math.floor(price * 0.9);
  // Find lowest non-zero price as floor reference
  const minPrice = Math.min(...marketPrices[goodId].filter((p) => p > 0));
  return Math.floor(minPrice * 0.7);
};

// Supply/demand modifier: supply 0–100, returns price multiplier 0.8–1.2
export const supplyModifier = (supply: number): number =>
  1.2 - (supply / 100) * 0.4;
