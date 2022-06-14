import { client } from '../../../lib/sanity';

export default function addFav(req,res){
    /*SE PODRÍA BUSCAR PRIMERO SI EXISTE CON LA QUERY *[references($person) && _type == "userFavs"] { person: uId}
    , SI EXISTE UN PATCH Y SINO UN CREATE Y LUEGO UN PATCH PERO TARDA DEMASIADO*/
    const {uId, cryptoId} = JSON.parse(req.body);
    const favsId = `${uId}-favorite`;
    const doc = {
        _id: favsId,
        _type: 'userFavs',
        user:{
            _type: "reference",
            _ref: uId
        }
      }
    try {
        client.createIfNotExists(doc)
        .then((res) => {
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