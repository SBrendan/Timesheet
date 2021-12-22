import {
    Box,
    Button,
    Flex,
    Input,
    Stack,
    Text,
    useToast
} from "@chakra-ui/react";
import * as React from "react";
import authService from "../../services/auth.service";

const Profil = () => {
  const [name, setName] = React.useState<string>("");
  const toast = useToast();
  const updateName = () => {
    authService.updateProfile(name)?.then((e) => {
      toast({
        title: "Changement de nom",
        status: "success",
      });
    });
  };

  return (
    <Flex>
      <Box w={"100%"} justifyContent={"center"}>
        <Stack
          m={"10"}
          bgColor={"white"}
          p={"5"}
          rounded={"xl"}
          border={"1px solid #e4e4e4"}
          boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
          textAlign={"center"}
        >
          <Text fontSize={"32px"} fontWeight={"600"}>
            Modification du nom d'affichage
          </Text>
          <Input
            type={"text"}
            onChange={(val) => setName(val.target.value)}
            defaultValue={name}
          />
          <Button onClick={() => updateName()}>Valider</Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Profil;
