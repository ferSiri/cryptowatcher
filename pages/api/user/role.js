import { client } from '../../../lib/sanity';

export default async function getRole(req,res){
    /*EL ROL DE ADMIN SE ASIGNA DESDE EL STUDIO Y SE PIDE DE ESTA MANERA DEBIDO A QUE EL ÚNICO CAMPO EXTRA QUE SE PUEDE 
    OBTENER DEL SCHEMA USER A TRAVÉS DE useSession (MODIFICANDO LA CONFIG DE jwt Y session EN [...nextauth].js) ES EL ID.
    A MENOS QUE SE IMPLEMENTE UN ORM Y DB, LO QUE PARA EL CASO ME PARECIÓ UN OVERKILL, SOBRE TODO CON EL POCO TIEMPO DEL QUE DISPONGO.
    */
    const {uId} = req.query;
    try {
        const userRole = await client.fetch(`*[_type == "userRoles" && references("${uId}")][0]{role->{roleName}}`);
        return res.status(200).json({userRole});
    }
    catch (err){
        return res.status(500).json({message:"Error fetching user role",err});
    }
    
}