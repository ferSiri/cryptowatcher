import { useEffect, useState } from 'react';
import Coin from '../components/Coin';
import { useSession } from 'next-auth/react';
import { client } from '../lib/sanity';
import NavBar from '../components/NavBar';

export default function Home() {
  
  const [coins, setCoins] = useState([]);
  const [searchString, setSearchString] = useState('');
  const { data } = useSession();
  const [ userFavs, setUserFavs ] = useState([]);

  const fetchCoins = async () =>{
    await client.fetch(`*[_type == "crypto"]`)
    .then(res=>{
      const search = res.reduce((str, current, i, arr)=>{
        return str+=`${current.internalId}${arr[i+1] ? ',':''}`;
      },'');
      fetch('https://api.coingecko.com/api/v3/simple/price?' + new URLSearchParams({
        vs_currencies: 'usd',
        ids: search,
        include_market_cap: true,
        include_24hr_vol: true
      }))
      .then(response => response.json())
      .then(data => {
        const coinsInfo = res.map(coin=>{
          coin.price = data[coin.internalId]?.usd;
          coin.marketCap = data[coin.internalId]?.usd_market_cap;
          coin.vol = data[coin.internalId]?.usd_24h_vol;
          return coin;
        })
        .sort((a,b)=>b.price-a.price);
        setCoins(coinsInfo);
        setSearchString(search);
      } )
    })
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
      });
      setCoins(coinsInfo.sort((a,b)=>b.price-a.price));
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
      const interval = setInterval(()=>{
        fetchCoinsInfo();
       },60000)
      return()=>clearInterval(interval);
    }
  }, [searchString]) 
  
  return (
    <div>
      <NavBar user={data}/>
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

