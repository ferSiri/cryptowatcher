import { useEffect, useState } from 'react';
import Coin from './components/Coin';
import { useSession } from 'next-auth/react';
import { client } from '../lib/sanity';
import { useAppContext } from '../context/userContext';

export default function Home() {
  
  const { roleName } = useAppContext();
  const [coins, setCoins] = useState([]);
  const [searchString, setSearchString] = useState('');
  const { data, status } = useSession();
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
        coin.price = data[coin.internalId]?.usd;
        coin.marketCap = data[coin.internalId]?.usd_market_cap;
        coin.vol = data[coin.internalId]?.usd_24h_vol;
        return coin;
      }).sort((a,b)=>a.price-b.price);
      setCoins(coinsInfo);
    } )
  }

  const fetchFavs = () =>{
    fetch(`/api/user/favCoins?uId=${data.user.id}`,{method: 'GET'})
    .then(response => response.json())
    .then(res=> setUserFavs(res.userFavs && res.userFavs ? res.userFavs : []))
  }

  const handleFav = async (coin,isFav) =>{
    await fetch(`/api/user/${isFav ? 'removeFav':'addFav'}`,{
        method: 'POST',
        body: JSON.stringify({uId:data.user.id, cryptoId:coin._id})
    }).then((res)=>setUserFavs(prevFavs=>{
      //LA RESPUESTA DE LA MUTATION TARDA DEMASIADO COMO PARA ESPERAR Y PEDIR LOS FAVS NUEVAMENTE
      if(isFav){
        return prevFavs.filter(fav=>fav._id!==coin._id);
      }else{
        return [...prevFavs,{_id: coin._id}];
      }
    }) );
}

  useEffect(()=>{
    fetchCoins();
  },[]);

  useEffect(()=>{
    if(data && data.user){
      fetchFavs();
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
  
  console.log(roleName, data)
  return (
    <div className="container">
      {coins.map(coin=>
        <Coin 
          coin={coin} 
          userData={data}
          key={coin._id}
          isFav={coin.canBeSaved && userFavs && userFavs.some(favs=>favs._id===coin._id)}
          handleFav={handleFav}
        />)}
    </div>
  )
}

