import { client } from '../../../lib/sanity';

export default function deleteCoin(req,res){
    const { _id } = JSON.parse(req.body);
    /*IDEALMENTE ANTES DE EFECTUAR UNA OPERACIÓN COMO ESTA HABRÍA QUE ASEGURARSE DESDE EL BACK TAMBIÉN DE QUE EL USUARIO POSEE LOS PERMISOS
    YA SEA HACIENDO UNA LLAMADA AL SERVICIO DE ROLES EN ESTE MOMENTO O CON UN MIDDLEWARE, NO SE REALIZA POR NO CONTAR CON TIEMPO PARA TOOS 
    LOS REQUERIMIENTOS
    */
    try {
        client.fetch(`*[_type == "userFavs" && references("${_id}")][0]`)
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