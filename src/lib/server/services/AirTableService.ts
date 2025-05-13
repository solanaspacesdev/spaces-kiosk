import Airtable from "airtable";
import { AIRTABLE_PAT } from "../constants";

class AirTableService {
  constructor(private _airtable = new Airtable({ apiKey: AIRTABLE_PAT ?? '' })) {}

  async getSponsors() {
    const base = this._airtable.base('appzAFYCLUpdr4InL');
    const records = await base('sponsors').select({}).all();
    return records;
  }
}

export const airTableService = new AirTableService();