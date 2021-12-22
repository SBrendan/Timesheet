import {
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Link,
  Text,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import * as React from "react";
import { IconType } from "react-icons";
import { FiClock, FiHome, FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { GiButterfly } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/authProvider";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Accueil", path: "/", icon: FiHome },
  { name: "Déclarer", path: "/saisie", icon: FiClock },
  { name: "Administration", path: "/admin", icon: FiUser },
  { name: "Déconnexion", path: "/deconnexion", icon: FiLogOut },
];

export default function SimpleSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn } = React.useContext(AuthContext);
  return (
    <Box minH="100vh" bg={"#f6fafc"}>
      <SidebarContent
        onClose={() => onClose}
        display={isLoggedIn ? { base: "none", md: "block" } : "none"}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={isLoggedIn ? { base: 0, md: 60 } : { md: 0 }}>{children}</Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { isAdmin } = React.useContext(AuthContext);

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" justifyContent="center">
        <Text fontSize="md" fontWeight="bold" as={NavLink} to={"/"}>
          <Icon as={GiButterfly} color={"#3FC7BF"} w={10} h={10} />
          Epivert Services
        </Text>
        <CloseButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
          marginLeft={"auto"}
        />
      </Flex>
      {LinkItems.map((link) => {
        if (link.name === "Administration") {
          if (isAdmin) {
            return (
              <NavItem key={link.name} icon={link.icon} path={link.path}>
                {link.name}
              </NavItem>
            );
          }
        } else {
          return (
            <NavItem key={link.name} icon={link.icon} path={link.path}>
              {link.name}
            </NavItem>
          );
        }
        return null;
      })}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactText;
  path: string;
}
const NavItem = ({ icon, children, path, ...rest }: NavItemProps) => {
  return (
    <Link href="/" style={{ textDecoration: "none" }} as={NavLink} to={path}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "#3FC7BF",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        <Text fontSize={"xl"}>{children}</Text>
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        fontSize="2xl"
        ml="8"
        fontFamily="monospace"
        fontWeight="bold"
        as={NavLink}
        to={"/"}
      >
        Epivert Services
      </Text>
    </Flex>
  );
};
