import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { client } from '../lib/sanity';
import NavBar from '../components/NavBar';
import CoinsArea from '../components/CoinsArea';

export default function Home() {
  
  const [coins, setCoins] = useState([]);
  const [searchString, setSearchString] = useState('');
  const { data } = useSession();
  const [ userFavs, setUserFavs ] = useState([]);

  const fetchCoins = async () =>{
      const sanityCoinsData = await client.fetch(`*[_type == "crypto"]`);
      const search = await sanityCoinsData.reduce((str, current, i, arr)=>{
        return str+=`${current.internalId}${arr[i+1] ? ',':''}`;
      },'');
      const geckoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?' + new URLSearchParams({
        vs_currencies: 'usd',
        ids: search,
        include_market_cap: true,
        include_24hr_change: true
      }));
      const geckoData = await geckoRes.json();
      const coinsInfo = sanityCoinsData.map(coin=>{
        coin.price = geckoData[coin.internalId]?.usd;
        coin.marketCap = geckoData[coin.internalId]?.usd_market_cap;
        coin.change = geckoData[coin.internalId]?.usd_24h_change;
        return coin;
      }).sort((a,b)=>b.price-a.price);
      setCoins(coinsInfo);
      setSearchString(search);
  }

  const fetchCoinsInfo = async () =>{
    const geckoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?' + new URLSearchParams({
      vs_currencies: 'usd',
      ids: searchString,
      include_market_cap: true,
      include_24hr_change: true
    }))
    const geckoData = await geckoRes.json();
    const coinsInfo = coins.map(coin=>{
      coin.price = geckoData[coin.internalId]?.usd;
      coin.marketCap = geckoData[coin.internalId]?.usd_market_cap;
      coin.change = geckoData[coin.internalId]?.usd_24h_change;
      return coin;
    }).sort((a,b)=>b.price-a.price);
    setCoins(coinsInfo);
  }

  const fetchFavs = async () =>{
    const favRes = await fetch(`/api/user/favCoins?uId=${data.user.id}`,{method: 'GET'});
    const userFavsData = await favRes.json();
    setUserFavs(userFavsData && userFavsData.userFavs ? userFavsData.userFavs : []);
  }

  const handleFav = async (coin,isFav) =>{
    const favActionResponse = await fetch(`/api/user/${isFav ? 'removeFav':'addFav'}`,{
        method: 'POST',
        body: JSON.stringify({uId:data.user.id, cryptoId:coin._id})
    });
    setUserFavs(prevFavs=>{
      //LA RESPUESTA DE LA MUTATION TARDA DEMASIADO COMO PARA ESPERAR Y PEDIR LOS FAVS NUEVAMENTE
      if(favActionResponse){
        if(isFav){
          return prevFavs.filter(fav=>fav._id!==coin._id);
        }else{
          return [...prevFavs,{_id: coin._id}];
        }
      }
    });
  }

  const handleDeleteCoin = async (coin) => {
    const deleteCoinResponse = await fetch('/api/admin/deleteCoin',{
      method: 'POST',
      body: JSON.stringify({ _id:coin._id})
    });
    setCoins(prev=>prev.filter(c=>c._id !== coin._id));
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
      <CoinsArea
        coins={coins}
        userData={data} 
        userFavs={userFavs}
        handleFav={handleFav}
        handleDeleteCoin={handleDeleteCoin}
      />
    </div>
  )
}

