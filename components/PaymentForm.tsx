import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

type Provider = {
  id: string;
  name: string;
  icon: string;
};
// UPI payment providers
const UPI_PROVIDERS: Provider[] = [
  { id: 'gpay', name: 'Google Pay', icon: '🔵' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
  { id: 'paytm', name: 'Paytm', icon: '🔷' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🟢' },
  { id: 'amazon', name: 'Amazon Pay', icon: '🟠' },
];


interface PaymentFormProps {
  visible: boolean;
  onClose: () => void;
  type: 'add' | 'withdraw';
}

const PaymentForm: React.FC<PaymentFormProps> = ({ visible, onClose, type }) => {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Animation values
  const confettiAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    // Reset form when modal opens
    if (visible) {
      setUpiId('');
      setAmount('');
      setSelectedProvider(null);
      setSuccess(false);
      setErrorMsg('');
    }
  }, [visible]);

  const handleSubmit = () => {
    // Validate form
    if (!upiId.includes('@')) {
      setErrorMsg('Please enter a valid UPI ID (e.g., username@upi)');
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setErrorMsg('Please enter a valid amount');
      return;
    }
    
    if (!selectedProvider) {
      setErrorMsg('Please select a payment provider');
      return;
    }
    
    setErrorMsg('');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Start celebration animation
      Animated.parallel([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        })
      ]).start();
      
      // Close modal after celebration
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1500);
  };
  
  const getFormTitle = () => {
    return type === 'add' ? 'Add Funds' : 'Withdraw Funds';
  };
  
  const getButtonText = () => {
    return type === 'add' ? 'Add Funds' : 'Withdraw Now';
  };
  
  // Create confetti elements
  const renderConfetti = () => {
    const confetti = [];
    const colors = ['#FF4136', '#2ECC40', '#0074D9', '#FFDC00', '#B10DC9', '#FF851B'];
    
    for (let i = 0; i < 30; i++) {
      const translateY = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, Math.random() * 200 + 100],
      });
      
      const translateX = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, (Math.random() * 300) - 150],
      });
      
      const rotate = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `${Math.random() * 360}deg`],
      });
      
      const opacity = confettiAnim.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [1, 1, 0],
      });
      
      confetti.push(
        <Animated.View
          key={i}
          style={[
            styles.confetti,
            {
              backgroundColor: colors[i % colors.length],
              transform: [{ translateY }, { translateX }, { rotate }],
              opacity,
              left: `${Math.random() * 100}%`,
            },
          ]}
        />
      );
    }
    
    return confetti;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{getFormTitle()}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={{ fontSize: 22, color: '#333' }}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {success ? (
            // Success view with celebration
            <View style={styles.successContainer}>
              {renderConfetti()}
              <Animated.View
                style={[
                  styles.successIconContainer,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <Text style={{ fontSize: 50, color: '#4CAF50' }}>✓</Text>
              </Animated.View>
              <Text style={styles.successText}>
                {type === 'add' 
                  ? 'Payment request sent successfully!' 
                  : 'Withdrawal initiated successfully!'}
              </Text>
              <Text style={styles.successSubText}>
                {type === 'add'
                  ? `Please complete the payment of ₹${amount} in your ${selectedProvider?.name} app`
                  : `₹${amount} will be credited to your account shortly`}
              </Text>
            </View>
          ) : (
            // Form view
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>UPI ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="yourname@upi"
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Payment Method</Text>
                <View style={styles.providersContainer}>
                  {UPI_PROVIDERS.map((provider) => (
                    <TouchableOpacity
                      key={provider.id}
                      style={[
                        styles.providerButton,
                        selectedProvider?.id === provider.id && styles.selectedProvider,
                      ]}
                      onPress={() => setSelectedProvider(provider)}
                    >
                      <Text style={styles.providerIcon}>{provider.icon}</Text>
                      <Text style={styles.providerName}>{provider.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
              
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  type === 'add' ? styles.addButton : styles.withdrawButton,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>{getButtonText()}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  providersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  providerButton: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedProvider: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0fff0',
  },
  providerIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  providerName: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  withdrawButton: {
    backgroundColor: '#FF9800',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fff0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  successSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    width: 10,
    height: 10,
    borderRadius: 3,
  },
});

export default PaymentForm;