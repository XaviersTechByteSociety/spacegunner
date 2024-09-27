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
        console.log('users', users)
        return users; // Return the fetched users list
    } catch (err) {
        console.error("Error fetching leaderboard:", err.message);
    }
}
export function updateDocument(userID, highScore) {
    const docRef = doc(db, 'users', userID);
    return updateDoc(docRef, {  // Return the promise here
        highScore: highScore,
    })
        .then(() => {
            console.log('Document updated ...');
            return getDocument(userID); // Return the promise from getDocument as well
        })
        .catch(err => {
            console.error('Error updating document:', err.message);
        });
}

export function getDocument(userId) {
    const docRef = doc(db, 'users', userId);
    return getDoc(docRef)
        .then((doc) => {
            if (doc.exists()) {
                console.log('User doc fetched: ', doc.data());
                userHighScore.highScore = doc.data().highScore;
            } else {
                console.log('No such document!');
            }
        })
        .catch(err => console.log('Error getting document:', err.message));
}

export function addDocument(user) {
    const docRef = doc(db, 'users', user.uid);
    setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'NA',
        regNo: user.regNo,
        score: 0,
        highScore: 0,
        timeStamp: serverTimestamp(),
    })
}

