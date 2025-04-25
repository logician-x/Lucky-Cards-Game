import { StyleSheet, Dimensions } from "react-native";

// Get device dimensions
const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 400, height / 800); // Base scale factor
const itemSize = Math.min(width / 8, height / 5);

export const styles = StyleSheet.create({
  // Modified to only contain chipSelection
  bottomSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  
  chipSelectionContainer: {
    backgroundColor: 'rgba(236, 221, 221, 0.5)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginTop: 160,
    alignSelf: 'center',
    width: width > 400 ? 600 : width * 0.65,
  },
  chipSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft:100,
    flexWrap: 'wrap',
    height: 50,
  },
  chipButton: {
    marginTop: 0,
    marginLeft: 10,
    alignItems: 'center',
    marginHorizontal: 0,
    marginVertical: 2,
    opacity: 10,
  },
  selectedChip: {
    opacity: 1,
    transform: [{ scale: 1.75 }],
    elevation: 5, // For Android
  },
  disabledChip: {
    opacity: 0.4,
  },
  chipImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  clearButton: {
    backgroundColor: '#ff4b5c',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rowWithButton: {
  height:60,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 10,
},

});