// This file centralizes data fetching for the application.
import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Example hardcoded route data for fallback
const defaultRouteData = [
    {
        id: "burj_khalifa", 
        title: "Burj Khalifa",
        time: "10:00 AM - 12:00 PM",
        icon: "fa-landmark",
        coords: [25.1972, 55.2744],
        crowdLevel: 95
    },
    {
        id: "dubai_mall", 
        title: "The Dubai Mall",
        time: "12:30 PM - 3:00 PM",
        icon: "fa-shopping-bag",
        coords: [25.1983, 55.2795],
        crowdLevel: 85
    },
    {
        id: "lunch_timeout", 
        title: "Lunch at Time Out Market",
        time: "3:00 PM - 4:00 PM",
        icon: "fa-utensils",
        coords: [25.2028, 55.2833],
        crowdLevel: 80
    },
    {
        id: "fountain_show", 
        title: "Dubai Fountain Show",
        time: "6:00 PM",
        icon: "fa-water",
        coords: [25.1959, 55.2758],
        crowdLevel: 90
    }
];

// Example hardcoded suggestions for fallback
const defaultSuggestionsData = [
    { id: "s1", title: "Coffee Break at % Arabica", info: "Famous for its minimalist design and great coffee.", icon: "fa-coffee", realTime: false, rating: 4.5, coords: [25.1990, 55.2790] },
    { id: "s2", title: "Ice Rink Fun", info: "Escape the heat at the Dubai Ice Rink.", icon: "fa-snowflake", realTime: false, rating: 4.4, coords: [25.1975, 55.2785] },
    { id: "s3", title: "Light Traffic Alert", info: "Roads around Downtown are clear. Good time to travel!", icon: "fa-traffic-light", realTime: true, rating: null, coords: null },
    { id: "s4", title: "Sunset Photo Spot", info: "Head to the waterfront for amazing sunset views of Burj Khalifa.", icon: "fa-camera", realTime: true, rating: null, coords: [25.1945, 55.2730] }
];

/**
 * Fetches the initial route data from the 'routes' collection in Firestore.
 * @returns {Promise<Array>} A promise that resolves to an array of route objects.
 */
export async function getRouteData() {
    const querySnapshot = await getDocs(collection(db, "routes"));
    const routes = [];
    querySnapshot.forEach((doc) => {
        // Combine the document ID with its data
        routes.push({ id: doc.id, ...doc.data() });
    });
    if (routes.length === 0) {
        console.warn("No route data found in Firestore. Using default route data.");
        return defaultRouteData;
    }
    return routes;
}

/**
 * Fetches the suggestion data from the 'suggestions' collection in Firestore.
 * @returns {Promise<Array>} A promise that resolves to an array of suggestion objects.
 */
export async function getSuggestionsData() {
    const querySnapshot = await getDocs(collection(db, "suggestions"));
    const suggestions = [];
    querySnapshot.forEach((doc) => {
        suggestions.push({ id: doc.id, ...doc.data() });
    });
    if (suggestions.length === 0) {
        console.warn("No suggestions found in Firestore. Using default suggestion data.");
        return defaultSuggestionsData;
    }
    return suggestions;
}

/**
 * Static data for luxury restaurants. This can also be moved to Firestore later.
 */
export const luxuryRestaurantsData = [
    { 
        name: "At.mosphere, Burj Khalifa", 
        info: "Fine dining with breathtaking views.", 
        icon: "fa-utensils", 
        coords: [25.1972, 55.2744], 
        price: "$$$$", 
        calories: "Varies" 
    },
    { 
        name: "Pierchic", 
        info: "Romantic seafood restaurant over the water.", 
        icon: "fa-fish", 
        coords: [25.1313, 55.1822], 
        price: "$$$$", 
        calories: "Varies" 
    },
    { 
        name: "Zuma Dubai", 
        info: "Contemporary Japanese izakaya.", 
        icon: "fa-sushi", 
        coords: [25.2143, 55.2785], 
        price: "$$$", 
        calories: "Varies" 
    }
];

/**
 * Default mood suggestions to be used as a fallback if Firestore is unavailable.
 * This makes the Mood Advisor feature more resilient.
 */
