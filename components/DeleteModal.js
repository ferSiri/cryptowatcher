import { IoMdClose } from 'react-icons/io';
import { BsShieldExclamation } from 'react-icons/bs';

const DeleteModal = ({onDelete, onClose}) => {
    return (
        <div className='w-80 h-80 flex flex-col justify-between items-end bg-white'>
            <IoMdClose 
                className='text-lg cursor-pointer' 
                onClick={()=>onClose()}
            />
            <div className='w-full flex flex-col flex-1 justify-between items-center'>
                <BsShieldExclamation className='text-8xl text-red-500'/>
               <p className='text-center'>Are you sure you want to permanently remove this coin?</p>
               <div className='w-full flex justify-between'>
                    <button onClick={()=>onClose()} className='w-32 h-8 rounded border border-solid border-black shadow'>Cancel</button>
                    <button onClick={()=>{onDelete(); onClose()}} className='w-32 h-8 rounded bg-red-500 text-white shadow'>Delete</button>
               </div>
            </div>
        </div>
    )
};

export default DeleteModal;