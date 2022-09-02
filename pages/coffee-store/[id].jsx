import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useStoreContext } from '../../contexts/storeContext';
import { getCoffeeStores } from '../../lib/coffeeStore';
import useSWR from 'swr';
import cls from 'classnames';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import coffeeStores from '../../data/coffee-stores';
import styles from '../../styles/CoffeeStore.module.css';

export const getStaticProps = async function (context) {
   const { params } = context;
   const coffeeStores = await getCoffeeStores();
   return {
      props: {
         store: coffeeStores.find((store) => store.fsq_id == params.id) || null,
      },
   };
};

export const getStaticPaths = async function () {
   const coffeeStores = await getCoffeeStores();
   return {
      paths: coffeeStores.map((store) => ({ params: { id: store.id } })),
      fallback: true,
      // fallback: 'true' tells Next to pregenerate only for id = 0 and id = 1
      // but to also load (not pregenerate) the other pages with other id values just in time
   };
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Coffee(initialProps) {
   const router = useRouter();

   const { state } = useStoreContext();
   const [store, setStore] = useState(0);
   const [voteCount, setVoteCount] = useState(initialProps?.store?.votes || '');

   const { data, error } = useSWR(
      `/api/get-coffee-store?id=${router.query.id}`,
      fetcher
   );

   useEffect(() => {
      if (!data?.records?.length) return;

      const [store] = data.records;
      setStore(store);
      setVoteCount(store.votes);
   }, [data]);

   const handleCreateStore = async (store) => {
      try {
         const response = await fetch('/api/create-coffee-store', {
            method: 'POST',
            body: JSON.stringify(store),
            headers: { 'Content-Type': 'application/json' },
         });
         const res = await response.json();
      } catch (error) {}
   };

   const handleUpvote = async (ev) => {
      try {
         const response = await fetch('/api/mark-coffee-store-favourite', {
            method: 'PUT',
            body: JSON.stringify({ id: router.query.id }),
            headers: { 'Content-Type': 'application/json' },
         });
         const { updatedRecord } = await response.json();
         setVoteCount(updatedRecord.votes);
      } catch (error) {}
   };

   useEffect(() => {
      if (initialProps.store) return handleCreateStore(initialProps.store); // If store exists by pre-rendering

      const foundStoreInContext = state.coffeeStores.find(
         (store) => store.id == router.query.id
      );
      if (!foundStoreInContext) return setStore(null);
      setStore(foundStoreInContext);
      handleCreateStore(foundStoreInContext);
   }, [router.query.id]);

   if (router.isFallback) return <div>Loading...</div>;
   if (!store) return <>Loading Store...</>;
   if (error)
      return <div>Error retrieving this store. Please try again later </div>;

   const { address, name, imgUrl, votes } = store;
   return (
      <div className={styles.layout}>
         <Head>
            <title>{name}</title>
         </Head>
         <div className={styles.container}>
            <div className={styles.col1}>
               <Link href="/">
                  <a>&larr; Back to home</a>
               </Link>
               <div className={styles.nameWrapper}>
                  <h1>{name}</h1>
               </div>
               <Image
                  src={
                     imgUrl ||
                     'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                  }
                  width={600}
                  height={360}
                  className={styles.storeImg}
                  alt={name + ' image'}
               ></Image>
            </div>
            <div className={cls('glass', styles.col2)}>
               <div className={styles.iconWrapper}>
                  {/* <Image src="../../" width={24} height={24}></Image> */}-
                  <p className={styles.text}>{address}</p>
               </div>
               <div className={styles.iconWrapper}>
                  {/* <Image src="../../" width={24} height={24}></Image> */}-
                  {/* <p>{location.neighborhood}</p> */}
               </div>
               <div className={styles.iconWrapper}>
                  {/* <Image src="../../" width={24} height={24}></Image> */}-
                  <p className={styles.text}>{voteCount}</p>
               </div>
               <button className={styles.upvoteButton} onClick={handleUpvote}>
                  Upvote
               </button>
            </div>
         </div>
      </div>
   );
}

export default Coffee;
