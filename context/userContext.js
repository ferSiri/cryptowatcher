import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const AppContext = createContext();

export function UserContext({ children }) {
    const [userRole, setUserRole] = useState({roleName:"unregistered"});
    const { data, status } = useSession();
    useEffect(()=>{
      if(data && data.user){
        fetch(`/api/user/role?uId=${data.user.id}`,{method: 'GET'})
        .then(response => response.json())
        .then(res=> setUserRole(res.userRole &&  res.userRole.role ? res.userRole.role : {roleName:"common"} ))
      }else{
        setUserRole({roleName:"unregistered"})
      }
      },[data]);

    return (
    <AppContext.Provider value={userRole}>
        {children}
    </AppContext.Provider>
    );
}

export function useAppContext() {
  return useContext(AppContext);
}