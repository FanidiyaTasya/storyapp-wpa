import CONFIG from '../config';

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  SHOW_STORY: `${CONFIG.BASE_URL}/stories`,
  DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function login({ email, password }) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok || result.error) {
      return {
        ok: false,
        message: result.message || 'Login failed.',
      };
    }

    const { token, userId, name } = result.loginResult;
    console.log('Access Token:', token);
    return {
      ok: true,
      data: { accessToken: token, userId, name },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      ok: false,
      message: 'An unexpected error occurred during login.',
    };
  }
}

export async function register({ name, email, password }) {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      return {
        ok: false,
        message: result.message || 'Register failed.',
      };
    }

    return {
      ok: true,
      message: result.message || 'User Created',
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      ok: false,
      message: 'An unexpected error occurred during registration.',
    };
  }
}

export async function getAllStories({ withLocation = false } = {}) {
  try {
    const token = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);

    const response = await fetch(`${ENDPOINTS.SHOW_STORY}?location=${withLocation ? 1 : 0}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('getAllStories error:', error);
    return { error: true, message: error.message, listStory: [] };
  }
}

export async function getStoryById(id) {
  try {
    const token = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);

    const response = await fetch(ENDPOINTS.DETAIL_STORY(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      return {
        error: true,
        message: result.message || 'Failed to get story details.',
      };
    }

    return result;
  } catch (error) {
    console.error('getStoryById error:', error);
    return {
      error: true,
      message: 'Failed to load story details.',
    };
  }
}

export async function postStory(formData) {
  try {
    const token = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);

    const response = await fetch(ENDPOINTS.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      return {
        error: true,
        message: result.message || 'Failed to post story.',
      };
    }

    return result;
  } catch (error) {
    console.error('postStory error:', error);
    return {
      error: true,
      message: 'An unexpected error occurred while posting.',
    };
  }
}

export async function pushSubscribe(subscription) {
  try {
    const token = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);

    const response = await fetch(ENDPOINTS.SUBSCRIBE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.message || 'Failed to subscribe');
    }

    return {
      ok: true,
      message: result.message || 'Subscribed successfully',
    };
  } catch (error) {
    console.error('Subscribe error:', error);
    return {
      ok: false,
      message: error.message,
    };
  }
}

export async function pushUnsubscribe({ endpoint }) {
  try {
    const token = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);

    const response = await fetch(ENDPOINTS.UNSUBSCRIBE, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.message || 'Failed to unsubscribe');
    }

    return {
      ok: true,
      message: result.message || 'Unsubscribed successfully',
    };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return {
      ok: false,
      message: error.message,
    };
  }
}
