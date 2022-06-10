import CoinsHeader from "./CoinsHeader";
import Coin from "./Coin";

const CoinsArea = ({coins, userData, userFavs, handleFav, handleDeleteCoin}) => {
    
    return (
        <div className="w-full p-4 flex flex-col items-center">
            <CoinsHeader/>
            {coins.map(coin=>
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