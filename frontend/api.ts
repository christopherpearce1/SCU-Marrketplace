const API_BASE_URL = 'http://localhost:8000/api'; //backend adrs



// helper func
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', 
  }); //ignore
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'req failed' }));
    throw new Error(error.error || 'req failed');
  }
  
  return response.json();
}


// user api (auth)
export const authAPI = {
  register: async (username: string, password: string, email: string, first_name: string, last_name: string, phone: string) => {
    return apiCall('/user/register/', {
      method: 'POST',
      body: JSON.stringify({ username, password, email, first_name, last_name, phone }),
    });
  },

  login: async (username: string, password: string) => {
    return apiCall('/user/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  logout: async () => {
    return apiCall('/user/logout/', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return apiCall('/user/me/');
  },
};


// listing api
export const listingsAPI = {
  getAll: async () => {
    return apiCall('/listings/');
  },

  getOne: async (id: number) => {
    return apiCall(`/listings/${id}/`);
  },

  create: async (title: string, description: string, price: number) => {
    return apiCall('/listings/', {
      method: 'POST',
      body: JSON.stringify({ title, description, price }),
    });
  },

  delete: async (id: number) => {
    return apiCall(`/listings/${id}/delete/`, {
      method: 'DELETE',
    });
  },
};
