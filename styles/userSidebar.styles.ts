// styles/userSidebar.styles.ts
import { StyleSheet, Platform } from 'react-native';

export const userSidebarStyles = StyleSheet.create({
  container: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999, 
  elevation: 10, 
},
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    backgroundColor: '#221A14',
    borderRightWidth: 1,
    borderColor: '#8B4513',
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
  },
  profileSection: {
    flexDirection: 'row', 
     alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#5D4037',
    backgroundColor: '#362920',
  },
  profileImageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 15,
    marginRight: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  userInfoContainer: {
    alignItems: 'flex-start',
  },
  vipBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 10,
  },
  vipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  username: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userId: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  balanceSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#5D4037',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  balanceValue: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#5D4037',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  contactLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  contactValue: {
    color: '#FFFFFF',
    fontSize: 16,
  },
 
  arrowIcon: {
    color: '#A0A0A0',
    fontSize: 22,
  },
  logoutButton: {
     marginTop: 10,
     marginBottom: 30,
     marginHorizontal: 20,
    backgroundColor: '#8B4513',
    borderRadius: 25,
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    alignSelf: 'flex-end', 
   borderWidth: 2,
    borderColor: '#D4AF37',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
   modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 modalContainer: {
  backgroundColor: '#1A1205',
  margin: 20,
  borderRadius: 12,
  padding: 15,                    
  width: '75%',                  
  borderWidth: 2,
  borderColor: '#F5C518',        
  shadowColor: '#F5C518',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 5,
},

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#F5C518', // Yellow text
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  avatarButton: {
    margin: 8,
    borderWidth: 2,
    borderRadius: 35,
    padding: 3,
    borderColor: '#F5C518', // Yellow border
    backgroundColor: '#2A1F0D' // Lighter brown background
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#3A2A12' // Subtle separator
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#3A2A12', // Dark brown button
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 6
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#F5C518', // Yellow button
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 6
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#F5C518', // Yellow text
    fontWeight: 'bold'
  },
  confirmButtonText: {
    textAlign: 'center',
    color: '#1A1205', // Dark brown text
    fontWeight: 'bold'
  }
});
