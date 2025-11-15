const API_BASE_URL = 'http://localhost:8000/api'; //backend adrs

// Helper function to get CSRF token from cookies
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null; 
}

// helper func
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const csrfToken = getCookie('csrftoken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (csrfToken && (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE' || options.method === 'PATCH')) {
    headers['X-CSRFToken'] = csrfToken;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
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
  register: async (username: string, password: string, first_name: string, last_name: string, phone: string, address: string) => {
    return apiCall('/user/register/', {
      method: 'POST',
      body: JSON.stringify({ username, password, first_name, last_name, phone, address }),
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

  create: async (title: string, description: string, price: number, category?: string, image?: string) => {
    return apiCall('/listings/', {
      method: 'POST',
      body: JSON.stringify({ title, description, price, category, image }),
    });
  },

  delete: async (id: number) => {
    return apiCall(`/listings/${id}/delete/`, {
      method: 'DELETE',
    });
  },
};
