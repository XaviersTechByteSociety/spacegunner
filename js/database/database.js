import { collection, setDoc, serverTimestamp, doc, getDoc, updateDoc, query, orderBy, getDocs } from "@firebase/firestore";
import { db } from "../../firebase/firebase-conf";

const colRef = collection(db, 'users');
const q = query(colRef, orderBy('highScore', 'desc'));

export const userHighScore = {
    highScore: 0,
}

export async function getLeaderboard() {
    try {
        const snapshot = await getDocs(q); // Query ordered by high score
        let users = [];
        snapshot.docs.forEach((doc) => {
            users.push(doc.data());
        });
        return users; // Return the fetched users list
    } catch (err) {
        console.error("Error fetching leaderboard:", err.message);
    }
}

// Update an existing document
export async function updateDocument(userID, highScore) {
    const docRef = doc(db, 'users', userID);

    try {
        // Check if the document exists before updating
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Document exists, update it
            await updateDoc(docRef, { 
                highScore: highScore,
            });
            return getDocument(userID); // Return the document data after update
        } else {
            // Document does not exist, log or handle the situation
            console.error('No document found to update for user:', userID);
        }
    } catch (err) {
        console.error('Error updating document:', err.message);
    }
}

// Fetch a document by userID
export async function getDocument(userId) {
    const docRef = doc(db, 'users', userId);

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            userHighScore.highScore = docSnap.data().highScore;
        } else {
            console.error('No such document!');
        }
    } catch (err) {
        console.error('Error getting document:', err.message);
    }
}

// Add a new document to Firestore for a user
export async function addDocument(user) {
    const docRef = doc(db, 'users', user.uid);

    try {
        // Create a new document
        await setDoc(docRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'NA',
            regNo: user.regNo,
            score: 0,
            highScore: 0,
            timeStamp: serverTimestamp(),
        });
    } catch (err) {
        console.error('Error adding document:', err.message);
    }
}
