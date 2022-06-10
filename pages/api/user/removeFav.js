import { client } from '../../../lib/sanity';

export default async function addFav(req,res){
    const {uId, cryptoId} = JSON.parse(req.body);
    const cryptoToRemove = [`coins[_ref=="${cryptoId}"]`];
    
    try {
        await client.patch(`${uId}-favorite`).unset(cryptoToRemove).commit()  
    }
    catch (err){
        return res.status(500).json({message:"Error in mutation",err});
    }
    return res.status(200).json({message:"Success"});
}