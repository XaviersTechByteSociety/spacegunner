import { collection, setDoc, serverTimestamp, doc, getDoc, updateDoc, query, orderBy, getDocs } from "@firebase/firestore";
import { db } from "../../firebase/firebase-conf";

const colRef = collection(db, 'users');
const q = query(colRef, orderBy('highScore', 'desc'));

export const userHighScore = {
    highScore: 0,
}

// Function to retrieve leaderboard data
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

// Retry logic for adding a document (3 attempts max)
async function retryAddDocument(user, attempts = 3) {
    while (attempts > 0) {
        try {
            await addDocument(user);  // Attempt to add document
            return; // Success, exit function
        } catch (err) {
            console.error(`Failed to create document for user: ${user.uid}, Attempt ${attempts}`, err.message);
            attempts--;
            if (attempts > 0) await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
    }
}

// Add a new document to Firestore for a user
export async function addDocument(user) {
    const docRef = doc(db, 'users', user.uid);

    try {
        // Check if the user data is valid before writing to Firestore
        if (!user.uid || !user.email) {
            throw new Error("Invalid user data: Missing UID or email.");
        }

        // Create a new document
        await setDoc(docRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'NA',
            regNo: user.regNo || 'NA',
            score: 0,
            highScore: 0,
            timeStamp: serverTimestamp(),
        });
        console.log(`Document added successfully for user: ${user.uid}`);
    } catch (err) {
        console.error('Error adding document:', err.message);
        throw err; // Re-throw error to be handled by retry logic if needed
    }
}

// Update an existing document or add if it doesn't exist
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
            console.log(`Document updated for user: ${userID}`);
            return getDocument(userID); // Return the document data after update
        } else {
            // Document does not exist, create it
            console.warn(`No document found for user: ${userID}. Creating a new one.`);
            await retryAddDocument({ uid: userID, email: 'unknown', highScore }); // Retry adding document if needed
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
            console.log(`Fetched document for user: ${userId}`);
            return docSnap.data();
        } else {
            console.error('No such document for user:', userId);
        }
    } catch (err) {
        console.error('Error getting document:', err.message);
    }
}
