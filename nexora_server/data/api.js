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
async function fetchTrending(type = "all") {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}`,
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending:", error.message);
    return [];
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

  return `${url}?${params.toString()}`;
}

module.exports = {
  fetchDetails,
  fetchTrending,
  searchMulti,
  generatePlayerUrl,
};
