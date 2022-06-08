import { client } from '../../../lib/sanity';

export default async function getRole(req,res){
    const {uId} = req.query;
    try {
        const userRole = await client.fetch(`*[_type == "userRoles" && references("${uId}")][0]{role->{roleName}}`);
        return res.status(200).json({userRole});
    }
    catch (err){
        return res.status(500).json({message:"Error fetching user role",err});
    }
    
}