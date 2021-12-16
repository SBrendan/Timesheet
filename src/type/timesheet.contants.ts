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
  key?: string | null;
  username: string;
  weekNumber: number;
  startDay: string;
  timesheetDetails: IWeekDetails;
}

export const defaultState: IWeekDetails = {
  0: {
    morning: {
      from: "8",
      to: "12",
    },
    afternoon: {
      from: "14",
      to: "17",
    },
  },
  1: {
    morning: {
      from: "8",
      to: "12",
    },
    afternoon: {
      from: "14",
      to: "17",
    },
  },
  2: {
    morning: {
      from: "8",
      to: "12",
    },
    afternoon: {
      from: "14",
      to: "17",
    },
  },
  3: {
    morning: {
      from: "8",
      to: "12",
    },
    afternoon: {
      from: "14",
      to: "17",
    },
  },
  4: {
    morning: {
      from: "8",
      to: "12",
    },
    afternoon: {
      from: "14",
      to: "17",
    },
  },
};
