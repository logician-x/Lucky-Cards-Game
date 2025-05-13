// services/apiService.ts
import { Platform } from 'react-native';

// The base URL for your API
const API_BASE_URL = 'https://your-api-domain.com/api';

// Define common headers
const getCommonHeaders = async () => {
  // In a real app, you'd include authentication tokens here
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Platform': Platform.OS,
    'X-App-Version': '1.0.0',
  };
};

// Define response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Payment verification response
interface PaymentVerificationResponse {
  verified: boolean;
  balance: number;
  message: string;
}

class ApiService {
  // Generic fetch method with error handling
  private async fetchWithTimeout<T>(
    url: string, 
    options: RequestInit, 
    timeout = 30000
  ): Promise<ApiResponse<T>> {
    try {
      // Create an abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // Make the fetch request
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Parse the response
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP Error: ${response.status}`,
        };
      }
      
      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      // Handle fetch errors
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Network request failed',
      };
    }
  }

  // Verify a UPI payment
  async verifyUpiPayment(
    amount: number,
    orderId: string,
    transactionId: string
  ): Promise<ApiResponse<PaymentVerificationResponse>> {
    const url = `${API_BASE_URL}/payments/verify-upi`;
    
    const headers = await getCommonHeaders();
    
    const body = JSON.stringify({
      amount,
      orderId,
      transactionId,
    });
    
    return this.fetchWithTimeout<PaymentVerificationResponse>(url, {
      method: 'POST',
      headers,
      body,
    });
  }

  // Get user wallet balance
  async getWalletBalance(): Promise<ApiResponse<{ balance: number }>> {
    const url = `${API_BASE_URL}/wallet/balance`;
    
    const headers = await getCommonHeaders();
    
    return this.fetchWithTimeout<{ balance: number }>(url, {
      method: 'GET',
      headers,
    });
  }
}

// Export singleton instance
export default new ApiService();