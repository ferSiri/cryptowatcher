import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAppContext } from './../context/userContext';


const NavBar = ({user}) => {
    const router = useRouter();
    const {roleName} = useAppContext();
    return (
        <div className='w-full h-16 flex justify-between items-center px-4 bg-pink-900'>
            <div className='h-full flex items-center'>
                <h1 className='font-black text-white text-3xl'>Cryptowatcher</h1>
            </div>
            <div>
                { roleName === "admin" &&
                    <button className='text-base text-white font-semibold mr-8' onClick={() => router.push("/addCoin")}>Add new coin</button>
                }
                { user ?
                    <button className='text-base text-white font-semibold' onClick={() => signOut({ redirect: false })}>Log Out</button>
                    :
                    <button className='text-base text-white font-semibold' onClick={()=> router.push("/credentials")}>Log In</button>
                }
            </div>
        </div>
    )
};

export default NavBar;