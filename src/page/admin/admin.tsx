import {
  Box,
  Button,
  Flex,
  FormLabel,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue
} from "@chakra-ui/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";
import { FaPrint } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../context/authProvider";
import databaseService from "../../services/database.service";
import { titleCase } from "../../utils/string";
import "./admin.css";
interface StatsDetails {
  username: string;
  months: number[];
}

const Admin = () => {
  const componentRef = React.useRef(null);
  const [years, setYears] = React.useState<string[]>([]);
  const [year, setYear] = React.useState<string>(
    new Date().toLocaleString("default", { year: "numeric" })
  );
  const [fullStats, setFullStats] = React.useState<StatsDetails[] | null>(null);
  const { loading, isAdmin } = React.useContext(AuthContext);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const variant = useBreakpointValue({ base: '', md: 'Imprimer le tableau' })
  React.useEffect(() => {
    databaseService.getYear().then((years) => {
      if (years.exists()) {
        setYears(Object.keys(years.val()));
      }
    });
  }, []);

  React.useEffect(() => {
    databaseService.getStats(year).then((stats) => {
      const statsByuByM: StatsDetails[] = [];
      if (stats.exists()) {
        let currUser = "";
        stats.forEach((users) => {
          let totalMonth: number[] = [];
          totalMonth = Array(12).fill(0);
          currUser = users.key || "";
          users.forEach((months) => {
            let total: number = 0;
            const currMonth = months.key;
            months.forEach((statsByU) => {
              total += parseInt(statsByU.val().totalAdditionalHours);
            });
            totalMonth[
              parseInt(format(new Date("1" + currMonth + "2021"), "L")) - 1
            ] = total;
          });
          statsByuByM.push({
            username: currUser,
            months: totalMonth,
          });
        });
      }
      setFullStats(statsByuByM);
    });
  }, [year]);
  if (!loading && !isAdmin) {
    return <Navigate to="/" />;
  }

  const generateTable = (type: string) => {
    const tableRow: any[] = [];
    if (fullStats) {
      tableRow.push(
        fullStats.map((val, i) => {
          if (type === "default") {
            return (
              <Tr key={i}>
                <Td>{titleCase(val.username)}</Td>
                {val.months.map((details) => {
                  return details ? <Td>{details} Heures</Td> : <Td>-</Td>;
                })}
                <Td>{val.months.reduce((a, b) => a + b)} Heures</Td>
              </Tr>
            );
          }
          return (
            <tr key={i}>
              <td>{titleCase(val.username)}</td>
              {val.months.map((details) => {
                return details ? <td>{details}h</td> : <td>-</td>;
              })}
              <td>{val.months.reduce((a, b) => a + b)}h</td>
            </tr>
          );
        })
      );
    }
    return tableRow;
  };

  const generateMonths = () => {
    const months: string[] = [];
    for (let i = 0; i < 12; i++) {
      months.push(fr.localize?.month(i));
    }
    return months;
  };
  const changeYear = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = event.target.selectedOptions[0].value;
    setYear(selectedYear);
  };

  const printableTable = () => {
    return (
      <div className="print-container" ref={componentRef}>
        <div className="header">
          <h1>Récapitulatif Employés</h1>
          <h3>Sur l'année: {year}</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Employé</th>
              {generateMonths().map((month) => {
                return <th key={month}>{month}</th>;
              })}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>{generateTable("")}</tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {printableTable()}
      <Flex justifyContent={"space-between"}>
        <Box w={"100%"}>
          <Stack
            m={"10"}
            bgColor={"white"}
            p={"5"}
            rounded={"xl"}
            border={"1px solid #e4e4e4"}
            boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
          >
            <Flex justifyContent={"right"}>
              <Button
                onClick={handlePrint}
                leftIcon={<FaPrint />}
                maxw={"14%"}
                colorScheme={"teal"}
              >
                {variant}
              </Button>
            </Flex>
            <Text textAlign={"center"} fontWeight={700} fontSize={"2xl"}>
              Récapitulatif Employés
            </Text>
            <FormLabel>Récapitulatif sur l'année :</FormLabel>
            <Select
              size={"sm"}
              onChange={(val) => changeYear(val)}
              value={year}
              maxW={"180px"}
            >
              {years.map((year, i) => {
                return (
                  <option value={year} key={i}>
                    {year}
                  </option>
                );
              })}
            </Select>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Employé</Th>
                    {generateMonths().map((month) => {
                      return <Th key={month}>{month}</Th>;
                    })}
                    <Th>Total Année</Th>
                  </Tr>
                </Thead>
                <Tbody>{generateTable("default")}</Tbody>
              </Table>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default Admin;