import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import useTrackLocation from '../hooks/useTrackLocation';

import coffeeStores from '../data/coffee-stores.js';
import { getCoffeeStores } from '../lib/coffeeStore';

import styles from '../styles/Home.module.css';
import Banner from '../components/Banner';
import Card from '../components/Card';
import { ACTION_TYPES, useStoreContext } from '../contexts/storeContext';

// export const getStaticProps = async function (staticProps) {
//    const data = await getCoffeeStores();
//    console.log('DATA: ', data);
//    return { props: { coffeeStores: data || null } };
// };

export const getStaticProps = async function (staticProps) {
   const coffeeStores = await getCoffeeStores();
   return { props: { coffeeStores } };
};

function Home(initialProps) {
   // console.log(props);
   const [storesError, setStoresError] = useState([]);
   const { initTrackLocation, isFindingLocation, error: locationError } = useTrackLocation();
   const { state, dispatch } = useStoreContext();
   const { latLong, coffeeStores } = state;

   const handleBannerBtnClick = function () {
      initTrackLocation();
   };

   const getStores = async () => {
      try {
         const url = `/api/coffee-stores-by-location?latLong=${latLong}&limit=${25}`;
         const res = await fetch(url);
         const { stores } = await res.json();

         dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores: stores },
         });
         console.log({ stores });
      } catch (err) {
         setStoresError(err.message);
      }
   };

   useEffect(() => {
      if (!latLong) return;
      getStores();
   }, [latLong]);

   return (
      <div className={styles.container}>
         <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Banner
            btnText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
            handleOnClick={handleBannerBtnClick}
         />
         {locationError && <p>{locationError}</p>}
         {storesError && <p>{storesError}</p>}

         <main className={styles.main}>
            <h1 className={styles.title}>Welcome to Coffee App</h1>
            <div className={styles.heroImage}>
               <Image src="/static/hero-image.png" width={700} height={400} />
            </div>

            {coffeeStores?.length && (
               <div className={styles.sectionWrapper}>
                  <div className={styles.heading2}>Stores near me</div>
                  <div className={styles.cardLayout}>
                     {coffeeStores.map((store) => (
                        <Card
                           key={store.id}
                           name={store.name}
                           imgUrl={
                              store.imgUrl ||
                              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                           }
                           address={store.address}
                           href={`coffee-store/${store.id}`}
                           className={styles.card}
                        />
                     ))}
                  </div>
               </div>
            )}

            {initialProps.coffeeStores?.length && (
               <div className={styles.sectionWrapper}>
                  <div className={styles.heading2}>Toronto Stores</div>
                  <div className={styles.cardLayout}>
                     {initialProps.coffeeStores.map((store) => (
                        <Card
                           key={store.id}
                           name={store.name}
                           imgUrl={
                              store.imgUrl ||
                              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                           }
                           address={store.address}
                           href={`coffee-store/${store.id}`}
                           className={styles.card}
                        />
                     ))}
                  </div>
               </div>
            )}
         </main>
      </div>
   );
}

export default Home;