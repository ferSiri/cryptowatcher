import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useNextSanityImage } from 'next-sanity-image';
import { client } from './../lib/sanity';
import Modal from 'react-modal';
import { useAppContext } from './../context/userContext';
import { MdOutlinePriceChange } from 'react-icons/md';
import { BsGraphUp, BsGraphDown } from 'react-icons/bs';
import { TbReportMoney } from 'react-icons/tb';
import { RiHeartLine, RiHeartFill } from 'react-icons/ri';
import { FaTrashAlt } from 'react-icons/fa';
import { TbEdit } from 'react-icons/tb';
import DeleteModal from './DeleteModal';
import GenericCoin from '../public/generic.png';

const Coin = ({coin, userData, isFav, handleFav, handleDeleteCoin}) => {
    Modal.setAppElement('#react-modals');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          
          transform: 'translate(-50%, -50%)',
        },
      };
    const price = coin.price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(coin.price) : "0";
    const marketCap = coin.marketCap ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(coin.marketCap) : "0";
    const coinChange = coin.change ? coin.change.toFixed(2) : "0";
    return (
        <div className='h-12 w-full relative flex items-center mb-3 px-3  rounded shadow-lg hover:bg-blue-200'>
            <Modal
                isOpen={deleteModalOpen}
                onRequestClose={()=>setDeleteModalOpen(false)}
                style={customStyles}
            >
                <DeleteModal onDelete={()=>handleDeleteCoin(coin)} onClose={()=>setDeleteModalOpen(false)}/>
            </Modal>
            <div className='w-3/12 flex items-center '>
                <div className='h-5 w-5 relative mr-6'>
                    {coin.logo 
                        ? <Image {...imageProps}   objectFit='contain'/>
                        : <Image src={GenericCoin}   objectFit='contain'/>
                    }
                </div>
                <div className='w-52 '>{coin.cryptoName}</div>
                {coin.canBeSaved && userData &&
                    (isFav
                        ? 
                        <RiHeartFill 
                            className='mr-2 text-red-500 cursor-pointer'
                            onClick={()=> handleFav(coin, isFav)}
                        />
                        : 
                        <RiHeartLine 
                            className='mr-2 text-black cursor-pointer'
                            onClick={()=> handleFav(coin, isFav)}
                        />
                    )
                }
            </div>
            <div className='w-3/12 flex items-center'>
                <MdOutlinePriceChange className='mr-2 text-green-500'/>
                <p className='text-ellipsis overflow-hidden whitespace-pre'>{price}</p>
            </div>
            <div className='w-3/12 flex items-center'>
                <TbReportMoney className='mr-2 text-green-500'/>
                <p className='text-ellipsis overflow-hidden whitespace-pre'>{marketCap}</p>
            </div>
            <div className='w-3/12 flex items-center'>
                {coin.change < 0 ? <BsGraphDown className='mr-2 text-red-500'/> : <BsGraphUp className='mr-2 text-green-500'/>}
                <p className='text-ellipsis overflow-hidden whitespace-pre'>{`${coinChange}%`}</p>
            </div>
            <div className='flex item absolute right-2'>
                {
                    roleName === "admin" &&
                        <TbEdit 
                            className='mr-4 text-rose-900 cursor-pointer text-xl'
                            onClick={()=>router.push({ pathname: '/addCoin', query: editParams })}
                        />
                }
                {
                    roleName === "admin" &&
                        <FaTrashAlt 
                            className='mr-2 text-rose-900 cursor-pointer'
                            onClick={()=>setDeleteModalOpen(true)}
                        />
                }
            </div>
        </div>
    );
}

export default Coin;