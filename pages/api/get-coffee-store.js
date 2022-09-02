import { table, getMinifiedRecords, findRecordById } from '../../lib/airtable';

const controller = async function (req, res) {
   const { id } = req.query;
   try {
      const storeRecords = await findRecordById(id);

      if (!storeRecords.length)
         return res
            .status(404)
            .json({ error: 'This coffee store does not exist' });

      return res.status(200).json({ records: storeRecords });
   } catch (err) {
      return res
         .status(404)
         .json({ error: 'Could not get this coffee store ' });
   }
};

export default controller;
