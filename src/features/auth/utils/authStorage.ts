const TOKEN_KEY = "football-planner-token";

export const authStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
  },

  isLoggedIn() {
    return !!this.getToken();
  },
};