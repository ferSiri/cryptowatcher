import { client } from '../../../lib/sanity';

export default async function getRole(req,res){
    const {uId} = req.query;
    try {
        const userFavs = await client.fetch(`*[_type == "userFavs" && _id=="${uId}-favorite"].coins[]->{_id}`);
        return res.status(200).json({userFavs});
    }
    catch (err){
        return res.status(500).json({message:"Error fetching user favs",err});
    }
    
}