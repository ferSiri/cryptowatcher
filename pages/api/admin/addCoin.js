import { client } from '../../../lib/sanity';

export default async function addCoin(req,res){
    const { cryptoName, internalId, canBeSaved, _id } = JSON.parse(req.body);
    const doc = {
        _type: 'crypto',
        cryptoName,
        internalId,
        canBeSaved
    };
    /*IDEALMENTE ANTES DE EFECTUAR UNA OPERACIÓN COMO ESTA HABRÍA QUE ASEGURARSE DESDE EL BACK TAMBIÉN DE QUE EL USUARIO POSEE LOS PERMISOS
    YA SEA HACIENDO UNA LLAMADA AL SERVICIO DE ROLES EN ESTE MOMENTO O CON UN MIDDLEWARE, NO SE REALIZA POR NO CONTAR CON TIEMPO PARA TOOS 
    LOS REQUERIMIENTOS
    */    
    try {
        //CREATEORREPLACE PISA EL DOCUMENTO ENTERO, ELIMINANDO LA FOTO, CUYO UPLOAD AÚN ESTÁ TO DO
        if(_id){
            await client.patch(_id).set(doc).commit()
        }else{
            await client.create(doc)
        }
    }
    catch (err){
        return res.status(500).json({message:"Error in mutation",err});
    }
    return res.status(200).json({message:"Success"});
}