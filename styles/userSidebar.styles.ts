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
});
