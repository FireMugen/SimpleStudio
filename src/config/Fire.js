import firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyCBd78yY9bngvyXh4befoXMiK-b-mnIALc",
	authDomain: "simple-studio-2b931.firebaseapp.com",
	databaseURL: "https://simple-studio-2b931.firebaseio.com",
	projectId: "simple-studio-2b931",
	storageBucket: "simple-studio-2b931.appspot.com",
	messagingSenderId: "887864254461",
	appId: "1:887864254461:web:266ded447123e296"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
export default fire;
