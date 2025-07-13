import { API_BASE_URL } from '../config_definitions/api_config';

export const getUserTheme = async () => {
  const token = localStorage.getItem('flowly_jwt_token');
  const response = await fetch(`${API_BASE_URL}/user/get-theme`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch theme');
  const data = await response.json();
  return data.theme;
};

export const saveUserTheme = async (theme) => {
  const token = localStorage.getItem('flowly_jwt_token');
  const response = await fetch(`${API_BASE_URL}/user/save-theme`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ theme })
  });
  if (!response.ok) throw new Error('Failed to save theme');
  return true;
}; 