import {
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
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
            Bienvenue sur l'outil de suivi d'heures d'Epivert Services
          </Heading>
          <Text fontSize={"2xl"} fontWeight={600}>
            Horaire de travail
          </Text>
          <Flex justifyContent={"center"}>
            <Box overflowX="auto">
              <Table textAlign={"center"}>
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Lundi</Th>
                    <Th>Mardi</Th>
                    <Th>Mercredi</Th>
                    <Th>Jeudi</Th>
                    <Th>Vendredi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Matin</Td>
                    <Td>08h00 - 12h00</Td>
                    <Td>08h00 - 12h00</Td>
                    <Td>08h00 - 12h00</Td>
                    <Td>08h00 - 12h00</Td>
                    <Td>08h00 - 12h00</Td>
                  </Tr>
                  <Tr>
                    <Td>Après-midi</Td>
                    <Td>13h00 - 17h00</Td>
                    <Td>13h00 - 17h00</Td>
                    <Td>13h00 - 17h00</Td>
                    <Td>13h00 - 17h00</Td>
                    <Td>13h00 - 16h00</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Home;