const defaultMoodSuggestions = {
    "happy-energetic": {
        "keywords": ["happy", "excited", "energized", "motivated", "inspired", "joyful", "overjoyed", "giggly", "empowered", "strong", "confident", "optimistic", "cheerful", "amazed", "surprised", "impressed", "fulfilled", "in love", "free"],
        "response": "That's wonderful to hear! Let's keep the positive energy flowing. Here are some exciting places to check out:",
        "places": [
            { "name": "Motiongate Dubai", "info": "A thrilling Hollywood-inspired theme park.", "coords": [24.9200, 55.0045] },
            { "name": "Kite Beach", "info": "Perfect for water sports and a vibrant atmosphere.", "coords": [25.1782, 55.2267] },
            { "name": "City Walk", "info": "A dynamic outdoor destination with shopping and entertainment.", "coords": [25.2084, 55.2624] }
        ]
    },
    "calm-content": {
        "keywords": ["calm", "relaxed", "hopeful", "grateful", "content", "contented", "relieved", "mellow", "satisfied", "appreciated", "loved", "secure", "reflective", "sentimental"],
        "response": "It's great that you're in a peaceful state of mind. Here are some serene spots to enjoy this feeling:",
        "places": [
            { "name": "Al Fahidi Historical Neighbourhood", "info": "Wander through the quiet, historic alleyways of Old Dubai.", "coords": [25.2630, 55.3020] },
            { "name": "Dubai Miracle Garden", "info": "A beautiful and peaceful garden to stroll through.", "coords": [25.0559, 55.2458] },
            { "name": "The Green Planet", "info": "Immerse yourself in a tropical rainforest.", "coords": [25.2090, 55.2642] }
        ]
    },
    "sad-lonely": {
        "keywords": ["sad", "lonely", "depressed", "hurt", "sorrowful", "mournful", "disconnected"],
        "response": "I'm sorry to hear you're feeling this way. Sometimes a change of scenery can help. Here are some gentle suggestions:",
        "places": [
            { "name": "Jumeirah Public Beach", "info": "A quiet walk by the sea can be very therapeutic.", "coords": [25.2165, 55.2553] },
            { "name": "Ailuromania Cat Cafe", "info": "Spending time with furry friends can be very comforting.", "coords": [25.2198, 55.2698] },
            { "name": "A quiet coffee shop", "info": "Find a cozy corner to relax with a warm drink.", "coords": null }
        ]
    },
    "tired-bored": {
        "keywords": ["tired", "bored", "sleepy", "lazy", "indifferent", "weak"],
        "response": "It sounds like you need a little boost or a place to recharge. Here are a few ideas:",
        "places": [
            { "name": "Find a local park bench", "info": "Sometimes just sitting and watching the world go by is enough.", "coords": null },
            { "name": "The Espresso Lab", "info": "Known for excellent coffee to help you recharge.", "coords": [25.2201, 55.2711] },
            { "name": "VOX Cinemas", "info": "Escape into a movie for a couple of hours.", "coords": [25.1182, 55.2004] }
        ]
    },
    "anxious-stressed": {
        "keywords": ["anxious", "nervous", "scared", "worried", "overwhelmed", "insecure", "uncertain", "vulnerable", "frightened", "shaky", "tense", "stressed", "conflicted"],
        "response": "It's okay to feel that way. Let's find a place where you can take a deep breath and clear your mind:",
        "places": [
            { "name": "Safa Park", "info": "A large, green space perfect for a calming walk or just sitting by the lake.", "coords": [25.1900, 55.2480] },
            { "name": "Talise Ottoman Spa", "info": "Consider a spa treatment to de-stress and relax your body and mind.", "coords": [25.0935, 55.1281] },
            { "name": "Yoga La Vie", "info": "A gentle yoga or meditation class could help center you.", "coords": [25.0930, 55.1560] }
        ]
    },
    "angry-frustrated": {
        "keywords": ["angry", "frustrated", "annoyed", "grumpy", "bothered", "displeased", "resentful"],
        "response": "I understand. Sometimes you need to let off some steam. Here are some activities that might help:",
        "places": [
            { "name": "The Smash Room", "info": "Safely break things to release frustration.", "coords": [25.1388, 55.3881] },
            { "name": "A local gym or running track", "info": "Channeling that energy into a workout can be very effective.", "coords": null },
            { "name": "Topgolf Dubai", "info": "Hit some golf balls and focus on a target.", "coords": [25.0388, 55.2000] }
        ]
    },
    "confused-curious": {
        "keywords": ["confused", "curious", "distracted", "baffled", "perplexed", "stunned", "lost"],
        "response": "When you're feeling a bit lost or curious, exploring something new can be grounding. Check out these thought-provoking places:",
        "places": [
            { "name": "Museum of the Future", "info": "Explore what tomorrow might look like. It's full of inspiring ideas.", "coords": [25.2193, 55.2813] },
            { "name": "Jameel Arts Centre", "info": "Wander through contemporary art exhibitions and get lost in creativity.", "coords": [25.2391, 55.3431] },
            { "name": "Alserkal Avenue", "info": "A hub of art galleries and creative spaces to spark new thoughts.", "coords": [25.1400, 55.2200] }
        ]
    },
    "shame-guilt": {
        "keywords": ["guilt", "guilty", "embarrassed", "shy", "ashamed"],
        "response": "These feelings can be tough. It might help to be in a place where you can be anonymous and just observe. Here are some low-pressure ideas:",
        "places": [
            { "name": "The Dubai Mall", "info": "It's easy to blend in with the crowd and just walk around without any pressure.", "coords": [25.1983, 55.2795] },
            { "name": "A public library", "info": "A quiet, anonymous space where you can sit with a book.", "coords": null },
            { "name": "Watch the Dubai Fountain", "info": "Lose yourself in the spectacle of the water and lights.", "coords": [25.1959, 55.2758] }
        ]
    }
};

/**
 * Fetches the mood suggestion data from the 'moodSuggestions' collection in Firestore.
 * @returns {Promise<Object>} A promise that resolves to an object where keys are mood categories.
 */
export async function getMoodSuggestionsData() {
    const querySnapshot = await getDocs(collection(db, "moodSuggestions"));
    const suggestions = {};
    querySnapshot.forEach((doc) => {
        suggestions[doc.id] = doc.data();
    });
    if (Object.keys(suggestions).length === 0) {
        console.warn("No mood suggestions found in Firestore. Using default data.");
        return defaultMoodSuggestions;
    }
    return suggestions;
}