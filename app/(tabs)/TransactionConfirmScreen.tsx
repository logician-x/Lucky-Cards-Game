// TransactionConfirmScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import wallet and API services
import walletService from '../../services/walletService';
import apiService from '../../services/apiService';

// Verify payment through API service
const verifyPayment = async (amount: string, orderId: string, transactionId: string): Promise<boolean> => {
  try {
    // First, call the backend API to verify the payment
    const response = await apiService.verifyUpiPayment(
      parseFloat(amount),
      orderId,
      transactionId
    );
    
    if (response.success && response.data?.verified) {
      // If API verification succeeded, update local wallet
      const success = await walletService.completeDeposit(orderId, transactionId);
      return success;
    } else {
      console.log('Payment verification failed:', response.error || response.data?.message);
      await walletService.failDeposit(orderId);
      return false;
    }
  } catch (error) {
    console.error('Error during payment verification:', error);
    await walletService.failDeposit(orderId);
    return false;
  }
};

const TransactionConfirmScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [transactionId, setTransactionId] = useState<string>('');
  const [status, setStatus] = useState<'waiting' | 'verifying' | 'success' | 'failure'>('waiting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Get amount and orderId from navigation params, with default fallbacks
  const amount = (params.amount as string) || '0';
  const orderId = (params.orderId as string) || '';
  
  // Validate transaction ID
  const isValidTransactionId = (id: string): boolean => {
    // A very basic validation - modify according to your expected transaction ID format
    return id.trim().length >= 10;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!isValidTransactionId(transactionId)) {
      setErrorMessage('Please enter a valid transaction ID');
      return;
    }
    
    setErrorMessage('');
    setStatus('verifying');
    
    try {
      const success = await verifyPayment(amount, orderId, transactionId);
      
      if (success) {
        setStatus('success');
        
        // Wait for 2 seconds to show success message before redirecting
        setTimeout(() => {
          // Navigate back to home screen
          router.replace('/(tabs)');
        }, 2000);
      } else {
        setStatus('failure');
        setErrorMessage('Failed to verify payment. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failure');
      setErrorMessage('An error occurred. Please try again.');
    }
  };
  
  // Handler for the cancel button
  const handleCancel = () => {
    Alert.alert(
      'Cancel Transaction',
      'Are you sure you want to cancel this transaction?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => router.replace('/(tabs)/AddMoneyScreen'),
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B4513" barStyle="light-content" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Payment Confirmation</Text>
          </View>
          
          {/* Status */}
          <View style={styles.statusContainer}>
            {status === 'success' ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Text style={styles.successIcon}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Payment Successful!</Text>
                <Text style={styles.successMessage}>
                  ₹{amount} has been added to your wallet.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoTitle}>
                    Did you complete the payment?
                  </Text>
                  <Text style={styles.infoDescription}>
                    If you've completed the payment through your UPI app, please enter the transaction ID below.
                  </Text>
                </View>
                
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={styles.detailValue}>₹{amount}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order ID:</Text>
                    <Text style={styles.detailValue}>{orderId}</Text>
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Transaction ID:</Text>
                  <TextInput
                    style={styles.input}
                    value={transactionId}
                    onChangeText={setTransactionId}
                    placeholder="Enter UPI transaction reference ID"
                    placeholderTextColor="#999"
                    autoCapitalize="characters"
                  />
                  {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  ) : null}
                  <Text style={styles.inputHelp}>
                    You can find this in your UPI app payment history.
                  </Text>
                </View>
              </>
            )}
          </View>
          
          {/* Action Buttons */}
          {status !== 'success' && (
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={status === 'verifying'}
              >
                {status === 'verifying' ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Verify Payment</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={status === 'verifying'}
              >
                <Text style={styles.cancelButtonText}>
                  I didn't complete the payment
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Support Section */}
          <View style={styles.supportContainer}>
            <Text style={styles.supportText}>
              Having trouble? Contact our support team for assistance.
            </Text>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  inputHelp: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 6,
  },
  actionContainer: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 14,
  },
  supportContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  supportText: {
    fontSize: 13,
    color: '#777',
    marginBottom: 10,
    textAlign: 'center',
  },
  supportButton: {
    paddingVertical: 8,
  },
  supportButtonText: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default TransactionConfirmScreen;