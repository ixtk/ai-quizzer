import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBdKtJRjiBxv77AnqRo-v9L6CzZ5swR6Bw",
  authDomain: "ai-quizzer-b98f6.firebaseapp.com",
  projectId: "ai-quizzer-b98f6",
  storageBucket: "ai-quizzer-b98f6.firebasestorage.app",
  messagingSenderId: "44914849926",
  appId: "1:44914849926:web:5568977bd3687b9146b907"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function setAuthPersistence() {
  try {
    await setPersistence(auth, browserLocalPersistence)
    console.log("Persistence set to local")
  } catch (error) {
    console.error("Error setting persistence:", error)
  }
}

setAuthPersistence()

export { app, auth }
