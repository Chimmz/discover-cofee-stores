import { createApi } from 'unsplash-js';

const unsplash = createApi({
   accessKey: 'SkG64n0J2KTtgyI1a7J9otbHKv9Z0c9fZGZEbCvDgAQ',
});

const getCoffeeUrl = function (latlong, query, limit) {
   return `https://api.foursquare.com/v3/places/search?ll=${latlong}&limit=${limit}`;
};

const getCoffeeStoresPhotos = async () => {
   const photos = await unsplash.search.getPhotos({
      query: 'coffee shop',
      page: 1,
      perPage: 30,
   });
   const { results } = photos.response;
   return results.map((photo) => photo.urls['small']);
};

export async function getCoffeeStores(
   latLong = '6.563241672993262%2C3.37049479684078',
   limit = 6
) {
   const photos = await getCoffeeStoresPhotos();
   const options = {
      method: 'GET',
      headers: {
         Accept: 'application/json',
         Authorization: 'fsq3Pgo1wTBFtKmHA0J8uvvHIlDddqMKFX4hDLBkltPAkNA=',
      },
   };
   try {
      const response = await fetch(getCoffeeUrl(latLong, 'coffee', limit), options);
      const data = await response.json();
      console.log("Today's data: ", data);
      return data.results.map((result, i) => ({
         id: result.fsq_id,
         name: result.name,
         address: result.location.region,
         imgUrl: photos[i],
         votes: 0,
      }));
   } catch (err) {
      console.log(err);
   }
}
// https://api.foursquare.com/v3/places/search?ll=6.563241672993262%2C3.370494796840785&limit=6
