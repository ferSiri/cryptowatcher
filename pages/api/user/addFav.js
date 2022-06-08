import { client } from '../../../lib/sanity';

export default async function addFav(req,res){
    const {uId, cryptoId} = JSON.parse(req.body);
    const favsId = `${uId}-favourite`;
    const doc = {
        _id: favsId,
        _type: 'userFavs',
        user:{
            _type: "reference",
            _ref: uId
        }
      }
    try {
        await client.createIfNotExists(doc).then((res) => {
            client.patch(res._id)
            .setIfMissing({coins: []})
            .insert('after', 'coins[-1]', [{ _type:"reference", _ref:cryptoId}])
            .commit({
                autoGenerateArrayKeys: true,
              })
          })

    }
    catch (err){
        return res.status(500).json({message:"Error in mutation",err});
    }
    return res.status(200).json({message:"Success"});
}