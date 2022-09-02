import { getCoffeeStores } from '../../lib/coffeeStore';

async function getCoffeeStoresByLocation(req, res) {
   try {
      const { latLong, limit } = req.query;
      const stores = await getCoffeeStores(latLong, limit);
      res.status(200).json({ stores });
   } catch (err) {
      console.log('Error getting stores by location: ', err.message);
      res.status(400).json({ error: err.message });
   }
}

export default getCoffeeStoresByLocation;
