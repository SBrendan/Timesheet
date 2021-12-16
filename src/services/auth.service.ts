import { fireAuth } from "../config";

const auth = fireAuth;

class AuthService {
  signIn = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
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
    return auth.sendPasswordResetEmail(email);
  }
}

export default new AuthService();
