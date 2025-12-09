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
 * Fetches the mood suggestion data from the 'moodSuggestions' collection in Firestore.
 * @returns {Promise<Object>} A promise that resolves to an object where keys are mood categories.
 */
export async function getMoodSuggestionsData() {
    const querySnapshot = await getDocs(collection(db, "moodSuggestions"));
    const suggestions = {};
    querySnapshot.forEach((doc) => {
        suggestions[doc.id] = doc.data();
    });
    return suggestions;
}