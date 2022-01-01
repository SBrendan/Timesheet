import { Flex, Stack } from "@chakra-ui/react";
import * as React from "react";
import { PuffLoader } from "react-spinners";
import { fireAuth } from "../config";
import databaseService from "../services/database.service";
interface IAuthContext {
  userInfo: firebase.default.User | null;
  isLoggedIn: boolean;
  isAdmin: boolean; 
  loading: boolean;
}

export const AuthContext = React.createContext<IAuthContext>({
  userInfo: null,
  isLoggedIn: false,
  isAdmin: false,
  loading: true,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<IAuthContext>({
    userInfo: null,
    isLoggedIn: false,
    isAdmin: false,
    loading: true,
  });

  React.useEffect(() => {
    const unsubscribe = fireAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        firebaseUser.getIdTokenResult().then((user) => {
          if (user.claims.user_id) {
            databaseService
              .getUser(user.claims.user_id)
              .then((admin) => {
                const isAdmin = admin.val()
                  ? admin.val().admin
                    ? admin.val().admin
                    : false
                  : false;
                setUser({
                  userInfo: firebaseUser,
                  isLoggedIn: true,
                  loading: false,
                  isAdmin: isAdmin,
                });
              })
              .catch((e) => console.error(e));
          }
        });
      } else {
        setUser({
          userInfo: null,
          isLoggedIn: false,
          isAdmin: false,
          loading: false,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  if (user.loading) {
    return (
      <Flex align="center" justify="center" minH={"90vh"}>
        <Stack mx={"auto"} maxW={"lg"} py={12} px={6}>
          <PuffLoader color={"#3FC7BF"} loading size={300} />
        </Stack>
      </Flex>
    );
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
