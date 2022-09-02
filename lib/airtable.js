const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
   process.env.AIRTABLE_BASE_ID
);
export const table = base('Discover-coffee-stores');

export const getMinifiedRecords = (records) => {
   const minifyRecord = (record) => ({ recordId: record.id, ...record.fields });
   return records.map(minifyRecord);
};

export const findRecordById = async (id) => {
   const storeRecords = await table
      .select({ filterByFormula: `id="${id}"` })
      .firstPage();
   return getMinifiedRecords(storeRecords);
};
