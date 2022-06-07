import { useEffect, useState } from 'react';
import { createClient } from "next-sanity";
import Coin from './components/Coin';

const client = createClient({
  projectId: "37j4qhjm",
  dataset: "production",
  useCdn: true
});

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [searchString, setSearchString] = useState('');

  const fetchCoins = async () =>{
    const userCoins = await client.fetch(`*[_type == "crypto"]`);
    const search = userCoins.reduce((str, current, i, arr)=>{
      return str+=`${current.internalId}${arr[i+1] ? ',':''}`;
    },'');
    setCoins(userCoins);
    setSearchString(search); 
  }


  const fetchCoinsInfo = () =>{
    fetch('https://api.coingecko.com/api/v3/simple/price?' + new URLSearchParams({
      vs_currencies: 'usd',
      ids: searchString,
      include_market_cap: true,
      include_24hr_vol: true
    }))
    .then(response => response.json())
    .then(data => {
      const coinsInfo = coins.map(coin=>{
        coin.price = data[coin.internalId].usd;
        coin.marketCap = data[coin.internalId].usd_market_cap;
        coin.vol = data[coin.internalId].usd_24h_vol;
        return coin;
      });
      setCoins(coinsInfo);
    } )
  }

  useEffect(()=>{
    fetchCoins();
  },[]);

  useEffect(()=>{
    if(searchString){
      fetchCoinsInfo();
      const interval = setInterval(()=>{
        fetchCoinsInfo();
       },60000)
      return()=>clearInterval(interval);
    }
  }, [searchString])
  
  console.log(coins)
  return (
    <div>
      {coins.map(coin=><Coin coin={coin} client={client}/>)}
    </div>
  )
}

