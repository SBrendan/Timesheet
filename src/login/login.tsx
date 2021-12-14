import {
    Box, Button, Checkbox, Flex, FormControl,
    FormLabel, Heading, Input, Link, Stack, Text,
    useColorModeValue
} from '@chakra-ui/react';
  
  export default function Login() {
    return (
      <Flex
        w={'100%'}
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'3xl'} textAlign={'center'}>Connectez vous à votre compte</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              Pour saisir ou consultés vos heures
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Nom d'utilisateurs</FormLabel>
                <Input type="email" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Mot de passe</FormLabel>
                <Input type="password" />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Checkbox>Se souvenir de moi</Checkbox>
                  <Link color={'blue.400'}>Mot de passe oubliés?</Link>
                </Stack>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Connexion
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }