// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB5vzV3XHPlK83K3Rkz_12eeZkueWZZXjs',
  authDomain: 'cs3216-a3-g5-fe.firebaseapp.com',
  projectId: 'cs3216-a3-g5-fe',
  storageBucket: 'cs3216-a3-g5-fe.appspot.com',
  messagingSenderId: '612514582164',
  appId: '1:612514582164:web:8784e54db78d00785dae81',
  measurementId: 'G-1NZ4W33R2V',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
