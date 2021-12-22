import { Box, Flex, Heading, Image, Stack } from "@chakra-ui/react";
import * as React from "react";
import logo from "../../images/logo.png";

const Home: React.FC<any> = () => {
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
          <Flex justifyContent={"center"}>
            <Image src={logo} boxSize="150px" />
          </Flex>
          <Heading as="h1">
            Bienvenue sur l'outils de suivie d'heure d'Epivert Services
          </Heading>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Home;
