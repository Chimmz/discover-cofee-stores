import { useState, useEffect } from 'react';
import { ACTION_TYPES, useStoreContext } from '../contexts/storeContext';

function useTrackLocation() {
   // const [latLong, setLatLong] = useState('');
   const [error, setError] = useState('');
   const [isFindingLocation, setIsFindingLocation] = useState(false);
   const { state, dispatch } = useStoreContext();

   useEffect(() => {
      if (error.length) console.log(error);
      if (state.latLong.length) console.log(state.latLong);
   }, [error.length, state.latLong.length]);

   const successHandler = (position) => {
      const { longitude, latitude } = position.coords;
      dispatch({
         type: ACTION_TYPES.SET_LAT_LONG,
         payload: { latLong: `${latitude},${longitude}` },
      });
      setError('');
      setIsFindingLocation(false);
   };

   const failureHandler = (err) => {
      setError('Unable to retrieve your location.');
      setIsFindingLocation(false);
   };

   const initTrackLocation = () => {
      setIsFindingLocation(true);

      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(successHandler, failureHandler);
      } else setError('Geolocation is not supported by your browser');
   };

   return { initTrackLocation, isFindingLocation, error };
}

export default useTrackLocation;
