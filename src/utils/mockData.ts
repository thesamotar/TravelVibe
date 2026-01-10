export type Location = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    description: string;
    tags: string[]; // e.g., 'indian', 'vegetarian', 'coin', 'museum'
    type: 'restaurant' | 'museum' | 'park' | 'other';
};

export const INITIAL_LOCATIONS: Location[] = [
    {
        id: '1',
        name: 'Spicy Mint Indian Cuisine',
        lat: 37.7749,
        lng: -122.4194,
        description: 'Authentic Indian flavors with many vegetarian options.',
        tags: ['indian', 'vegetarian', 'food', 'spice'],
        type: 'restaurant',
    },
    {
        id: '2',
        name: 'San Francisco Numismatic Museum',
        lat: 37.7849,
        lng: -122.4094,
        description: 'A dedicated space for coin collectors and history buffs.',
        tags: ['coin', 'numismatic', 'museum', 'history'],
        type: 'museum',
    },
    {
        id: '3',
        name: 'Green Leaf Veggie House',
        lat: 37.7649,
        lng: -122.4294,
        description: 'Pure vegetarian delight with global fusion dishes.',
        tags: ['vegetarian', 'food', 'health'],
        type: 'restaurant',
    },
    {
        id: '4',
        name: 'Golden Gate Coin Shop',
        lat: 37.7949,
        lng: -122.3994,
        description: 'Buy, sell, and trade rare coins from around the world.',
        tags: ['coin', 'shop', 'collectible'],
        type: 'other',
    },
    {
        id: '5',
        name: 'City Art Museum',
        lat: 37.7549,
        lng: -122.4394,
        description: 'Modern art exhibitions.',
        tags: ['art', 'museum', 'culture'],
        type: 'museum',
    },
    {
        id: '6',
        name: 'Burger & Fries',
        lat: 37.8049,
        lng: -122.4494,
        description: 'Classic american burger joint.',
        tags: ['food', 'burger', 'meat'],
        type: 'restaurant',
    },
];

export function filterLocations(persona: string): Location[] {
    const lowerPersona = persona.toLowerCase();

    // Hardcoded AI "skewing" logic
    // If persona mentions keys, we filter strictly to show the "AI" understands.
    const keywords = ['indian', 'vegetarian', 'veg', 'coin', 'numismatic'];
    const matchedKeywords = keywords.filter(k => lowerPersona.includes(k));

    if (matchedKeywords.length === 0) {
        // If no specific keywords found, return all (or maybe a subset as default?)
        // Let's return all for now to show the map is populated.
        return INITIAL_LOCATIONS;
    }

    return INITIAL_LOCATIONS.filter(loc => {
        return loc.tags.some(tag => {
            // Check if tag matches any of the matched keywords from persona
            // We map 'veg' to 'vegetarian' for better matching if needed, but 'vegetarian' covers 'veg' usually if we check includes.
            // Simple include check:
            if (lowerPersona.includes(tag)) return true;
            if (tag === 'vegetarian' && lowerPersona.includes('veg')) return true;
            if (tag === 'numismatic' && lowerPersona.includes('coin')) return true;
            return false;
        });
    });
}
