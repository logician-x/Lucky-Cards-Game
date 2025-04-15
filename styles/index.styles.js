import { StyleSheet,Image } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    header: {
      backgroundColor: '#8B4513',
      padding: 0,
      paddingRight:40,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#DAA520',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      marginLeft:10,
      borderRadius: 20,
      backgroundColor: '#D32F2F',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarText: {
      color: 'white',
      fontSize: 10,
    },
    userTextContainer: {
      marginLeft: 10,
    },
    userName: {
      color: 'white',
      fontSize: 14,
    },
    userId: {
      color: '#CCCCCC',
      fontSize: 10,
    },
    balanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft:50,
    },
    balancePill: {
      backgroundColor: '#DAA520',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginHorizontal: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    currencySymbol: {
      color: '#FFD700',
      fontSize: 18,
    },
    balanceText: {
      color: 'white',
      marginLeft: 4,
      fontSize: 16,
    },
    actionButton: {
      backgroundColor: '#DAA520',
      padding: 6,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    withdrawButton: {
      backgroundColor: '#FFD700',
    },
    buttonText: {
      color: 'white',
    },
    iconButtonGroup: {
      flexDirection: 'row',
    },
    iconButton: {
      backgroundColor: '#FFD700',
      width: 32,
      height: 32,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    },
    notificationBanner: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 8,
      alignItems: 'center',
    },
    notificationText: {
      flexDirection: 'row',
    },
    tealText: {
      color: '#4DD0E1',
    },
    whiteText: {
      color: 'white',
    },
    yellowText: {
      color: '#FFD700',
    },
    orangeText: {
      color: '#FF7043',
    },
    mainContent: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    },
    gameCard: {
      width: 200,
      height: 200,
      backgroundColor: '#DAA520',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      position: 'relative',
    },
    hotTag: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: '#D32F2F',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderBottomLeftRadius: 8,
    },
    hotTagText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
    gameIcon: {
      width: 150,
      height: 150,
      backgroundColor: '#FFD700',
      borderRadius: 75,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    gameIconText: {
      color: '#8B4513',
      fontSize: 36,
      fontWeight: 'bold',
    },
    gameName: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    playButton: {
      position: 'absolute',
      bottom: -16,
      backgroundColor: '#FFD700',
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderRadius: 16,
    },
    playButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    jackpotDisplay: {
      backgroundColor: '#DAA520',
      borderRadius: 8,
      padding: 8,
      width: 250,
      alignItems: 'center',
      marginBottom: 16,
    },
    jackpotLabel: {
      color: 'white',
      fontSize: 12,
    },
    jackpotAmount: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
    },
    bottomNav: {
      backgroundColor: '#8B4513',
      padding: 8,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#DAA520',
    },
    navItem: {
      alignItems: 'center',
    },
    navIcon: {
      fontSize: 24,
    },
    navLabel: {
      color: 'white',
      fontSize: 10,
    },
  });