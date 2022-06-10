import { useAppContext } from './../context/userContext';
import { TbFilter, TbFilterOff } from 'react-icons/tb';

const CoinsHeader = ({filterFavorites, setFilterFavorites, userData}) => {
    const {roleName} = useAppContext();
    return (
        <div className='h-12 w-full flex items-center mb-3 px-3 shadow-lg'>
            <div className='w-3/12 flex items-center font-bold'>
                {userData &&
                    <div className='h-full flex items-center' onClick={()=>setFilterFavorites(!filterFavorites)}>
                        {filterFavorites
                        ?<TbFilterOff className='absolute cursor-pointer'/>
                        :<TbFilter className='absolute cursor-pointer'/>
                        }
                    </div> 
                }
                <p className='ml-11'>Name</p> 
            </div>
            <div className='w-3/12 flex items-center  font-bold'>
                Price
            </div>
            <div className='w-3/12 flex items-center  font-bold'>
                Market Cap
            </div>
            <div className='w-3/12 flex items-center justify-between  font-bold'>
                Change
            </div>
        </div>
    )
}

export default CoinsHeader;