// **IMPORTANT**: PASTE YOUR FIREBASE CONFIGURATION HERE
const firebaseConfig = {
  apiKey: "AIzaSyBtvD88WjSaOf_FMhsUZvUKtdoZkK2DIoU",
  authDomain: "artique-afa63.firebaseapp.com",
  projectId: "artique-afa63",
  storageBucket: "artique-afa63.firebasestorage.app",
  messagingSenderId: "956681696244",
  appId: "1:956681696244:web:dea033faddb4aa31e0ffa1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const enthusiastBtn = document.getElementById('enthusiast-btn');
const artistBtn = document.getElementById('artist-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signup-btn');
const signinBtn = document.getElementById('signin-btn');
const signoutBtn = document.getElementById('signout-btn');
const errorMessage = document.getElementById('error-message');

const authContainer = document.getElementById('auth-container');
const userDashboard = document.getElementById('user-dashboard');
const userEmailDisplay = document.getElementById('user-email');
const userRoleDisplay = document.getElementById('user-role');

let userRole = 'enthusiast'; // Default role

// --- EVENT LISTENERS ---

// Role selection
enthusiastBtn.addEventListener('click', () => {
    userRole = 'enthusiast';
    enthusiastBtn.classList.add('active');
    artistBtn.classList.remove('active');
});

artistBtn.addEventListener('click', () => {
    userRole = 'artist';
    artistBtn.classList.add('active');
    enthusiastBtn.classList.remove('active');
});

// Sign up button
signupBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('User created:', user);
            // In a real app, you would save the userRole to a database here
            console.log('User role:', userRole); 
            errorMessage.textContent = '';
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
});

// Sign in button
signinBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User signed in:', user);
            errorMessage.textContent = '';
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
});

// Sign out button
signoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log('User signed out');
    });
});


// --- AUTH STATE OBSERVER ---
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        authContainer.classList.add('d-none');
        userDashboard.classList.remove('d-none');
        userEmailDisplay.textContent = user.email;
        
        // NOTE: This is a placeholder for role display. In a real app,
        // you would fetch the user's role from a database like Firestore.
        // For this hackathon, we'll just display the last selected role.
        userRoleDisplay.textContent = userRole;

    } else {
        // User is signed out
        authContainer.classList.remove('d-none');
        userDashboard.classList.add('d-none');
    }
});