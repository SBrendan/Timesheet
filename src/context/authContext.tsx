import * as firebase from "firebase";
import * as React from "react";
export const AuthContext = React.createContext<firebase.default.User | null>(null);