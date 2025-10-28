import usuarioController from './controller/usuarioController.js'
import consultarController from './controller/consultarController.js'

export default function adicionarRotas(servidor){
    servidor.use(usuarioController)
    servidor.use(consultarController)

}