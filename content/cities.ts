export interface CityGroup {
  region: string;
  cities: string[];
}

export const cityGroups: CityGroup[] = [
  {
    region: "Florida Gulf Coast",
    cities: [
      "Destin, FL", "Panama City Beach, FL", "30A / Seaside, FL",
      "Fort Walton Beach, FL", "Pensacola Beach, FL", "Cape San Blas, FL",
      "Anna Maria Island, FL", "Siesta Key, FL", "Marco Island, FL",
    ],
  },
  {
    region: "Florida Atlantic & Keys",
    cities: [
      "Miami Beach, FL", "Fort Lauderdale, FL", "Palm Beach, FL",
      "Key West, FL", "Islamorada, FL", "Marathon, FL", "Clearwater Beach, FL",
      "St. Pete Beach, FL", "Amelia Island, FL",
    ],
  },
  {
    region: "Southeast Coast",
    cities: [
      "Myrtle Beach, SC", "Hilton Head, SC", "Pawleys Island, SC",
      "Isle of Palms, SC", "Folly Beach, SC", "Tybee Island, GA",
      "Jekyll Island, GA", "St. Simons Island, GA",
    ],
  },
  {
    region: "Mid-Atlantic Coast",
    cities: [
      "Outer Banks, NC", "Virginia Beach, VA", "Ocean City, MD",
      "Rehoboth Beach, DE", "Cape May, NJ", "Wildwood, NJ",
      "Bethany Beach, DE", "Corolla, NC",
    ],
  },
  {
    region: "New England Coast",
    cities: [
      "Cape Cod, MA", "Martha's Vineyard, MA", "Nantucket, MA",
      "Newport, RI", "Bar Harbor, ME", "Kennebunkport, ME",
      "Ogunquit, ME", "Old Orchard Beach, ME", "Portsmouth, NH",
    ],
  },
  {
    region: "Colorado & Ski Country",
    cities: [
      "Aspen, CO", "Breckenridge, CO", "Vail, CO",
      "Steamboat Springs, CO", "Keystone, CO", "Telluride, CO",
      "Crested Butte, CO", "Winter Park, CO",
    ],
  },
  {
    region: "Mountain West",
    cities: [
      "Park City, UT", "Jackson Hole, WY", "Big Sky, MT",
      "Sun Valley, ID", "Mammoth Lakes, CA", "Lake Tahoe, CA",
      "South Lake Tahoe, CA", "Incline Village, NV",
    ],
  },
  {
    region: "Tennessee & Smoky Mountains",
    cities: [
      "Gatlinburg, TN", "Pigeon Forge, TN", "Sevierville, TN",
      "Blue Ridge, GA", "Asheville, NC", "Boone, NC",
      "Banner Elk, NC", "Cashiers, NC",
    ],
  },
  {
    region: "Lakes & Waterfront",
    cities: [
      "Lake of the Ozarks, MO", "Table Rock Lake, MO", "Lake Norman, NC",
      "Smith Mountain Lake, VA", "Lake George, NY", "Lake Placid, NY",
      "Grand Lake, CO", "Lake Lure, NC", "Deep Creek Lake, MD",
    ],
  },
  {
    region: "Desert & Southwest",
    cities: [
      "Scottsdale, AZ", "Sedona, AZ", "Tucson, AZ",
      "Santa Fe, NM", "Taos, NM", "Palm Springs, CA",
      "Joshua Tree, CA", "Moab, UT",
    ],
  },
  {
    region: "Pacific Coast",
    cities: [
      "Santa Barbara, CA", "Carmel-by-the-Sea, CA", "Big Sur, CA",
      "Malibu, CA", "Laguna Beach, CA", "San Diego, CA",
      "Cannon Beach, OR", "Seaside, OR", "Lincoln City, OR",
    ],
  },
  {
    region: "Texas",
    cities: [
      "Port Aransas, TX", "South Padre Island, TX", "Galveston, TX",
      "New Braunfels, TX", "Fredericksburg, TX", "Rockport, TX",
    ],
  },
  {
    region: "Wine Country & Unique Destinations",
    cities: [
      "Napa, CA", "Sonoma, CA", "Paso Robles, CA",
      "Savannah, GA", "Charleston, SC", "Nashville, TN",
      "New Orleans, LA", "Branson, MO",
    ],
  },
];
