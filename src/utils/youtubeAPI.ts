const BASE_URL = 'http://192.168.100.123:5000'; // Your backend IP

export async function fetchYouTubeResults() {
  try {
    const response = await fetch(`${BASE_URL}/api/youtube`);
    const data = await response.json();
    return data || [];  // data is already an array of videos
  } catch (error) {
    console.error('Error fetching YouTube results:', error);
    return [];
  }
}
