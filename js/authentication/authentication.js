import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut, signInWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser as firebaseDeleteUser, sendPasswordResetEmail } from "firebase/auth";
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



if (logout) logout.addEventListener('click', logoutUser);

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
            text: "Sign up successful!\nRedirecting ...",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                fontSize: "14px",
                maxWidth: "fit-content",
                background: "rgba(0, 0, 0, 0.5)",
                border: "2px solid cyan",
                padding: ".5rem",
                color: "#ffffff",
                wordWrap: "break-word",
                textAlign: "center",
                zIndex: '400',
                backdropFilter: 'blur(10px)',
            }
        }).showToast();

        // Redirect only after everything completes
        setTimeout(() => {
            window.location.href = 'https://space-gunner.netlify.app';
        }, 2000);
    } catch (err) {
        console.error(err.message);
    }
}

async function loginUser(email, password) {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        if (cred.user) {
            Toastify({
                text: "Login successful!\nRedirecting ...",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    fontSize: "14px",
                    maxWidth: "fit-content",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid cyan",
                    padding: ".5rem",
                    color: "#ffffff",
                    wordWrap: "break-word",
                    textAlign: "center",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        }

        setTimeout(() => {
            window.location.href = 'https://space-gunner.netlify.app';
        }, 2000);

    } catch (err) {
        if (err.code === 'auth/invalid-credential') {
            Toastify({
                text: "Check you Email and password and try again.",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    fontSize: "14px",
                    maxWidth: "fit-content",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid red",
                    padding: ".5rem",
                    color: "#ffffff",
                    wordWrap: "break-word",
                    textAlign: "center",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        }
        else if (err.code === 'auth/too-many-requests') {
            Toastify({
                text: "Too many login attempts try again later.",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    fontSize: "14px",
                    maxWidth: "fit-content",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid red",
                    padding: ".5rem",
                    color: "#ffffff",
                    wordWrap: "break-word",
                    textAlign: "center",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        }
        else if (err.code === 'auth/invalid-credential') {
            Toastify({
                text: "Check you Email and password and try again.",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    fontSize: "14px",
                    maxWidth: "fit-content",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid red",
                    padding: ".5rem",
                    color: "#ffffff",
                    wordWrap: "break-word",
                    textAlign: "center",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        }
        else if (err.code === 'auth/too-many-requests') {
            Toastify({
                text: "Too many login attempts try again later.",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    fontSize: "14px",
                    maxWidth: "fit-content",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid red",
                    padding: ".5rem",
                    color: "#ffffff",
                    wordWrap: "break-word",
                    textAlign: "center",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        }
        else {
            console.error(err.message);
            Toastify({
                text: `${err.code}`,
                duration: 2000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    fontSize: "14px",
                    maxWidth: "fit-content",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid red",
                    padding: ".5rem",
                    color: "#ffffff",
                    wordWrap: "break-word",
                    textAlign: "center",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        }
    }
}


async function logoutUser(e) {
    try {
        if (e) e.preventDefault()
        await signOut(auth)

        Toastify({
            text: "Log out successful!\nRedirecting ...",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                fontSize: "14px",
                maxWidth: "fit-content",
                background: "rgba(0, 0, 0, 0.5)",
                border: "2px solid cyan",
                padding: ".5rem",
                color: "#ffffff",
                wordWrap: "break-word",
                textAlign: "center",
                zIndex: '400',
                backdropFilter: 'blur(10px)',
            }
        }).showToast();

        setTimeout(() => {
            window.location.href = 'https://space-gunner.netlify.app';
        }, 2000);
    } catch (err) {
        console.error(err.message);
        Toastify({
            text: `${err.code}`,
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                fontSize: "14px",
                maxWidth: "fit-content",
                background: "rgba(0, 0, 0, 0.5)",
                border: "2px solid red",
                padding: ".5rem",
                color: "#ffffff",
                wordWrap: "break-word",
                textAlign: "center",
                zIndex: '400',
                backdropFilter: 'blur(10px)',
            }
        }).showToast();
    }
}


async function deleteUser(email, password) {
    const user = auth.currentUser;

    try {
        if (!user) {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            await deleteAfterAuth(cred.user, email, password)
        } else {
            deleteAfterAuth(user, email, password)
        }
    } catch (err) {
        if (err.code === 'auth/invalid-credential') {
            Toastify({
                text: "Check you Email and password and try again.",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    fontSize: "14px",
                    maxWidth: "fit-content",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid red",
                    padding: ".5rem",
                    color: "#ffffff",
                    wordWrap: "break-word",
                    textAlign: "center",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        }
        else if (err.code === 'auth/too-many-requests') {
            Toastify({
                text: "Too many login attempts try again later.",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    fontSize: "14px",
                    maxWidth: "fit-content",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid red",
                    padding: ".5rem",
                    color: "#ffffff",
                    wordWrap: "break-word",
                    textAlign: "center",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        }
        else {
            console.error('Error signing in user: ', err.message);
            Toastify({
                text: `${err.code}`,
                duration: 2000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    fontSize: "14px",
                    maxWidth: "fit-content",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "2px solid red",
                    padding: ".5rem",
                    color: "#ffffff",
                    wordWrap: "break-word",
                    textAlign: "center",
                    zIndex: '400',
                    backdropFilter: 'blur(10px)',
                }
            }).showToast();
        }
    }

}

async function deleteAfterAuth(user, email, password) {
    try {
        const cred = EmailAuthProvider.credential(email, password);

        await reauthenticateWithCredential(user, cred)

        await firebaseDeleteUser(user)

        Toastify({
            text: "Deleted user successful!\nRedirecting ...",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                fontSize: "14px",
                maxWidth: "fit-content",
                background: "rgba(0, 0, 0, 0.5)",
                border: "2px solid cyan",
                padding: ".5rem",
                color: "#ffffff",
                wordWrap: "break-word",
                textAlign: "center",
                zIndex: '400',
                backdropFilter: 'blur(10px)',
            }
        }).showToast();

        deleteForm.reset()

        setTimeout(() => {
            window.location.href = 'https://space-gunner.netlify.app';
        }, 2000);
    } catch (err) {
        console.log(err.message)
    }
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

