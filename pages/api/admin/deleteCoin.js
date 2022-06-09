import { client } from '../../../lib/sanity';

export default async function deleteCoin(req,res){
    const { _id } = JSON.parse(req.body);
        
    try {
        await client.fetch(`*[_type == "userFavs" && references("${_id}")][0]`)
        .then(res=>{
            if(res){
                const cryptoToRemove = [`coins[_ref=="${_id}"]`];
                client.patch(res._id).unset(cryptoToRemove)
                .commit()
                .then(res=>{
                    client.delete(_id)
                })
            }else{
                client.delete(_id)
            }
        })
    }
    catch (err){
        return res.status(500).json({message:"Error in mutation",err});
    }
    return res.status(200).json({message:"Success"});
}