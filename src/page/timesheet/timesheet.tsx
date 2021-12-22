import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useToast
} from "@chakra-ui/react";
import {
  addHours,
  addWeeks,
  differenceInHours,
  eachDayOfInterval,
  endOfWeek,
  getISOWeek,
  getMonth,
  startOfWeek,
  subWeeks
} from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";
import { FaArrowLeft, FaArrowRight, FaCoffee, FaSave } from "react-icons/fa";
import { FcClock, FcOvertime, FcPlanner } from "react-icons/fc";
import StatsCard from "../../component/statsCard";
import { AuthContext } from "../../context/authProvider";
import timesheetService from "../../services/database.service";
import {
  defaultState,
  ITimeSheetData,
  IWeekDetails
} from "../../type/timesheet.contants";
import { capitalize, snakeCase } from "../../utils/string";

interface Props {}

const Timesheet: React.FC<Props> = (props: Props) => {
  const { userInfo } = React.useContext(AuthContext);
  const [workingHours, setWorkingHours] =
    React.useState<IWeekDetails>(defaultState);
  const [now] = React.useState<Date>(new Date());
  const [date, setDate] = React.useState<Date>(new Date());
  const [week, setWeek] = React.useState<number>(getISOWeek(date));
  const [startDay, setStartDay] = React.useState<Date>(
    startOfWeek(date, { weekStartsOn: 1 })
  );
  const [currentYear] = React.useState<string>(
    new Date().toLocaleString("default", { year: "numeric" })
  );
  const [endDay, setEndDay] = React.useState<Date>(
    endOfWeek(date, { weekStartsOn: 1 })
  );
  const [minWeeks] = React.useState<number>(35);
  const [totalWorkingHours, setTotalWorkingHours] = React.useState<number>(0);
  const [totalAdditionalHours, setTotalAdditionalHours] =
    React.useState<number>(0);
  const [isFetchingData, setIsFetchingDate] = React.useState<boolean>(false);
  const toast = useToast();

  React.useEffect(() => {
    setIsFetchingDate(!setIsFetchingDate);
    timesheetService
      .getByKey(
        snakeCase(userInfo?.displayName || ""),
        startDay.toLocaleDateString("default", { year: "numeric" }),
        startDay.toLocaleDateString("en-Us", { month: "long" }),
        startDay.getTime() +""
      )
      .then((snapshot) => {
        setIsFetchingDate(!setIsFetchingDate);
        setWorkingHours(snapshot.val().timesheetDetails);
      })
      .catch((e) => {
        setIsFetchingDate(!setIsFetchingDate);
        setWorkingHours(defaultState);
        console.error(e);
      });
  }, [week, startDay, userInfo]);

  React.useEffect(() => {
    const sumHoursOfWeek = (): number => {
      let total = 0;
      Object.keys(workingHours).forEach((k) => {
        let totalDay = 0;
        Object.entries(workingHours[parseInt(k)]).forEach(([key, value]) => {
          let morningSum = 0;
          let afternoonSum = 0;
          if (key === "morning") {
            const d1 = new Date(currentYear + ", 11, 14");
            const d2 = new Date(currentYear + ", 11, 14");
            d1.setHours(parseInt(value.from));
            d2.setHours(parseInt(value.to));
            morningSum = differenceInHours(d2, d1);
          } else {
            const d1 = new Date(currentYear + ", 11, 14");
            const d2 = new Date(currentYear + ", 11, 14");
            d1.setHours(parseInt(value.from));
            d2.setHours(parseInt(value.to));
            afternoonSum = differenceInHours(d2, d1);
          }
          totalDay += morningSum + afternoonSum;
        });
        total += totalDay;
      });
      return total;
    };
    setTotalWorkingHours(sumHoursOfWeek());
  }, [workingHours, currentYear]);

  React.useEffect(() => {
    const sumAdditionalHour = () => {
      const d1 = addHours(
        new Date(currentYear + ", 11, 14"),
        totalWorkingHours
      );
      const d2 = addHours(new Date(currentYear + ", 11, 14"), minWeeks);
      return differenceInHours(d1, d2);
    };
    setTotalAdditionalHours(sumAdditionalHour());
  }, [totalWorkingHours, minWeeks, currentYear]);

  const changeWeek = (newDate: Date) => {
    setDate(newDate);
    setWeek(getISOWeek(newDate));
    setStartDay(startOfWeek(newDate, { weekStartsOn: 1 }));
    setEndDay(endOfWeek(newDate, { weekStartsOn: 1 }));
  };

  const nextWeek = () => {
    const nextW = addWeeks(date, 1);
    changeWeek(nextW);
  };

  const prevWeek = () => {
    const prevW = subWeeks(date, 1);
    changeWeek(prevW);
  };

  const curWeek = () => {
    setDate(now);
    changeWeek(now);
  };

  const changeMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.selectedOptions[0].value;
    changeWeek(new Date(date.getFullYear(), parseInt(selectedMonth), 1));
  };

  const format = (val: string) => ("0" + val).slice(-2) + `h`;
  const parse = (val: string) => val.replace(/^h/, "");

  const saveTimeSheet = () => {
    const data: ITimeSheetData = {
      key: startDay.getTime(),
      username: snakeCase(userInfo?.displayName || ""),
      month: startDay.toLocaleDateString("en-US", { month: "long" }),
      weekNumber: week,
      totalAdditionalHours: totalAdditionalHours,
      year: startDay.toLocaleDateString("default", { year: "numeric" }),
      timesheetDetails: workingHours,
    };

    timesheetService
      .createUpdate(data)
      .then(() => {
        toast({
          title: "Enregistrement réussie",
          description: `Semaine n°${week} sauvegarder`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((e: Error) => {
        toast({
          title: `Erreur lors de l'enregistrement`,
          description: `Une erreur inatendu, veuillez reesayer ou contacter l'administrateur`,
          status: "error",
          isClosable: true,
        });
        console.error(e);
      });
  };

  const generateWeeklyStats = (): React.ReactElement => {
    return (
      <Stack
        m={"10"}
        bgColor={"white"}
        p={"5"}
        rounded={"xl"}
        border={"1px solid #e4e4e4"}
        boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
      >
        <Box>
          <Text textAlign={"center"} fontWeight={700} fontSize={"2xl"}>
            Récapitulatif Semaine
          </Text>
          <Text textAlign={"center"} fontWeight={600} fontSize={"lg"}>
            Du {("0" + startDay.getDate()).slice(-2)} au{" "}
            {("0" + endDay.getDate()).slice(-2)}
          </Text>
        </Box>

        <Box>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 5, lg: 10 }}
          >
            <StatsCard
              title={"Théorique"}
              stat={minWeeks + "h"}
              icon={<FcClock size={"3em"} />}
            />
            <StatsCard
              title={"Réalisé"}
              stat={totalWorkingHours + "h"}
              icon={<FcPlanner size={"3em"} />}
            />
            <StatsCard
              title={"Suplémentaire"}
              stat={totalAdditionalHours + "h"}
              icon={<FcOvertime size={"3em"} />}
            />
          </SimpleGrid>
        </Box>
      </Stack>
    );
  };

  const generateWeeklyAction = (): React.ReactElement => {
    return (
      <Box
        bgColor={"white"}
        padding={5}
        boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          <Box>
            <Text fontWeight={600} fontSize={"xl"}>
              Déclarant
            </Text>
            <Text>{userInfo?.displayName || ""}</Text>
          </Box>
          <Box
            display={{ base: "block", md: "flex" }}
            justifyContent={{ base: "unset", md: "right" }}
          >
            <Stack>
              <ButtonGroup variant="outline">
                <Button
                  leftIcon={<FaArrowLeft />}
                  onClick={() => prevWeek()}
                >
                  Semaine passer
                </Button>
                <Button onClick={() => curWeek()}>
                  Semaine courante
                </Button>
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={() => nextWeek()}
                >
                  Semaine suivante
                </Button>
              </ButtonGroup>
              <Stack>
                <Select
                  size={"xs"}
                  variant="flushed"
                  marginRight={5}
                  defaultValue={getMonth(date)}
                  maxW={"200px"}
                  onChange={(val) => changeMonth(val)}
                >
                  {generateMonths().map((month, i) => {
                    return (
                      <option value={i} key={i}>
                        {capitalize(month)}
                      </option>
                    );
                  })}
                </Select>
              </Stack>
            </Stack>
          </Box>
        </SimpleGrid>
      </Box>
    );
  };

  const generateMonths = () => {
    const months: string[] = [];
    for (let i = 0; i < 12; i++) {
      months.push(fr.localize?.month(i));
    }
    return months;
  };

  const generateDays = (): React.ReactElement => {
    const days = eachDayOfInterval({
      start: startDay,
      end: endDay,
    });
    const result = days.map((day, i) => {
      const dayName = capitalize(
        day.toLocaleDateString("fr-FR", { weekday: "long" })
      );
      const dayNumber = ("0" + day.getDate()).slice(-2);
      const monthNumber = ("0" + day.getMonth()).slice(-2);
      const result: any = [];
      if (i < 5) {
        day.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        result.push(
          <Box
            w={"100%"}
            key={day.getTime()}
            p={4}
            rounded={"lg"}
            boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
            backgroundColor={day.getTime() === now.getTime() ? "#f6f6f6" : ""}
          >
            <Text
              fontWeight={600}
              fontSize={{ base: "xl", md: "lg" }}
              textAlign={"center"}
            >
              {`${dayName} ${dayNumber}/${parseInt(monthNumber) + 1}`}
            </Text>

            <Box>
              <Grid column={2} templateColumns="repeat(2, 1fr)" gap={3}>
                <NumberInput
                  onChange={(valueString) => {
                    setWorkingHours({
                      ...workingHours,
                      [i]: {
                        ...workingHours[i],
                        morning: {
                          ...workingHours[i].morning,
                          from: parse(valueString),
                        },
                      },
                    });
                  }}
                  value={format(workingHours[i].morning?.from || "")}
                  min={0}
                  max={23}
                  size="lg"
                  allowMouseWheel
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <NumberInput
                  onChange={(valueString) => {
                    setWorkingHours({
                      ...workingHours,
                      [i]: {
                        ...workingHours[i],
                        morning: {
                          ...workingHours[i].morning,
                          to: parse(valueString),
                        },
                      },
                    });
                  }}
                  value={format(workingHours[i].morning?.to || "")}
                  min={0}
                  max={23}
                  size="lg"
                  allowMouseWheel
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Grid>
              <Stack align={"center"} p={3}>
                <Icon w={9} h={9} as={FaCoffee} />
                <Text fontSize={"lg"} textAlign={"center"} fontWeight={600}>
                  Pause Déjeuner
                </Text>
              </Stack>

              <Grid column={2} templateColumns="repeat(2, 1fr)" gap={3}>
                <NumberInput
                  onChange={(valueString) => {
                    setWorkingHours({
                      ...workingHours,
                      [i]: {
                        ...workingHours[i],
                        afternoon: {
                          ...workingHours[i].afternoon,
                          from: parse(valueString),
                        },
                      },
                    });
                  }}
                  value={format(workingHours[i].afternoon?.from || "")}
                  min={0}
                  max={23}
                  size="lg"
                  allowMouseWheel
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <NumberInput
                  onChange={(valueString) => {
                    setWorkingHours({
                      ...workingHours,
                      [i]: {
                        ...workingHours[i],
                        afternoon: {
                          ...workingHours[i].afternoon,
                          to: parse(valueString),
                        },
                      },
                    });
                  }}
                  value={format(workingHours[i].afternoon?.to || "")}
                  min={0}
                  max={23}
                  size="lg"
                  allowMouseWheel
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Grid>
            </Box>
          </Box>
        );
      }
      return result;
    });
    return (
      <Stack
        m={"10"}
        bgColor={"white"}
        p={"5"}
        rounded={"xl"}
        border={"1px solid #e4e4e4"}
        boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}
      >
        <Box>
          <Text textAlign={"center"} fontSize={"2xl"} fontWeight={700}>
            Déclaration Semaine n°{week}
          </Text>
          <Text textAlign={"center"} fontWeight={600} fontSize={"lg"}>
            Du {("0" + startDay.getDate()).slice(-2)} au{" "}
            {("0" + endDay.getDate()).slice(-2)}
          </Text>
        </Box>

        <Box>
          <Grid
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(5, 1fr)" }}
            gap={{ base: 0, md: 9 }}
          >
            {result}
          </Grid>
        </Box>
        <Button
          onClick={() => saveTimeSheet()}
          colorScheme={"teal"}
          rightIcon={<FaSave />}
        >
          Enregistrer
        </Button>
      </Stack>
    );
  };

  const loadingComponent = () => {
    return (
      <Box>
        <Spinner size={"xl"} />
      </Box>
    );
  };

  const timeSheetComp = () => {
    return (
      <Box>
        {generateWeeklyAction()}
        {generateWeeklyStats()}
        {generateDays()}
      </Box>
    );
  };

  return isFetchingData ? loadingComponent() : timeSheetComp();
};

export default Timesheet;
