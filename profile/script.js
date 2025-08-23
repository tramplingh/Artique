
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
const db = firebase.firestore();

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
const artistSection = document.getElementById('artist-section'); 
const enthusiastSection = document.getElementById('enthusiast-section');
const publishedWorksSection = document.getElementById('published-works-section'); // NEW: Published works section

let selectedRole = 'enthusiast';

// --- EVENT LISTENERS ---

enthusiastBtn.addEventListener('click', () => {
    selectedRole = 'enthusiast';
    enthusiastBtn.classList.add('active');
    artistBtn.classList.remove('active');
});

artistBtn.addEventListener('click', () => {
    selectedRole = 'artist';
    artistBtn.classList.add('active');
    enthusiastBtn.classList.remove('active');
});

signupBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    errorMessage.textContent = '';

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            return db.collection('users').doc(user.uid).set({
                email: user.email,
                role: selectedRole,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .catch(error => errorMessage.textContent = error.message);
});

signinBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    errorMessage.textContent = '';
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => errorMessage.textContent = error.message);
});

signoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// --- AUTH STATE OBSERVER ---
auth.onAuthStateChanged(user => {
    if (user) {
        const userDocRef = db.collection('users').doc(user.uid);
        userDocRef.get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const userRole = userData.role;

                authContainer.classList.add('d-none');
                userDashboard.classList.remove('d-none');
                userEmailDisplay.textContent = user.email;
                userRoleDisplay.textContent = userRole;

                // ** UPDATED LOGIC **: Show sections based on user role
                if (userRole === 'artist') {
                    artistSection.classList.remove('d-none');
                    publishedWorksSection.classList.remove('d-none'); // Show published works
                    enthusiastSection.classList.add('d-none');
                } else if (userRole === 'enthusiast') {
                    enthusiastSection.classList.remove('d-none');
                    artistSection.classList.add('d-none');
                    publishedWorksSection.classList.add('d-none'); // Hide published works
                } else {
                    artistSection.classList.add('d-none');
                    enthusiastSection.classList.add('d-none');
                    publishedWorksSection.classList.add('d-none');
                }

            } else {
                errorMessage.textContent = "Your user profile could not be found.";
                auth.signOut();
            }
        });
    } else {
        authContainer.classList.remove('d-none');
        userDashboard.classList.add('d-none');
    }
});

// --- ARTIST FORM LOGIC ---
const submitArtBtn = document.getElementById('submit-art-btn');
const successMessage = document.getElementById('success-message');

submitArtBtn.addEventListener('click', () => {
    const title = document.getElementById('art-title').value;
    const description = document.getElementById('art-description').value;
    const imageFile = document.getElementById('art-image').files[0];
    const price = document.getElementById('art-price').value;
    const type = document.querySelector('input[name="art-type"]:checked').value;

    console.log("--- New Artwork Submission ---");
    console.log("Title:", title);
    console.log("Image File:", imageFile ? imageFile.name : 'No file selected');
    console.log("Price:", price);
    console.log("Type:", type);

    successMessage.textContent = `"${title}" has been submitted for review!`;

    setTimeout(() => {
        document.getElementById('art-title').value = '';
        document.getElementById('art-description').value = '';
        document.getElementById('art-image').value = '';
        document.getElementById('art-price').value = '';
        successMessage.textContent = '';
    }, 3000);
});
