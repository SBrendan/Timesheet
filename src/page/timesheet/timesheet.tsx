import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Icon,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useToast
} from "@chakra-ui/react";
import {
  addWeeks,
  differenceInMilliseconds,
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
import TimePicker from "react-time-picker";
import StatsCard from "../../component/statsCard";
import { AuthContext } from "../../context/authProvider";
import timesheetService from "../../services/database.service";
import {
  defaultHoursWeek,
  defaultState,
  ITimeSheetData,
  IWeekDetails
} from "../../type/timesheet.contants";
import { capitalize, snakeCase } from "../../utils/string";
import "./timesheet.css";
interface Props {}

const Timesheet: React.FC<Props> = (props: Props) => {
  const btnSize = useBreakpointValue({ base: "xs", md: "sm", "2xl": "md" });
  const btnContentNext = useBreakpointValue({
    md: "Semaine suivante",
    base: "Sem. suivante",
  });
  const btnContentPrevious = useBreakpointValue({
    md: "Semaine passée",
    base: "Sem. passée",
  });

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
  const [minWeeks] = React.useState<number>(defaultHoursWeek);
  const [totalWorkingHours, setTotalWorkingHours] = React.useState<string>("");
  const [totalAdditionalHours, setTotalAdditionalHours] =
    React.useState<string>("");
  const [isFetchingData, setIsFetchingDate] = React.useState<boolean>(false);
  const toast = useToast();

  React.useEffect(() => {
    setIsFetchingDate(!setIsFetchingDate);
    timesheetService
      .getByKey(
        snakeCase(userInfo?.displayName || ""),
        startDay.toLocaleDateString("default", { year: "numeric" }),
        startDay.toLocaleDateString("en-Us", { month: "long" }),
        startDay.getTime() + ""
      )
      .then((snapshot) => {
        setIsFetchingDate(!setIsFetchingDate);
        if (snapshot.exists()) {
          setWorkingHours(snapshot.val().timesheetDetails);
        } else {
          setWorkingHours(defaultState);
        }
      })
      .catch(() => {
        console.log("cce")
        setIsFetchingDate(!setIsFetchingDate);
        setWorkingHours(defaultState);
      });
      console.log("fetch")
  }, [week, startDay, userInfo]);

  React.useEffect(() => {
    const sumHoursOfWeek = (): string => {
      let total = 0;
      Object.keys(workingHours).forEach((k) => {
        let totalDay = 0;
        Object.entries(workingHours[parseInt(k)]).forEach(([key, value]) => {
          let morningSum = 0;
          let afternoonSum = 0;
          const d1 = new Date(currentYear + "-11-14");
          const d2 = new Date(currentYear + "-11-14");
          d1.setHours(parseInt(value.from.split(":")[0]));
          d2.setHours(parseInt(value.to.split(":")[0]));
          d1.setMinutes(parseInt(value.from.split(":")[1]));
          d2.setMinutes(parseInt(value.to.split(":")[1]));
          if (key === "morning") {
            morningSum = differenceInMilliseconds(d2, d1);
          } else {
            afternoonSum = differenceInMilliseconds(d2, d1);
          }
          totalDay += morningSum + afternoonSum;
        });
        total += totalDay;
      });
      const hour = Math.floor(total / 1000 / 60 / 60);
      const minutes = Math.floor((total / 1000 / 60 / 60 - hour) * 60);
      return hour + ":" + ("0" + minutes).slice(-2);
    };
    setTotalWorkingHours(sumHoursOfWeek());
  }, [workingHours, currentYear]);

  React.useEffect(() => {
    const sumAdditionalHour = () => {
      const d1 = new Date(currentYear + "-11-14");
      d1.setHours(parseInt(totalWorkingHours.split(":")[0]));
      d1.setMinutes(parseInt(totalWorkingHours.split(":")[1]));
      const d2 = new Date(currentYear + "-11-14");
      d2.setHours(minWeeks);
      d2.setMinutes(0);
      return differenceInMilliseconds(d1, d2);
    };
    const hour = Math.floor(sumAdditionalHour() / 1000 / 60 / 60);
    const minutes = Math.floor(
      (sumAdditionalHour() / 1000 / 60 / 60 - hour) * 60
    );
    setTotalAdditionalHours(hour + ":" + ("0" + minutes).slice(-2));
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

  const saveTimeSheet = () => {
    const data: ITimeSheetData = {
      key: startDay.getTime(),
      username: snakeCase(userInfo?.displayName || ""),
      displayName: userInfo?.displayName || "",
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
          title: "Enregistrement réussi",
          description: `Semaine n°${week} sauvegardée`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((e: Error) => {
        toast({
          title: `Erreur lors de l'enregistrement`,
          description: `Une erreur inatendue, veuillez réesayer ou contacter l'administrateur`,
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
              title={"Heures Réalisées"}
              stat={
                totalWorkingHours.split(":")[0] +
                "h" +
                totalWorkingHours.split(":")[1]
              }
              icon={<FcPlanner size={"3em"} />}
            />
            <StatsCard
              title={"Heures Suplémentaires"}
              stat={
                totalAdditionalHours.split(":")[0] +
                "h" +
                totalAdditionalHours.split(":")[1]
              }
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
                  size={btnSize}
                  leftIcon={<FaArrowLeft />}
                  onClick={() => prevWeek()}
                >
                  {btnContentPrevious}
                </Button>
                <Button size={btnSize} onClick={() => curWeek()}>
                  Semaine courante
                </Button>
                <Button
                  size={btnSize}
                  rightIcon={<FaArrowRight />}
                  onClick={() => nextWeek()}
                >
                  {btnContentNext}
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
      const monthNumber = ("0" + day.getMonth() + 1).slice(-2);
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
              {`${dayName} ${dayNumber}/${monthNumber}`}
            </Text>

            <Box>
              <Grid column={2} templateColumns="repeat(2, 1fr)" gap={3}>
                <TimePicker
                  className={"clock"}
                  locale="fr-FR"
                  minTime={"05:00:00"}
                  value={workingHours[i].morning?.from || ""}
                  disableClock={true}
                  format={"HH:mm"}
                  onChange={(valueString) => {
                    setWorkingHours({
                      ...workingHours,
                      [i]: {
                        ...workingHours[i],
                        morning: {
                          ...workingHours[i].morning,
                          from: valueString ? valueString.toString() : "00:00",
                        },
                      },
                    });
                  }}
                />
                <TimePicker
                  className={"clock"}
                  locale="fr-FR"
                  minTime={"05:00:00"}
                  value={workingHours[i].morning?.to || ""}
                  disableClock={true}
                  format={"HH:mm"}
                  onChange={(valueString) => {
                    setWorkingHours({
                      ...workingHours,
                      [i]: {
                        ...workingHours[i],
                        morning: {
                          ...workingHours[i].morning,
                          to: valueString ? valueString.toString() : "00:00",
                        },
                      },
                    });
                  }}
                />
              </Grid>
              <Stack align={"center"} p={3}>
                <Icon w={9} h={9} as={FaCoffee} />
                <Text fontSize={"lg"} textAlign={"center"} fontWeight={600}>
                  Pause Déjeuner
                </Text>
              </Stack>

              <Grid column={2} templateColumns="repeat(2, 1fr)" gap={3}>
                <TimePicker
                  className={"clock"}
                  locale="fr-FR"
                  minTime={"05:00:00"}
                  value={workingHours[i].afternoon?.from || ""}
                  disableClock={true}
                  format={"HH:mm"}
                  onChange={(valueString) => {
                    setWorkingHours({
                      ...workingHours,
                      [i]: {
                        ...workingHours[i],
                        afternoon: {
                          ...workingHours[i].afternoon,
                          from: valueString ? valueString.toString() : "00:00",
                        },
                      },
                    });
                  }}
                />
                <TimePicker
                  className={"clock"}
                  locale="fr-FR"
                  minTime={"05:00:00"}
                  value={workingHours[i].afternoon?.to || ""}
                  disableClock={true}
                  format={"HH:mm"}
                  onChange={(valueString) => {
                    setWorkingHours({
                      ...workingHours,
                      [i]: {
                        ...workingHours[i],
                        afternoon: {
                          ...workingHours[i].afternoon,
                          to: valueString ? valueString.toString() : "00:00",
                        },
                      },
                    });
                  }}
                />
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
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
              "2xl": "repeat(5, 1fr)",
            }}
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
