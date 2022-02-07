import firebase from "firebase/compat/app"
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyAYrJpu7su6WcAxtMcyZKcyHggfWCZ81eo",
  authDomain: "nakshatra-1c394.firebaseapp.com",
  projectId: "nakshatra-1c394",
  storageBucket: "nakshatra-1c394.appspot.com",
  messagingSenderId: "391382006119",
  appId: "1:391382006119:web:f1da3f0081d8694edb57c2",
  measurementId: "G-78J7XXJQNL"
};
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth=firebase.auth();
  const analytics = getAnalytics(firebaseApp);


  export {auth,analytics};
  export default db;
  export const createUserDocument = async (user,user1) => {
    
    if (!user) return;
    if (!user1) return;
    const userRef = db.doc(`customers/${user.uid}`);
  
    const snapshot = await userRef.get();
  
    if (!snapshot.exists) {
     
      try {
        await userRef.set({
          user1,
          createdAt: new Date(),
        });
      } catch (error) {
        console.log('Error in creating user', error);
      }
    }
  };