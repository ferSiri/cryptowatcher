import { useEffect, useState } from 'react';
import { createClient } from "next-sanity";
import Coin from './components/Coin';
import { useSession, signIn, signOut } from 'next-auth/react';
import { client } from '../lib/sanity';

export default function Home() {
  
  const [coins, setCoins] = useState([]);
  const [searchString, setSearchString] = useState('');
  const { data, status } = useSession();
  const [ userRole, setUserRole ] = useState({});
  const [ userFavs, setUserFavs ] = useState([]);

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
    if(data && data.user){
      fetch(`/api/user/role?uId=${data.user.id}`,{method: 'GET'})
      .then(response => response.json())
      .then(res=> setUserRole(res))
    }
  },[data]);

  useEffect(()=>{
    if(data && data.user){
      fetch(`/api/user/favCoins?uId=${data.user.id}`,{method: 'GET'})
      .then(response => response.json())
      .then(res=> setUserFavs(res.userFavs && res.userFavs ? res.userFavs : []))
    }
  },[data]);

  useEffect(()=>{
    if(searchString){
      fetchCoinsInfo();
      const interval = setInterval(()=>{
        fetchCoinsInfo();
       },60000)
      return()=>clearInterval(interval);
    }
  }, [searchString])
  
  return (
    <div>
      {coins.map(coin=>
        <Coin 
          coin={coin} 
          userData={data}
          key={coin._id}
          isFav={coin.canBeSaved && userFavs.some(favs=>favs._id===coin._id)}
        />)}
    </div>
  )
}

