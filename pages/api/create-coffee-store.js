import { table, getMinifiedRecords } from '../../lib/airtable';

export default async function createCoffeeStore(req, res) {
   if (req.method === 'POST') {
      const { id, name, address, neighbourhood, votes, imgUrl } = req.body;

      if (!name || !id)
         return res.status(404).json({ error: 'Name and ID are required' });

      try {
         const storeRecords = await table
            .select({ filterByFormula: `id="${id}"` })
            .firstPage();

         if (storeRecords.length)
            return res
               .status(200)
               .json({ records: getMinifiedRecords(storeRecords) });

         const newRecords = await table.create([{ fields: req.body }]);
         return res
            .status(200)
            .json({ records: getMinifiedRecords(newRecords) });
      } catch (err) {
         return res
            .status(500)
            .json({
               message: 'Error creating or finding a store: ' + err.message,
            });
      }
   }
}
