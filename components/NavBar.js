import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const NavBar = ({user}) => {
    const router = useRouter();
    return (
        <div className='w-full h-16 flex justify-between items-center px-4 bg-pink-900'>
            <div className='h-full flex items-center'>
                <h1 className='font-black text-white text-3xl'>Cryptowatcher</h1>
            </div>
            { user ?
                <button className='text-base text-white font-semibold' onClick={() => signOut({ redirect: false })}>Log Out</button>
                :
                <button className='text-base text-white font-semibold' onClick={()=> router.push("/credentials")}>Log In</button>
            }
        </div>
    )
};

export default NavBar;