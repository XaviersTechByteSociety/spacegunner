import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebase-conf';
import { addDocument } from "../database/database";

const signUpForm = document.querySelector('#sign-up');
const logInForm = document.querySelector('#log-in');
const logout = document.querySelector('#logout');
export const userCred = {
    uid: null,
    name: null,
};

checkAuth();

if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = signUpForm.name.value;
        const email = signUpForm.email.value;
        const password = signUpForm.password.value;
        const regNo = signUpForm.regno.value;
        registerUser(name, email, password, regNo);  // Pass regNo here
        signUpForm.reset();
    })
}

if (logInForm) {
    logInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = logInForm.email.value;
        const password = logInForm.password.value;
        loginUser(email, password);
        logInForm.reset;
    })
}

if (logout) logout.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('logged out');
        })
        .then(() => {
            window.location.href = 'https://space-gunner.netlify.app';
        })
        .catch(err => console.error(err.message));
});

// +++++++++++++++++ FUNCTION DEFINITION +++++++++++++++++

async function registerUser(name, email, password, regNo) {
    try {
        // Create user with email and password
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with the name
        await updateProfile(cred.user, { displayName: name });
        
        // Ensure addDocument creates a Firestore document
        if (auth.currentUser) {
            await addDocument({ ...cred.user, regNo });
        }

        // Redirect only after everything completes
        window.location.href = 'https://space-gunner.netlify.app';
    } catch (err) {
        console.error(err.message);
    }
}


function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(cred => {
            window.location.href = 'https://space-gunner.netlify.app';
        })
        .catch(err => console.error(err.message))
}

function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            userCred.uid = user.uid ? user.uid : null;
            userCred.name = user.displayName ? user.displayName : null;
        } else {
            // User is logged out
            userCred.uid = null
            userCred.name = null; // Reset userCred when logged out
        }
    });
}

