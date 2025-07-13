const API_BASE_URL = 'http://localhost:8000';

export const getUserProfile = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}; 