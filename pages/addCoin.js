import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import { useAppContext } from '../context/userContext';
import { useSession } from 'next-auth/react';

const Addcoin = () => {
  const router = useRouter();
  const {roleName} = useAppContext();
  const {coinId,coinName,coinInternalId,coinCanbeSaved} = router.query;
  const { register, handleSubmit, watch, formState: { errors } } = useForm({defaultValues: {
    cryptoName: coinName || "",
    internalId: coinInternalId || "",
    canBeSaved: coinCanbeSaved === "true"
  }});
  const onSubmit = async (data) => {
    const payload = {...data,_id:coinId};
    await fetch('/api/admin/addCoin',{
      method: 'POST',
      body: JSON.stringify(payload)
    })
    };

  const onDelete = async () => {
    await fetch('/api/admin/deleteCoin',{
      method: 'POST',
      body: JSON.stringify({_id:coinId})
    })
    };

  const { status } = useSession();

  useEffect(() => {
    if (status !== "loading" && roleName !== "admin") {
      router.push('/');
    }
  }, [roleName]);

  return (
      <div>
        <form className="w-100 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <input className="border border-black m-1 w-80" type="text" {...register("cryptoName", { required: true })} />
        {errors.name && <span>This field is required</span>}
        <label htmlFor="internalId">Internal Id</label>
        <input  className="border border-black m-1 w-80" type="text" {...register("internalId", { required: true })} />
        {errors.internalId && <span>This field is required</span>}
        <label htmlFor="canBeSaved">Can be saved as favorite</label>
        <input className="border border-black m-1 w-80" type="checkbox" {...register("canBeSaved")} />
        <input type="submit" />
        </form>
        <button onClick={()=>onDelete()} className="cursor-pointer">BORRAR MONEDA</button>
      </div>
  );
}

export default Addcoin;