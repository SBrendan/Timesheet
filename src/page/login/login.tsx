import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useToast
} from "@chakra-ui/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authProvider";
import authService from "../../services/auth.service";

interface Props {}

const Login: React.FC<Props> = (props: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const { isLoggedIn } = React.useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [loginError, setLoginError] = React.useState<String>("");
  const [checked, setChecked] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  React.useEffect(() => {
    if (localStorage.getItem("email")) {
      setChecked(true);
      setEmail(localStorage.getItem("email") || "");
    }
  }, []);
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  const onSubmit = (values: any) => {
    localStorage.setItem("email", values.email);
    authService
      .signIn(values.email, values.password)
      .then((user) => {
        toast({
          title: "Connexion réusi",
          status: "success",
          isClosable: true,
        });
        navigate("/saisie");
      })
      .catch((e) => {
        if (e.code === "auth/user-not-found") {
          setLoginError("Utilisateur inconu");
        } else if (e.code === "auth/wrong-password") {
          setLoginError("Email ou Mot de passe invalide");
        } else if (e.code === "auth/too-many-requests") {
          setLoginError(
            "Trop de tentative. Veuillez pattientez et reesayer dans un instant"
          );
        }
      });
  };

  return (
    <Flex
      w={"100%"}
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={"gray.50"}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"3xl"} textAlign={"center"}>
            Connectez vous à votre compte
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Pour saisir ou consultés vos heures
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={"white"}
          boxShadow={"lg"}
          p={8}
          onKeyPress={(e) => (e.key === "Enter" ? handleSubmit(onSubmit) : "")}
        >
          <form>
            <Stack spacing={4}>
              {loginError && (
                <Alert status="error">
                  <AlertIcon />
                  <Box flex={1}>
                    <AlertTitle>Érreur d'authentification</AlertTitle>
                    <AlertDescription display={"block"}>
                      {loginError}
                    </AlertDescription>
                    <CloseButton
                      position="absolute"
                      right="8px"
                      top="8px"
                      onClick={() => setLoginError("")}
                    />
                  </Box>
                </Alert>
              )}
              <FormControl isInvalid={errors.email}>
                <FormLabel htmlFor="email">Adresse Email</FormLabel>
                <Input
                  type="email"
                  id="email"
                  placeholder="exemple@exemple.fr"
                  defaultValue={email}
                  {...register("email", {
                    required: "Ce champs est requis",
                  })}
                />
              </FormControl>
              <FormControl isInvalid={errors.password}>
                <FormLabel htmlFor="password">Mot de passe</FormLabel>
                <Input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Ce champs est requis",
                  })}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox
                    onChange={() => setChecked(!checked)}
                    isChecked={checked}
                  >
                    Se souvenir de moi
                  </Checkbox>
                  <Link color={"blue.400"} href={"/reinitialiser"}>
                    Mot de passe oubliés?
                  </Link>
                </Stack>
                <Button
                  isLoading={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Connexion
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
