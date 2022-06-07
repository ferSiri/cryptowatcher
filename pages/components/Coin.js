import Image from 'next/image'
import { useNextSanityImage } from 'next-sanity-image';

const Coin = ({coin, client}) => {
    const imageProps = useNextSanityImage(
		client,
		coin.logo
	);
    
    return (
        <div>
            <Image {...imageProps}/>
        </div>
    )
}

export default Coin;