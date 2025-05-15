import Airtable from 'airtable';
import { AIRTABLE_PAT } from '../constants';

class AirTableService {
  constructor(
    private _base = 'appzAFYCLUpdr4InL',
    private _airtable = new Airtable({ apiKey: AIRTABLE_PAT ?? '' })
  ) {}

  async getSponsors() {
    const base = this._airtable.base(this._base);
    const records = await base('sponsors').select({}).all();
    return records;
  }

  async getSponsor(name: string) {
    const base = this._airtable.base(this._base);
    const records = await base('sponsors')
      .select({
        filterByFormula: `{Name} = '${name}'`,
      })
      .all();
    return records;
  }

  async getCompanyInfo() {
    const base = this._airtable.base(this._base);
    const records = await base('company').select({}).all();
    return records;
  }
}

export const airTableService = new AirTableService();
