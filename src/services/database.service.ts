import { fireBaseDB } from "../config";
import { ITimeSheetData } from "../type/timesheet.contants";
const db = fireBaseDB.ref("/");

class TimesheetDataService {
  getAll() {
    return db;
  }

  createUpdate(timesheet: ITimeSheetData) {
    const timesheetsRef = db.child("timesheets/" + timesheet.username);
    return timesheetsRef.child(timesheet.key || "").set({
      ...timesheet,
    });
  }

  getByKey(username: string, key: string) {
    const timesheetsRef = db.child("timesheets/" + username);
    return timesheetsRef.child(key).once("value");
  }
}

export default new TimesheetDataService();
