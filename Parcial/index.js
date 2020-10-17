let JsonMaterias;

peticionHttp = new XMLHttpRequest();

window.addEventListener("load",function(){
    tablaBody = $("TablaBody");
    divModificar = $("Modificar");   
    $("btnCerrar").addEventListener("click",EsconderDiv);
    tablaBody.ondblclick = SeleccionarMateria;
});

window.addEventListener("load",CargarTabla);

function EsconderDiv(){
    divModificar.hidden = true;
}

function CargarTabla(){

    RequestHttp(peticionHttp,PedirMaterias,'GET',"http://localhost:3000/materias");
}

function PedirMaterias(){
    
    if(peticionHttp.readyState === 4){
        
        if(peticionHttp.status === 200){
            
            var stringMaterias = peticionHttp.responseText;
            
            JsonMaterias = JSON.parse(stringMaterias);
            
            JsonMaterias.forEach(element => {
                var trMateria = document.createElement("tr");
                var tdId = CrearNodos("td", element.id);
                var tdNombre = CrearNodos("td",element.nombre);
                var tdCuatrimestre = CrearNodos("td",element.cuatrimestre);
                var tdFechaFinal = CrearNodos("td",element.fechaFinal);
                var tdTurno = CrearNodos("td",element.turno);

                tdId.setAttribute("hidden","hidden");

                tablaBody.appendChild(trMateria);
                trMateria.appendChild(tdNombre);
                trMateria.appendChild(tdCuatrimestre);
                trMateria.appendChild(tdFechaFinal);
                trMateria.appendChild(tdTurno);
                trMateria.appendChild(tdId);


            });
        }
        else
        {
            alert("error 200");
        }
    }
}



function SeleccionarMateria(e){
    
    e.target.parentNode.id = "seleccionado";
    var Materiaseleccionada = e.target.parentNode;
    var id = Materiaseleccionada.childNodes[4];
    var nombre = Materiaseleccionada.childNodes[0];
    var Cuatrimestre = Materiaseleccionada.childNodes[1];
    var FechaFinal = Materiaseleccionada.childNodes[2];
    var Turno = Materiaseleccionada.childNodes[3];
    
    Materia = ArmarMateriaJSON(id.innerText,nombre.innerText,Cuatrimestre.innerText,FechaFinal.innerText,Turno.innerText);
    
    AutoCompletarDiv(Materia);
}

function AutoCompletarDiv(Materia){

    divModificar.hidden = false;

    var fecha = Materia.fechaFinal.split("/");
    if(fecha[2] > 2000){
        
        str = fecha[2]+"-"+fecha[1]+"-"+fecha[0];
        $("date",str);
    }
    else{
        $("date",Materia.fechaFinal);
    }
    $("name",Materia.nombre);
    $("cuatrimestre",Materia.cuatrimestre);
    
    
    if(Materia.turno === "Mañana") {
        
        $("mañana", true);
    } else {
        
        $("tarde", true);
    }

    $("btnModificar").addEventListener("click",VerificarCambio);
    $("btnEliminar").addEventListener("click",EliminarMateria);
}

function VerificarCambio(){

    var cambioRealizado = false;
    console.log(Materia);
    

    if(Materia.nombre !== $("name").value){
        cambioRealizado = true;
        Materia.nombre = $("name").value;
    }
    if(Materia.fechaFinal != $("date").value){
        cambioRealizado = true;
        Materia.fechaFinal = $("date").value;
    }
    if(Materia.turno === "Mañana" && $("tarde").checked === true){
        cambioRealizado = true;
        Materia.turno = 'Tarde';
        
    }
    if(Materia.turno === "Tarde" && $("mañana").checked === true){
        cambioRealizado = true;
        Materia.turno = 'Mañana';
    }
    
    
    if(cambioRealizado){

        ModificarMateria();
    }
    
}




function ModificarMateria(){

    if(Materia.nombre.length > 6 && ValidarFecha(Materia.fechaFinal)){

        str ="id="+Materia.id+"&nombre="+Materia.nombre+"&cuatrimestre="+Materia.cuatrimestre+"&fechaFinal="+Materia.fechaFinal+"&turno="+Materia.turno;

        ModificarElementoEnTabla();
        
        RequestHttp(peticionHttp,hola,'POST',"http://localhost:3000/editar","application/x-www-form-urlencoded",str);
        
        
        RequestHttp(peticionHttp,ActualizarMaterias,'GET',"http://localhost:3000/materias");

        EsconderDiv();
    }
}

function ModificarElementoEnTabla(){
    var padre = $("seleccionado");
    var hijos = $("seleccionado").childNodes;
     
    padre.replaceChild(CrearNodos("td",Materia.nombre),hijos[0]);
    padre.replaceChild(CrearNodos("td",Materia.cuatrimestre),hijos[1]);
    padre.replaceChild(CrearNodos("td",Materia.fechaFinal),hijos[2]);
    padre.replaceChild(CrearNodos("td",Materia.turno),hijos[3]);
    
    $("seleccionado").removeAttribute("id");
}

function CrearNodos(element,value = null){

    var nodo = document.createElement(element);
    var texto = document.createTextNode(value);

    nodo.appendChild(texto);

    return nodo;
}

function hola(){
    if(peticionHttp.readyState === 4){

        if(peticionHttp.status === 200){

            var res = peticionHttp.responseText;
            var jsonRes = JSON.parse(res);
            if(jsonRes.type == 'ok'){
                alert("Se elimino correctamente");
            }

        }
    }
}

function EliminarMateria(){

    str ="id="+Materia.id+"&nombre="+Materia.nombre+"&Cuatrimestre="+Materia.Cuatrimestre+"&FechaFinal="+Materia.FechaFinal+"&Turno="+Materia.Turno;
    RemoverElementoEnTabla()
    RequestHttp(peticionHttp,hola,'POST',"http://localhost:3000/eliminar","application/x-www-form-urlencoded",str);

    EsconderDiv();
}

function RemoverElementoEnTabla(){
    var padre = $("seleccionado");
    var hijos = $("seleccionado").childNodes;
     
    for (let i = 0; i < hijos.length; i++) {
        padre.removeChild(hijos[i]);
    }
    var tabla = padre.parentNode;
    tabla.removeChild(padre);
    
}

function ArmarMateriaJSON(id = '',nombre = '',Cuatrimestre = '',FechaFinal = '',Turno = ''){

    return {"id": id ,"nombre": nombre ,"cuatrimestre": Cuatrimestre ,"fechaFinal": FechaFinal ,"turno": Turno};
    
}

function ActualizarMaterias(){
    if(peticionHttp.readyState === 4){
        
        if(peticionHttp.status === 200){
            
            var stringMaterias = peticionHttp.responseText;
            
            JsonMaterias = JSON.parse(stringMaterias);
        }
    }
}

