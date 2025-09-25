// API Client for TicketHub - Integrated with Express.js backend
// const API_BASE_URL = 'http://localhost:3001/api'
const API_BASE_URL = "https://ticketmanagerbackend.onrender.com/api";

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.init();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`🔗 API Request: ${options.method || "GET"} ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      console.log(`📡 Response Status: ${response.status}`);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        console.error(`❌ API Error ${response.status}:`, errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ API Response:", data);
      return data;
    } catch (error) {
      console.error("🚨 Network Error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please ensure the backend is running."
        );
      }
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async getProfile() {
    return this.request("/auth/profile");
  }

  async logout() {
    this.clearToken();
    return Promise.resolve();
  }

  // Tickets methods
  async getTickets(params: any = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== "" &&
        params[key] !== "all"
      ) {
        queryParams.append(key, params[key].toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tickets?${queryString}` : "/tickets";

    return this.request(endpoint);
  }

  async getTicket(id: string) {
    return this.request(`/tickets/${id}`);
  }

  async createTicket(ticketData: any) {
    return this.request("/tickets", {
      method: "POST",
      body: JSON.stringify(ticketData),
    });
  }

  async updateTicket(id: string, ticketData: any) {
    return this.request(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(ticketData),
    });
  }

  async deleteTicket(id: string) {
    return this.request(`/tickets/${id}`, {
      method: "DELETE",
    });
  }

  async getUserTickets() {
    return this.request("/tickets/user/my-tickets");
  }

  // Purchases methods
  async createPurchase(ticketId: string, quantity: number) {
    return this.request("/purchases", {
      method: "POST",
      body: JSON.stringify({ ticket_id: ticketId, quantity }),
    });
  }

  async getUserPurchases() {
    return this.request("/purchases/my-purchases");
  }

  async getPurchase(id: string) {
    return this.request(`/purchases/${id}`);
  }

  async cancelPurchase(id: string) {
    return this.request(`/purchases/${id}/cancel`, {
      method: "PUT",
    });
  }

  async getUserSales() {
    return this.request("/purchases/sales/my-sales");
  }

  // Users methods
  async getUserStats() {
    return this.request("/users/stats");
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async searchUsers(query: string) {
    return this.request(`/users?search=${encodeURIComponent(query)}`);
  }

  // Health check
  async healthCheck() {
    return this.request("/health");
  }

  // Initialize token from localStorage
  init() {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      this.token = savedToken;
      console.log("🔑 Token loaded from localStorage");
    }
  }
}

export const apiClient = new ApiClient();
