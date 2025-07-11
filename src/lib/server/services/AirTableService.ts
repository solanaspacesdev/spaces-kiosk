import Airtable from 'airtable';
import { AIRTABLE_PAT } from '../constants';

class AirTableService {
  constructor(
    private _base = 'appzAFYCLUpdr4InL',
    private _airtable = new Airtable({ apiKey: AIRTABLE_PAT ?? '' })
  ) {}

  async getSponsors() {
    const base = this._airtable.base(this._base);
    const records = await base('sponsors')
      .select({
        sort: [{ field: 'Rank', direction: 'asc' }],
      })
      .all();
    return records;
  }

  async getSponsorById(id: string) {
    const base = this._airtable.base(this._base);
    const record = await base('sponsors').find(id);
    return record;
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
