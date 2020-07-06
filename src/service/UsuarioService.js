import { ConfigClass } from '../classes/ConfigClass'

//Caminho da API
let caminho = `${ConfigClass.getUrlApi().toString()}/users/`;

//Exportando o Service
export default class UsuarioService{
  constructor(){ }

  //Tratando metodo GET para todos 
  static getTodos(){
    return fetch(caminho).then(response => {
    return response.json();
    })
  }

//Tratando metodo GET por Id
  static getId(id){
    return fetch(`${caminho}/${id}`).then(response => {
      return response.json();
    })
  }

//Tratando metodo POST
  static adicionar(registro){
    return fetch(caminho,
      {
        headers: {
          "Accept": 'application/json',
          "Content-Type": "application/json"
        },
          method: "POST",
          body: JSON.stringify(registro)       
      }      
    ).then(response => {
      return response.json();
    })
  }

//Tratando metodo PUT
  static editar(registro){
    return fetch(caminho,
      {
        headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json"
      },
        method: "PUT",
        body: JSON.stringify(registro)    
      }      
    ).then(response => {
      console.log(response);
      return response.json();
    })
  }   

  //Tratando metodo DELETE
  static deletar(id){
    return fetch(`${caminho}/${id}`,
      {
        method: "DELETE"       
      }      
    ).then(response => {
      return response.json();
    })
  }
}