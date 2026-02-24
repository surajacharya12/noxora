const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const VIDKING_BASE_URL = process.env.VIDKING_BASE_URL;

/**
 * Fetch movie or TV details by ID
 */
async function fetchDetails(type, id) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} details:`, error.message);
    return null;
  }
}

/**
 * Fetch trending movies or TV shows
 */
async function fetchTrending(type = "all", page = 1) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}&page=${page}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching trending:", error.message);
    return { results: [], total_pages: 0 };
  }
}

/**
 * Search movies, TV shows, or people
 */
async function searchMulti(query) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
    );
    return response.data.results;
  } catch (error) {
    console.error("Error searching TMDB:", error.message);
    return [];
  }
}

/**
 * Generate Vidking Player URL
 */
function generatePlayerUrl(config) {
  const {
    type,
    id,
    season = 1,
    episode = 1,
    color = "0dcaf0",
    autoPlay = false,
    lang = "",
  } = config;

  let url = "";

  if (type === "movie") {
    url = `${VIDKING_BASE_URL}/movie/${id}`;
  } else {
    url = `${VIDKING_BASE_URL}/tv/${id}/${season}/${episode}`;
  }

  const params = new URLSearchParams({
    color: color.replace("#", ""),
    autoPlay: autoPlay.toString(),
    nextEpisode: (type === "tv").toString(),
    episodeSelector: (type === "tv").toString(),
  });

  if (lang) {
    params.set("lang", lang);
  }

  return `${url}?${params.toString()}`;
}

/**
 * Fetch discovery content (with genre and page support)
 */
async function fetchDiscover(type, genreId, page = 1) {
  try {
    let url = `${TMDB_BASE_URL}/discover/${type === 'movie' ? 'movie' : 'tv'}?api_key=${TMDB_API_KEY}&page=${page}&sort_by=popularity.desc`;
    if (genreId && genreId !== 'all') {
      url += `&with_genres=${genreId}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error in discovery (${type}):`, error.message);
    return { results: [], total_pages: 0 };
  }
}

module.exports = {
  fetchDetails,
  fetchTrending,
  searchMulti,
  generatePlayerUrl,
  fetchDiscover,
};
