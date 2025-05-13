// AddMoneyScreen.tsx
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
  Linking,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import walletService from '../../services/walletService';

// Predefined amount options
const AMOUNT_OPTIONS = [100, 200, 500, 1000, 2000, 5000];

const AddMoneyScreen: React.FC = () => {
  const router = useRouter();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Handler for predefined amount buttons
  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };
  
  // Handler for custom amount input
  const handleAmountChange = (text: string) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setAmount(text);
    }
  };
  
  // Handler for the "Add Money" button
  const handleAddMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    
    try {
      setLoading(true);
      
      // In production, you would get the UPI ID from your backend
      const merchantUpiId = "merchantid@ybl";
      const transactionNote = "Add money to wallet";
      const merchantName = "Casino App";
      const orderId = `ORDER${Date.now()}`;
      
      // Create a pending transaction in the wallet service
      await walletService.createPendingDeposit(
        parseFloat(amount),
        orderId,
        merchantUpiId
      );
      
      // Construct the UPI payment URI
      const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${orderId}`;
      
      // Check if the URI can be opened
      const canOpen = await Linking.canOpenURL(upiUrl);
      
      if (canOpen) {
        // Open the UPI app
        await Linking.openURL(upiUrl);
        
        // Navigate to the confirmation screen after a small delay
        // This gives time for the UPI app to open
        setTimeout(() => {
          setLoading(false);
          router.push({
            pathname: '/TransactionConfirmScreen',
            params: { amount, orderId }
          });
        }, 1000);
      } else {
        setLoading(false);
        Alert.alert('Error', 'No UPI app found on your device.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
    }
  };
  
  // Handler for the back button
  const handleBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B4513" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Money</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Amount Input Section */}
        <View style={styles.amountContainer}>
          <Text style={styles.label}>Enter Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
              maxLength={6} // Limit to reasonable amounts
            />
          </View>
          
          {/* Predefined Amount Options */}
          <View style={styles.amountOptionsContainer}>
            {AMOUNT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.amountOption,
                  amount === option.toString() && styles.selectedAmountOption
                ]}
                onPress={() => handleAmountSelect(option)}
              >
                <Text 
                  style={[
                    styles.amountOptionText,
                    amount === option.toString() && styles.selectedAmountOptionText
                  ]}
                >
                  ₹{option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* UPI Apps Section */}
        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.paymentMethodsTitle}>
            Payment will open in your UPI app
          </Text>
          <Text style={styles.paymentMethodsSubtitle}>
            Supported apps: PhonePe, Google Pay, Paytm, and other UPI apps
          </Text>
        </View>
        
        {/* Add Money Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMoney}
          disabled={loading || !amount}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Proceed to Payment</Text>
          )}
        </TouchableOpacity>
        
        {/* Terms and Notice */}
        <Text style={styles.termsText}>
          By continuing, you agree to our payment terms and conditions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8B4513',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  amountContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingBottom: 8,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 0,
  },
  amountOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  amountOption: {
    width: '31%',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedAmountOption: {
    backgroundColor: '#8B4513',
  },
  amountOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  selectedAmountOptionText: {
    color: '#FFFFFF',
  },
  paymentMethodsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  paymentMethodsSubtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AddMoneyScreen;