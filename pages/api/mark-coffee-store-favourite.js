import { table, findRecordById, getMinifiedRecords } from '../../lib/airtable';

const controller = async function (req, res) {
   if (req.method !== 'PUT') return;

   try {
      const { id } = req.body;
      if (!id) throw new Error('A coffee store was not specified');

      const records = await findRecordById(id);
      const recordExists = Boolean(records.length);
      if (!recordExists)
         return res.status(400).json({ errMsg: "This store doesn't exists" });

      const [record] = records;
      const upVote = () => +record.votes + 1;

      const updatedRecord = await table.update([
         { id: record.recordId, fields: { votes: upVote() } },
      ]);

      if (!updatedRecord) throw new Error('');

      res.status(200).json({
         updatedRecord: getMinifiedRecords(updatedRecord)[0],
      });
   } catch (err) {
      res.status(500).json({
         errMsg: err.message || 'Error updating this store',
      });
   }
};

export default controller;
