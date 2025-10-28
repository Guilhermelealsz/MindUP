import {BrowserRouter, Route, Routes} from "react-router";
import Inicio from "./pages/inicio/inicio";
import Cadastro from "./pages/cadastro/Index";
import Login from "./pages/login/login";
import Agenda from "./pages/agenda/agenda";
import Sobre from "./pages/sobre/sobre";
import Consulta from "./pages/verificarConsultas/consulta";
import Blogs from "./pages/blogs/blog";


export default function Navegacao(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio/>}/>
                <Route path="/Cadastro" element={<Cadastro/>}/>
                <Route path="/login" element={<Login/>}/>
                 <Route path="/" element={<Agenda/>}/>
                 <Route path="/sobre" element={<Sobre/>}/>
                 <Route path="/" element={<Consulta/>}/>
                 <Route path="/" element={<Blogs/>}/>
            </Routes>
        </BrowserRouter>
    )
}