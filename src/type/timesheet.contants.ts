export interface IWeekDetails {
  [index: number]: {
    morning: HoursDetail;
    afternoon: HoursDetail;
  };
}

export interface HoursDetail {
  from: string;
  to: string;
}

export interface ITimeSheetData {
  key?: number | null;
  username: string;
  weekNumber: number;
  month: string;
  year: string;
  totalAdditionalHours: string;
  timesheetDetails: IWeekDetails;
}

export const defaultHoursWeek: number = 39;

export const defaultState: IWeekDetails = {
  0: {
    morning: {
      from: "08:00",
      to: "12:00",
    },
    afternoon: {
      from: "13:00",
      to: "17:00",
    },
  },
  1: {
    morning: {
      from: "08:00",
      to: "12:00",
    },
    afternoon: {
      from: "13:00",
      to: "17:00",
    },
  },
  2: {
    morning: {
      from: "08:00",
      to: "12:00",
    },
    afternoon: {
      from: "13:00",
      to: "17:00",
    },
  },
  3: {
    morning: {
      from: "08:00",
      to: "12:00",
    },
    afternoon: {
      from: "13:00",
      to: "17:00",
    },
  },
  4: {
    morning: {
      from: "08:00",
      to: "12:00",
    },
    afternoon: {
      from: "13:00",
      to: "16:00",
    },
  },
};
