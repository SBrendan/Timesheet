import { fireBaseDB } from "../config";
import { ITimeSheetData } from "../type/timesheet.contants";
const db = fireBaseDB.ref("/");

class TimesheetDataService {

  createUpdate(timesheet: ITimeSheetData) {
    const timesheetsRef = db.child("timesheets/" +timesheet.year );
    return timesheetsRef
      .child(timesheet.username) 
      .child(timesheet.month)
      .child(timesheet.key +"" || "")
      .set({
        ...timesheet,
      });
  }

  getByKey(username: string, year: string, month: string, key: string) {
    const timesheetsRef = db.child("timesheets/" + year);
    return timesheetsRef.child(username).child(month).child(key).once("value");
  }

  getUser(key: string) {
    const userRef = db.child("users/");
    return userRef.child(key).once("value");
  }

  getYear() {
    const timesheetsRef = db.child("timesheets/");
    return timesheetsRef.once("value");
  }

  getStats(year: string) {
    const timesheetsRef = db.child("timesheets/" + year);
    return timesheetsRef.once("value");
  }
}

export default new TimesheetDataService();
