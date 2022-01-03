import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { app } from "../config";

const auth = getAuth(app);

class AuthService {
  signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  signOut() {
    auth
      .signOut()
      .then(() => {
        console.log("logged out");
      })
      .catch((e) => {
        console.error(e);
      });
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  updateProfile(name: string) {
    if (auth.currentUser) {
      return updateProfile(auth.currentUser, {
        displayName: name,
      });
    }
  }
}

export default new AuthService();
