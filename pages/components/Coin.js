import Image from 'next/image';
import { useRouter } from 'next/router';
import { useNextSanityImage } from 'next-sanity-image';
import { client } from '../../lib/sanity';
import { useAppContext } from '../../context/userContext';

const Coin = ({coin, userData, isFav, handleFav}) => {
    const router = useRouter();
    const {roleName} = useAppContext();
    const imageProps = useNextSanityImage(
		client,
		coin.logo
	);
    const editParams= {
        coinId: coin._id,
        coinName: coin.cryptoName,
        coinInternalId: coin.internalId,
        coinCanbeSaved: coin.canBeSaved
    };
    return (
        <div className="w-100% m-5">
            {coin.logo && <Image {...imageProps} width='200px' height='200px' />}
            <h1 className={""}>{coin.cryptoName}</h1>
            {coin.canBeSaved && userData && <h3 className={`pointer ${isFav ? "bg-red-700" :""}`} onClick={()=> handleFav(coin, isFav)}>Corazón</h3>}
            {roleName === 'admin' && <h3 onClick={()=>router.push({ pathname: '/addCoin', query: editParams })}>Editar Crypto</h3>}
        </div>
    )
}

export default Coin;