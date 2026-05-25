const axios = require("axios");

async function getUserEmailById(userId) {
  if (!userId) return null;

  const baseUrl = process.env.USER_SERVICE_URL;
  if (!baseUrl) {
    console.log("USER_SERVICE_URL is not set");
    return null;
  }

  try {
    const res = await axios.get(`${baseUrl}/users/internal/${userId}`);
    return res.data?.email || null;
  } catch (err) {
    console.error("Failed to fetch user email:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { getUserEmailById };