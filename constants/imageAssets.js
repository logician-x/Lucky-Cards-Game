// Image imports
import umbrella from '../assets/images/umbrella.jpg';
import football from '../assets/images/football.jpeg';
import sun from '../assets/images/sun.jpeg';
import diva from '../assets/images/Diva.jpg';
import ki from '../assets/images/ki.png';
import top from '../assets/images/top.jpg';
import rose from '../assets/images/rose.jpg';
import butterfly from '../assets/images/Butterfly.jpg';
import cow from '../assets/images/cow.jpg';
import bucket from '../assets/images/bucket.jpeg';
import crow from '../assets/images/crow.jpg';
import rabbit from '../assets/images/rabbit.jpg';
import coin from '../assets/images/coin.png';
import coin1 from '../assets/images/coin1.png';
import walletIcon from '../assets/images/wallet.png';
import ladyPresenter from '../assets/images/lady.png';
import backgroundImage from '../assets/images/bg.jpg';

// Item images array
export const itemImages = [
  umbrella, football, sun, diva, cow, bucket,
  ki, top, rose, butterfly, crow, rabbit
];

// Coin images - separate images for each denomination
export const coinImages = {
  5: coin,
  10: coin,
  20: coin,
  30: coin,
  70: coin,
  100: coin,
};

// Generic placed bet coin image (visible to all users)
export const publicCoinImage = coin1;

export { walletIcon, ladyPresenter, backgroundImage };