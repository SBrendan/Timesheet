import { child, get, getDatabase, ref, set } from "firebase/database";
import { app } from "../config";
import { ITimeSheetData } from "../type/timesheet.contants";
const db = ref(getDatabase(app));

class TimesheetDataService {
  createUpdate(timesheet: ITimeSheetData) {
    return set(child(db, "timesheets/" + timesheet.year + "/" + timesheet.username + "/" + timesheet.month + "/" + timesheet.key +"" || ""), timesheet);
  }

  getByKey(username: string, year: string, month: string, key: string) {
    return get(child(db, "timesheets/" + year + "/" + username + "/" + month +"/" + key));
  }

  getYear() {
    return get(child(db, "timesheets/"));
  }

  getStats(year: string) {
    return get(child(db,"timesheets/" + year));
  }

  getUser(key: string) {
    return get(child(db, "users/" + key));
  }
}

export default new TimesheetDataService();
