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
import coin5 from '../assets/images/5.png';
import coin10 from '../assets/images/10.png';
import coin20 from '../assets/images/20.png';
import coin50 from '../assets/images/50.png';
import coin100 from '../assets/images/100.png';
import coin500 from '../assets/images/500.png';
import coin1 from '../assets/images/coin1.png';
import walletIcon from '../assets/images/avtar.png';
import ladyPresenter from '../assets/images/lady.png';
import backgroundImage from '../assets/images/bg.jpg';
export const coinImage = require('../assets/images/coin1.png');
export const coinBagImage = require('../assets/images/avtar.png');
// Item images array
export const itemImages = [
  umbrella, football, sun, diva, cow, bucket,
  ki, top, rose, butterfly, crow, rabbit
];

// Coin images - separate images for each denomination
export const coinImages = {
  5: coin5,
  10: coin10,
  20: coin20,
  50: coin50,
  100: coin100,
  500: coin500,
};

// Generic placed bet coin image (visible to all users)
export const publicCoinImage = coin1;

export { walletIcon, ladyPresenter, backgroundImage };