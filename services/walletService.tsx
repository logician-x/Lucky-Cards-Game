// services/walletService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  orderId?: string;
  transactionId?: string;
  upiId?: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  pendingOrderId?: string;
}

// Storage keys
const WALLET_STORAGE_KEY = '@casino_wallet';
const PENDING_ORDER_KEY = '@casino_pending_order';

class WalletService {
  // Get current wallet state
  async getWalletState(): Promise<WalletState> {
    try {
      const walletData = await AsyncStorage.getItem(WALLET_STORAGE_KEY);
      if (walletData) {
        return JSON.parse(walletData);
      }
      // Return default state if no data
      return {
        balance: 0,
        transactions: []
      };
    } catch (error) {
      console.error('Error getting wallet state:', error);
      return {
        balance: 0,
        transactions: []
      };
    }
  }

  // Save wallet state
  async saveWalletState(state: WalletState): Promise<void> {
    try {
      await AsyncStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving wallet state:', error);
    }
  }

  // Get current balance
  async getBalance(): Promise<number> {
    const state = await this.getWalletState();
    return state.balance;
  }

  // Create a pending deposit transaction
  async createPendingDeposit(amount: number, orderId: string, upiId: string): Promise<string> {
    const state = await this.getWalletState();
    
    // Create a transaction ID
    const transactionId = `DEP_${Date.now()}`;
    
    // Create transaction object
    const transaction: Transaction = {
      id: transactionId,
      amount,
      type: 'deposit',
      status: 'pending',
      timestamp: Date.now(),
      orderId,
      upiId
    };
    
    // Add to transactions list
    state.transactions = [transaction, ...state.transactions];
    state.pendingOrderId = orderId;
    
    // Save updated state
    await this.saveWalletState(state);
    
    // Save the pending order ID separately for quick access
    await AsyncStorage.setItem(PENDING_ORDER_KEY, orderId);
    
    return transactionId;
  }

  // Complete a pending deposit
  async completeDeposit(orderId: string, transactionId: string): Promise<boolean> {
    const state = await this.getWalletState();
    
    // Find the pending transaction
    const transactionIndex = state.transactions.findIndex(
      t => t.orderId === orderId && t.status === 'pending'
    );
    
    if (transactionIndex === -1) {
      console.error('No pending transaction found with orderId:', orderId);
      return false;
    }
    
    // Update the transaction
    const transaction = state.transactions[transactionIndex];
    state.transactions[transactionIndex] = {
      ...transaction,
      status: 'completed',
      transactionId
    };
    
    // Update balance
    state.balance += transaction.amount;
    
    // Clear pending order
    state.pendingOrderId = undefined;
    await AsyncStorage.removeItem(PENDING_ORDER_KEY);
    
    // Save updated state
    await this.saveWalletState(state);
    
    return true;
  }

  // Fail a pending deposit
  async failDeposit(orderId: string): Promise<void> {
    const state = await this.getWalletState();
    
    // Find the pending transaction
    const transactionIndex = state.transactions.findIndex(
      t => t.orderId === orderId && t.status === 'pending'
    );
    
    if (transactionIndex !== -1) {
      // Update the transaction status
      state.transactions[transactionIndex] = {
        ...state.transactions[transactionIndex],
        status: 'failed'
      };
      
      // Clear pending order
      state.pendingOrderId = undefined;
      await AsyncStorage.removeItem(PENDING_ORDER_KEY);
      
      // Save updated state
      await this.saveWalletState(state);
    }
  }

  // Get transaction history
  async getTransactionHistory(): Promise<Transaction[]> {
    const state = await this.getWalletState();
    return state.transactions;
  }

  // Check for pending transactions
  async getPendingOrderId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(PENDING_ORDER_KEY);
    } catch (error) {
      console.error('Error getting pending order ID:', error);
      return null;
    }
  }
}

// Export singleton instance
export default new WalletService();