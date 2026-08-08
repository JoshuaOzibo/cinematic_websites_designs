export type MenuItem = {
  name: string;
  price: number;
  note?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  blurb: string;
  /** premium categories get a roomier grid */
  tier: "premium" | "standard" | "compact";
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "bar",
    title: "Bar",
    blurb: "The counter where the night begins — pours, mixers and house measures.",
    tier: "standard",
    items: [
      { name: "House Pour Whisky", price: 4500 },
      { name: "Gin & Tonic", price: 5000 },
      { name: "Vodka & Cranberry", price: 5500 },
      { name: "Rum & Coke", price: 5000 },
      { name: "Campari & Soda", price: 6000 },
      { name: "Brandy Measure", price: 4000 },
      { name: "Chapman (House)", price: 3500 },
      { name: "Ice Bucket", price: 1500 },
      { name: "Mixers (Per Can)", price: 1500 },
    ],
  },
  {
    id: "cocktails",
    title: "Cocktails, Mocktails & Smoothies",
    blurb: "Stirred slow, built to order. Ask the bar for the off-menu list.",
    tier: "standard",
    items: [
      { name: "Kings Old Fashioned", price: 12000 },
      { name: "Espresso Martini", price: 12000 },
      { name: "Margarita", price: 10000 },
      { name: "Mojito", price: 9000 },
      { name: "Long Island Iced Tea", price: 13000 },
      { name: "Pornstar Martini", price: 13500 },
      { name: "Negroni", price: 11000 },
      { name: "Daiquiri", price: 9500 },
      { name: "Virgin Mojito", price: 6000 },
      { name: "Shirley Temple", price: 5500 },
      { name: "Mango Smoothie", price: 6500 },
      { name: "Banana & Peanut Smoothie", price: 7000 },
    ],
  },
  {
    id: "wine",
    title: "Champagne & Wine",
    blurb: "Cellared cold. From Sunday bottles to milestone magnums.",
    tier: "premium",
    items: [
      { name: "Moët & Chandon Impérial", price: 180000 },
      { name: "Moët & Chandon Rosé", price: 220000 },
      { name: "Veuve Clicquot Brut", price: 210000 },
      { name: "Dom Pérignon Vintage", price: 550000 },
      { name: "Belaire Rosé", price: 95000 },
      { name: "Andre Lurton Bordeaux", price: 45000 },
      { name: "Carlo Rossi Red", price: 18000 },
      { name: "Four Cousins Sweet Red", price: 22000 },
      { name: "Nederburg Cabernet Sauvignon", price: 38000 },
      { name: "Martini Asti", price: 42000 },
    ],
  },
  {
    id: "beers",
    title: "Beers, Ciders & Bitters",
    blurb: "Cold, quick and always in stock.",
    tier: "compact",
    items: [
      { name: "Heineken", price: 2500 },
      { name: "Star Lager", price: 2000 },
      { name: "Trophy", price: 1800 },
      { name: "Guinness Stout", price: 2500 },
      { name: "Desperados", price: 3000 },
      { name: "Budweiser", price: 2800 },
      { name: "Smirnoff Ice", price: 2800 },
      { name: "Savanna Dry Cider", price: 3500 },
      { name: "Orijin Bitters", price: 2500 },
      { name: "Alomo Bitters (Bottle)", price: 6000 },
      { name: "Action Bitters", price: 1000 },
      { name: "Baby Oku", price: 1000 },
    ],
  },
  {
    id: "spirits",
    title: "Spirit, Tequila & Liquor",
    blurb: "The reserve shelf. Rare bottles, poured with ceremony.",
    tier: "premium",
    items: [
      { name: "Don Julio 1942", price: 600000 },
      { name: "Hennessy XO", price: 480000 },
      { name: "Glenfiddich 21 Year", price: 450000 },
      { name: "Rémy Martin XO", price: 420000 },
      { name: "Glenfiddich 18 Year", price: 260000 },
      { name: "Hennessy VSOP", price: 190000 },
      { name: "Martell Blue Swift", price: 175000 },
      { name: "Don Julio Blanco", price: 165000 },
      { name: "Jack Daniel's Old No. 7", price: 75000 },
      { name: "Jameson Irish Whiskey", price: 68000 },
      { name: "Grey Goose Vodka", price: 110000 },
      { name: "Ciroc Blue", price: 105000 },
      { name: "Baileys Irish Cream", price: 55000 },
      { name: "Campari", price: 48000 },
    ],
  },
  {
    id: "shots",
    title: "Shots",
    blurb: "Short, cold and to the point.",
    tier: "compact",
    items: [
      { name: "Tequila Shot", price: 4000 },
      { name: "Jägermeister Shot", price: 4500 },
      { name: "Sambuca Shot", price: 4000 },
      { name: "Baileys Shot", price: 3500 },
      { name: "Hennessy Shot", price: 8000 },
      { name: "Kings Fire (House Shot)", price: 5000 },
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen",
    blurb: "Grill-led plates and small bites, served till late.",
    tier: "standard",
    items: [
      { name: "Peppered Goat Meat", price: 9000 },
      { name: "Grilled Croaker Fish", price: 15000 },
      { name: "Suya Platter", price: 12000 },
      { name: "Chicken & Chips", price: 8500 },
      { name: "Jollof Rice & Grilled Chicken", price: 9500 },
      { name: "Asun (Spicy Goat)", price: 10000 },
      { name: "Peppered Snail", price: 13000 },
      { name: "Nkwobi", price: 8000 },
      { name: "Isi Ewu", price: 14000 },
      { name: "Yam Chips & Sauce", price: 6000 },
      { name: "Spring Rolls & Samosa", price: 5500 },
      { name: "Takeout Pack", price: 500 },
    ],
  },
  {
    id: "shisha",
    title: "Shisha",
    blurb: "Hand-packed bowls, fresh coals, changed on request.",
    tier: "standard",
    items: [
      { name: "Double Apple", price: 12000 },
      { name: "Blueberry Mint", price: 13000 },
      { name: "Watermelon Chill", price: 13000 },
      { name: "Grape & Mint", price: 12500 },
      { name: "Lemon Mint", price: 12500 },
      { name: "Kings Signature Blend", price: 18000 },
    ],
  },
  {
    id: "shisha-service",
    title: "Shisha & Other Service",
    blurb: "Add-ons for the table.",
    tier: "compact",
    items: [
      { name: "Coal Refill", price: 2000 },
      { name: "Bowl Refill", price: 6000 },
      { name: "Extra Hose", price: 3000 },
      { name: "Ice Base Upgrade", price: 3500 },
      { name: "Table Service Charge", price: 5000 },
      { name: "Private Booth Reservation", price: 50000 },
    ],
  },
  {
    id: "photo-shoot",
    title: "Photo Shoot",
    blurb: "Our lounge, lit for the camera. Sessions by appointment.",
    tier: "standard",
    items: [
      { name: "Express Session (30 mins)", price: 25000 },
      { name: "Standard Session (1 hour)", price: 45000 },
      { name: "Premium Session (2 hours)", price: 80000 },
      { name: "Birthday Set Styling", price: 60000 },
      { name: "Full Venue Buyout Shoot", price: 350000 },
      { name: "Extra Edited Frames (Per 10)", price: 15000 },
    ],
  },
  {
    id: "soft",
    title: "Soft Drinks & Juice",
    blurb: "Chilled, non-alcoholic and always on ice.",
    tier: "compact",
    items: [
      { name: "Coca-Cola", price: 1000 },
      { name: "Fanta", price: 1000 },
      { name: "Sprite", price: 1000 },
      { name: "Schweppes Tonic", price: 1500 },
      { name: "Chi Exotic Juice", price: 2500 },
      { name: "Five Alive", price: 2500 },
      { name: "Eva Water (75cl)", price: 1500 },
      { name: "Sachet Water", price: 500 },
      { name: "Red Bull", price: 3500 },
      { name: "Power Horse", price: 3000 },
    ],
  },
];

export const formatNaira = (value: number) =>
  `₦${value.toLocaleString("en-NG")}`;
