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
const artistEmailDisplay = document.getElementById('artist-email');
const signoutBtn = document.getElementById('signout-btn');
const submitArtBtn = document.getElementById('submit-art-btn');
const successMessage = document.getElementById('success-message');

// --- AUTH STATE OBSERVER ---
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in, display their email
        artistEmailDisplay.textContent = user.email;
    } else {
        // No user is signed in, redirect to the profile page
        console.log("No user is signed in. Redirecting to login page.");
        window.location.href = '../profile/profile.html';
    }
});

// --- EVENT LISTENERS ---

// Sign out button
signoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        // The onAuthStateChanged observer will handle the redirect
        console.log("User signed out");
    });
});

// Submit Artwork Button
submitArtBtn.addEventListener('click', () => {
    // Get form values
    const title = document.getElementById('art-title').value;
    const description = document.getElementById('art-description').value;
    const imageFile = document.getElementById('art-image').files[0];
    const price = document.getElementById('art-price').value;
    const type = document.querySelector('input[name="art-type"]:checked').value;

    // For the hackathon, we'll just log the data to the console.
    // In a real app, you would upload the image to Firebase Storage and
    // then save the artwork details (including the image URL) to Firestore Database.
    console.log("--- New Artwork Submission ---");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Image File:", imageFile);
    console.log("Price:", price);
    console.log("Type:", type);

    // Provide user feedback
    successMessage.textContent = `"${title}" has been submitted for review!`;

    // Clear the form after a short delay
    setTimeout(() => {
        document.getElementById('art-title').value = '';
        document.getElementById('art-description').value = '';
        document.getElementById('art-image').value = '';
        document.getElementById('art-price').value = '';
        successMessage.textContent = '';
    }, 3000);
});