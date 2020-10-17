function $(id,setValue = null){
    var element = document.getElementById(id);

    if(setValue != null){     

        if(element.type == "radio"){

            element.checked = setValue;
        } else {
 
            element.value = setValue;
        }
    }

    return element;
}

function RequestHttp(peticionHttp,funcion,metodo,endpoint,ContentType = null,res = null){

    peticionHttp.onreadystatechange = funcion
        
    peticionHttp.open(metodo,endpoint,true);

    if(metodo === 'POST'){
        
        peticionHttp.setRequestHeader("Content-Type",ContentType);        
    }

    peticionHttp.send(res);
}


function ValidarFecha(fecha){
    
    var hoy = new Date();
    var fechaDeFinal = new Date(fecha);

    if(fechaDeFinal < hoy){
        alert("Error. La fecha tiene que ser menor a la actual");
        return false;
    } else {
        console.log("Hello");
        return true;
    }
}

