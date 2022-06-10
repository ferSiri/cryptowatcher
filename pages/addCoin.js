import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppContext } from '../context/userContext';
import { useSession } from 'next-auth/react';
import TextInput from '../components/TextInput';
import coinSchema from '../validations/coinSchema';

const Addcoin = () => {
  const router = useRouter();
  const {roleName} = useAppContext();
  const {coinId,coinName,coinInternalId,coinCanbeSaved} = router.query;
  const { register, handleSubmit, watch, formState: { errors } } = useForm({defaultValues: {
    cryptoName: coinName || "",
    internalId: coinInternalId || "",
    canBeSaved: coinCanbeSaved === "true"
  },
  resolver: yupResolver(coinSchema)
  });

  const onSubmit = async (data) => {
    const payload = {...data,_id:coinId};
    await fetch('/api/admin/addCoin',{
      method: 'POST',
      body: JSON.stringify(payload)
    }).then(res=>{
      if(res.status === 200){
        router.push('/');
      }
    }) 
    };

  const { status } = useSession();

  useEffect(() => {
    if (status !== "loading" && roleName !== "admin") {
      router.push('/');
    }
  }, [roleName]);
  
  return (
    <div className='flex flex-col items-center'>
      <div className='w-full h-16 flex justify-between items-center px-4 bg-pink-900 mb-12'>
          <div className='h-full flex items-center'>
              <h1 className='font-black text-white text-xl'>{coinId ? 'Edit Coin':'Add new Coin'}</h1>
          </div>
          <div>
            <button className='text-base text-white font-semibold' onClick={()=> router.push("/")}>Back to main</button>
          </div>
      </div>
      <form className="w-96 flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
        <TextInput placeholder='Coin name' type="text" {...register("cryptoName", { required: true })} />
        {errors.cryptoName &&<div className="h-6 text-sm text-red-600">{errors.cryptoName.message}</div>}
        <TextInput placeholder='Internal id' type="text" {...register("internalId", { required: true })} />
        {errors.cryptoName &&<div className="h-6 text-sm text-red-600">{errors.internalId.message}</div>}
        <div className='flex items-center'>
          <label htmlFor="canBeSaved">Can be saved as favorite</label>
          <input className="ml-3" type="checkbox" {...register("canBeSaved")} />
        </div>
        <input className='w-24 h-6 mt-10 rounded bg-pink-900 text-white cursor-pointer' type="submit" value={"Save"}/>
      </form>
    </div>
)
}

export default Addcoin;