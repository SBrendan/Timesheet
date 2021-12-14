import {
    Box,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue
} from "@chakra-ui/react";
import * as React from "react";

interface StatsCardProps {
  title: string;
  stat: string;
  icon: React.ReactNode;
}
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  stat,
  icon,
}: StatsCardProps) => {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      border={"1px solid #e4e4e4"}
      rounded={"lg"}
    >
      <Flex justifyContent={"space-between"}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={"medium"} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent={"center"}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
};

export default StatsCard;
