import { useState } from 'react';
import CoinsHeader from "./CoinsHeader";
import Coin from "./Coin";

const CoinsArea = ({coins, userData, userFavs, handleFav, handleDeleteCoin}) => {
    
    const [filterByFav, setFilterByFav] = useState(false);
    const filteredCoins = filterByFav 
        ? coins.filter(c=>c.canBeSaved && userFavs.some(favs=>favs._id===c._id)) 
        : coins;
    
    return (
        <div className="w-full p-4 flex flex-col items-center">
            <CoinsHeader 
                filterFavorites={filterByFav} 
                setFilterFavorites={setFilterByFav} 
                userData={userData}
            />
            {filteredCoins.map(coin=>
            <Coin 
                coin={coin} 
                userData={userData}
                key={coin._id}
                isFav={coin.canBeSaved && userFavs && userFavs.some(favs=>favs._id===coin._id)}
                handleFav={handleFav}
                handleDeleteCoin={handleDeleteCoin}
            />)}
        </div>
    )
};

export default CoinsArea;