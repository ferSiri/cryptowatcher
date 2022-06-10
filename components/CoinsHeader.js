import { useState } from 'react';
import { useAppContext } from './../context/userContext';

const CoinsHeader = ({coin, userData, isFav, handleFav, handleDeleteCoin}) => {
    const {roleName} = useAppContext();
    return (
        <div className='h-12 w-full flex items-center mb-3 px-3 shadow-lg'>
            <div className='w-3/12 flex items-center pl-11 font-bold'>
                Name
            </div>
            <div className='w-3/12 flex items-center  font-bold'>
                Price
            </div>
            <div className='w-3/12 flex items-center  font-bold'>
                Market Cap
            </div>
            <div className='w-3/12 flex items-center  font-bold'>
                Change
            </div>
        </div>
    )
}

export default CoinsHeader;