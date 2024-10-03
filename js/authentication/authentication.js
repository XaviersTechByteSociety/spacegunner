import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut, signInWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser as firebaseDeleteUser } from "firebase/auth";
import { auth } from '../../firebase/firebase-conf';
import { addDocument } from "../database/database";

const signUpForm = document.querySelector('#sign-up');
const logInForm = document.querySelector('#log-in');
const logout = document.querySelector('#logout');
const deleteForm = document.querySelector('#delete-account-form');
export const userCred = {
    uid: null,
    name: null,
};
function notification() {
    //TODO
    console.log('notification');
}

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
            Toastify({
                text: "Logged out successful!", // Text to display in the toast
                duration: 3000,            // Duration in milliseconds (3 seconds in this case)
                close: true,               // Show a close button
                gravity: "top",            // Position the toast at the top
                position: "right",         // Display toast on the right side
                style: {
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid cyan",
                    padding: ".5rem",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        })
        .then(() => {
            window.location.href = 'https://space-gunner.netlify.app';
        })
        .catch(err => console.error(err.message));
});

if (deleteForm) deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = deleteForm.email.value;
    const password = deleteForm.password.value;
    deleteUser(email, password);
})

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

        await Toastify({
            text: "Sign up successful!", // Text to display in the toast
            duration: 3000,            // Duration in milliseconds (3 seconds in this case)
            close: true,               // Show a close button
            gravity: "top",            // Position the toast at the top
            position: "right",         // Display toast on the right side
            style: {
                background: "rgba(0, 0, 0, 0.5)",
                border: "2px solid cyan",
                padding: ".5rem",
                zIndex: '400',
                backdropFilter: 'blur(10px)',
            }
        }).showToast();

        // Redirect only after everything completes
        window.location.href = 'https://space-gunner.netlify.app';
    } catch (err) {
        console.error(err.message);
    }
}


function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            Toastify({
                text: "Login successful!", // Text to display in the toast
                duration: 3000,            // Duration in milliseconds (3 seconds in this case)
                close: true,               // Show a close button
                gravity: "top",            // Position the toast at the top
                position: "right",         // Display toast on the right side
                style: {
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid cyan",
                    padding: ".5rem",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        })
        .then(cred => {
            window.location.href = 'https://space-gunner.netlify.app';
        })
        .catch(err => {
            if (err.code === 'auth/invalid-credential') {
                Toastify({
                    text: "Check you Email and password and try again.", // Text to display in the toast
                    duration: 3000,            // Duration in milliseconds (3 seconds in this case)
                    close: true,               // Show a close button
                    gravity: "top",            // Position the toast at the top
                    position: "right",         // Display toast on the right side
                    style: {
                        fontSize: '.8rem',
                        background: "rgba(0, 0, 0, 0.5)",
                        border: "2px solid red",
                        padding: ".5rem",
                        zIndex: '400',
                        backdropFilter: 'blur(10px)',
                    }
                }).showToast();
            }
            else if (err.code === 'auth/too-many-requests') {
                Toastify({
                    text: "Too many login attempts try again later.", // Text to display in the toast
                    duration: 3000,            // Duration in milliseconds (3 seconds in this case)
                    close: true,               // Show a close button
                    gravity: "top",            // Position the toast at the top
                    position: "right",         // Display toast on the right side
                    style: {
                        fontSize: '.8rem',
                        background: "rgba(0, 0, 0, 0.5)",
                        border: "2px solid red",
                        padding: ".5rem",
                        zIndex: '400',
                        backdropFilter: 'blur(10px)',
                    }
                }).showToast();
            }
            else {
                console.error(err.message);
            }
        })
}

function deleteUser(email, password) {
    const user = auth.currentUser;

    if (!user) {
        // If no user is signed in, sign in the user with email and password first
        signInWithEmailAndPassword(auth, email, password)
            .then(cred => {
                // Once signed in, proceed to delete the account
                return deleteAfterAuth(cred.user, email, password);
            })
            .catch((error) => {
                if (err.code === 'auth/invalid-credential') {
                    Toastify({
                        text: "Check you Email and password and try again.", // Text to display in the toast
                        duration: 3000,            // Duration in milliseconds (3 seconds in this case)
                        close: true,               // Show a close button
                        gravity: "top",            // Position the toast at the top
                        position: "right",         // Display toast on the right side
                        style: {
                            fontSize: '.8rem',
                            background: "rgba(0, 0, 0, 0.5)",
                            border: "2px solid red",
                            padding: ".5rem",
                            zIndex: '400',
                            backdropFilter: 'blur(10px)',
                        }
                    }).showToast();
                }
                else if (err.code === 'auth/too-many-requests') {
                    Toastify({
                        text: "Too many login attempts try again later.", // Text to display in the toast
                        duration: 3000,            // Duration in milliseconds (3 seconds in this case)
                        close: true,               // Show a close button
                        gravity: "top",            // Position the toast at the top
                        position: "right",         // Display toast on the right side
                        style: {
                            fontSize: '.8rem',
                            background: "rgba(0, 0, 0, 0.5)",
                            border: "2px solid red",
                            padding: ".5rem",
                            zIndex: '400',
                            backdropFilter: 'blur(10px)',
                        }
                    }).showToast();
                }
                else {
                    console.error('Error signing in user: ', error.message);
                }
            });
    } else {
        // If user is already signed in, proceed with deletion
        deleteAfterAuth(user, email, password);
    }
}

function deleteAfterAuth(user, email, password) {
    const credential = EmailAuthProvider.credential(email, password);

    // Reauthenticate the user before deletion
    reauthenticateWithCredential(user, credential)
        .then(() => {
            // After reauthenticating, delete the user
            return firebaseDeleteUser(user);
        })
        .then(() => {
            console.log('User account deleted successfully.');
        })
        .then(() => {
            Toastify({
                text: "Deleted user successful!", // Text to display in the toast
                duration: 3000,            // Duration in milliseconds (3 seconds in this case)
                close: true,               // Show a close button
                gravity: "top",            // Position the toast at the top
                position: "right",         // Display toast on the right side
            }).showToast();
        })
        .then(() => {
            deleteForm.reset();
        })
        .then(() => {
            window.location.href = 'https://space-gunner.netlify.app'; // Redirect after deletion
        })
        .catch((error) => {
            console.error('Error deleting user: ', error.message);
        });
}



function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            userCred.uid = user.uid ? user.uid : null;
            userCred.name = user.displayName ? user.displayName : null;
            // console.log(user)
        } else {
            // User is logged out
            userCred.uid = null
            userCred.name = null; // Reset userCred when logged out
        }
    });
}

