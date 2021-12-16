import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast
} from "@chakra-ui/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import authService from "../services/auth.service";

interface ResetPasswordModalProps {
  email?: string;
}
const ResetPassword: React.FC<ResetPasswordModalProps> = ({
  email,
}: ResetPasswordModalProps): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const user = React.useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [loginError, setLoginError] = React.useState<String>("");

  const onSubmit = (values: any) => {
    authService
      .resetPassword(values.email)
      .then(() => {
        toast({
          title: "Demande de réinitialisation fait avec succès",
          description:
            "Si votre email est connue, vous receverez un email pour réinitialiser votre mot de passe",
          status: "success",
          isClosable: true,
        });
        navigate("/saisie");
      })
      .catch((e) => {
        console.log(e);
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
  if (user) {
    return <Navigate to="/" />;
  }
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
            Réinitialiser votre mot de passe
          </Heading>
        </Stack>
        <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              {loginError && (
                <Alert status="error">
                  <AlertIcon />
                  <Box flex={1}>
                    <AlertTitle>Érreur d'authentification</AlertTitle>
                    <AlertDescription display={"block"}>
                      {loginError}
                    </AlertDescription>
                    <CloseButton position="absolute" right="8px" top="8px" />
                  </Box>
                </Alert>
              )}
              <FormControl htmlFor="email" isInvalid={errors.name}>
                <FormLabel>Adresse Email</FormLabel>
                <Input
                  type="email"
                  id="email"
                  defaultValue={email}
                  placeholder="exemple@exemple.fr"
                  {...register("email", {
                    required: "Ce champs est requis",
                  })}
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Réinitialiser
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default ResetPassword;
