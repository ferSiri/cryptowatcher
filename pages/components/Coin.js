import Image from 'next/image'
import { useNextSanityImage } from 'next-sanity-image';
import { client } from '../../lib/sanity';

const Coin = ({coin, userData, isFav}) => {
    const imageProps = useNextSanityImage(
		client,
		coin.logo
	);
    
    async function handleFav(){
        await fetch(`/api/user/${isFav ? 'removeFav':'addFav'}`,{
            method: 'POST',
            body: JSON.stringify({uId:userData.user.id, cryptoId:coin._id})
        }).then((res)=> console.log(res));
    }
    
    return (
        <div className="w-100% m-5">
            <Image {...imageProps} width='200px' height='200px' />
            <h1 className={""}>{coin.cryptoName}</h1>
            {coin.canBeSaved && <h3 className={`${isFav ? "bg-red-700" :""}`} onClick={()=> handleFav()}>Corazón</h3>}
        </div>
    )
}

export default Coin;