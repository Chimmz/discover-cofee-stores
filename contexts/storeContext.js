import { createContext, useContext, useReducer } from 'react';

export const ACTION_TYPES = {
   SET_LAT_LONG: 'SET_LAT_LONG',
   SET_COFFEE_STORES: 'SET_COFFEE_STORES',
};

const storeReducer = function (state, action) {
   switch (action.type) {
      case ACTION_TYPES.SET_LAT_LONG:
         return { ...state, latLong: action.payload.latLong };

      case ACTION_TYPES.SET_COFFEE_STORES:
         return { ...state, coffeeStores: action.payload.coffeeStores };

      default:
         throw Error('Invalid action type: ' + action.type);
   }
};

export const StoreContext = createContext();

export const StoreProvider = (props) => {
   const initState = { latLong: '', coffeeStores: [] };
   const [state, dispatch] = useReducer(storeReducer, initState);

   return (
      <StoreContext.Provider value={{ state, dispatch }}>
         {props.children}
      </StoreContext.Provider>
   );
};

export const useStoreContext = () => useContext(StoreContext);
