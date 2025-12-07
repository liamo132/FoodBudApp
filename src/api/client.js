// src/api/client.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function fetchRestaurants() {
  const res = await fetch(`${API_BASE_URL}/api/v1/restaurants`);
  if (!res.ok) throw new Error("Failed to fetch restaurants");
  return res.json();
}
