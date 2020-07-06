<template>
  <div>
    <h1>Alteração de Usuários</h1>
    <div id='msg' v-html="mensagem"></div>
      <div id='listagem' class="format" v-show="exibirListagemForm">
        <button id='btn-exibir-formulario'
          type="button" class="btn btn-primary" 
          v-on:click="prepararFormCadastro()"
        >   
          Cadastrar
        </button>
        <br>
        <hr>
        <div id='usuarios-listagem'> 
          <div class="table-responsive"> 
            <table class="table table-striped table-bordered table-hover table-sm">
              <thead>
                <tr style="text-align: center;" >
                  <th>Código</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>E-mail</th>
                  <th>Alterar</th>
                  <th>Excluir</th>
                </tr>
              </thead>
              <tbody>
              <tr style="text-align: center;" v-for="(item, items) in listagem" v-bind:key="items">
                <td>{{item.id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.cpf}}</td>
                <td>{{item.email}}</td>
                <td>
                  <button type="button" class="btn btn-warning" 
                    v-on:click="prepararFormEditar(item.id)"
                  >
                    Alterar
                  </button>
                </td>
                <td>
                  <button type="button" class="btn btn-danger" 
                    v-on:click="deletar(item.id)"
                    >
                    Excluir
                  </button>
                </td>
              </tr>
              </tbody>                
            </table>
          </div>          
        </div>
      </div>

    <div id='formulario' class='format' v-show="!exibirListagemForm">
      <div class='row'>
        <div class='col-sm'>
          <form 
            method="POST" 
            action="/" 
            id="usuarioForm" 
            v-on:submit.prevent="salvar"
          > 

            <div class="form-group">
              <label for="id">Código</label>
              <input type="number" class="form-control" 
                id="id" name="id" 
                disabled="disabled" 
                v-model="registro.id"
              >              
            </div>

            <div class="form-group">
              <label for="name">Nome</label>
              <input type="text"
                required class="form-control" 
                id="name" name="name"
                placeholder="Digite seu nome"
                v-model="registro.name"
              >              
            </div>

            <div class="form-group">
              <label for="cpf">CPF</label>
              <input type="text"  
                required class="form-control" 
                id="cpf" name="cpf"
                placeholder="Digite seu CPF" 
                maxlength="11" 
                v-model="registro.cpf"
              >
              <small id="cpfavl" class="form-text text-muted">
                Não digite a pontuação!
              </small>              
            </div>

            <div class="form-group">
              <label for="email">E-mail</label>
              <input 
                type="email" 
                required
                name="email" 
                class="form-control" 
                id="email" 
                placeholder="Digite seu e-mail" 
                v-model="registro.email"
              >
              <small id="emailavl" class="form-text text-muted">
                Lembre-se de digitar um E-mail válido!
              </small>              
            </div> 

            <div class="form-inline"> 
              <button id='btn-cadastrar' 
                type="submit" 
                class="btn btn-primary mr-sm-2"
              >
                Salvar
              </button>              
              <button 
                id='btn-cancelar-operacao' 
                type="button" 
                class="btn btn-primary"
                v-on:click="cancelarOperacao()"
              >
                Cancelar
              </button>            
            </div>              
          </form>
        </div>
      </div>
    </div>
  </div>       
</template>

<script>
  import validarCpf from 'validar-cpf';
  export default {
    name: 'MasterUsuarios',
    props: {}, 

    //Dados do componente
    data() { 
      return {
        exibirListagemForm: true,
        listagem: null,
        mensagem: "",
        registro: { id: null, name: "", cpf: "", email: ""},
      }
    },

    //Metodos do componente
    methods: {
      /**
       * Método para listar os dados. 
       */
      listarDados() { 
        this.$usuarioService.getTodos().then(response => {
          if(response.erro){
            this.exibirMsgAlert("Ocorreu um erro.","erro");
            console.log("Deu erro!");
          } else {
            this.listagem = response.dados.map(function(objeto) {
              return {
                id: objeto.id,
                name: objeto.name,
                cpf: objeto.cpf,
                email: objeto.email
              }
            }, 
            this.$server);
          }
        }).catch(function() {
          this.exibirMsgAlert("Erro ao listar.","erro");
        });     
      },

      /**
       * Exibir alerta de mensagens.
       * @param {string} msg - Texto da mensagem
       * @param {string} tipo - Tipo de mensagem
       */
      exibirMsgAlert(msg, tipo) {
        let dados = "";
        if (tipo === "sucesso") {
          dados = `
            <div class='alert alert-success' role='alert'>
              <strong>${msg}</strong>
            </div>
          `;
        } else if (tipo === "erro") {
          dados = `
            <div class='alert alert-danger' role='alert'>
              <strong>${msg}</strong>
            </div>
          `;
        }
        this.mensagem = dados;
      }, 

      /**
       * Limpar o texto do alerta de mensagens.
       */
      limparMsgAlert(){
        this.mensagem = "";    
      },

      /**
       * Preparar o formulário de cadastro.
       */
      prepararFormCadastro(){
        this.limparMsgAlert();
        this.exibirListagemForm = false;
      },

      /**
       * Verifica se a operação para salvar será um alteração ou um cadastro, baseado no ID.
       */
      salvar() {      
        if(this.registro.id > 0){
          this.editar(this.registro);
        } else {
          this.cadastrar(this.registro);
        }    
      }, 

      /**
       * Método para cadastrar, faz as validações do CPF e do E-mail.
       * @param {object} registro - Texto da mensagem
       */
      cadastrar(registro) {
        this.limparMsgAlert();      
        if (!validarCpf(registro.cpf)){
          this.exibirMsgAlert("O CPF informado é inválido!", "erro");
          return;        
        } else if (!this.validarEmail(registro.email)){
            this.exibirMsgAlert("O E-Mail informado é inválido!", "erro");
            return;    
        }     
          this.$usuarioService.adicionar(registro).then(response => {          
            if(!this.verificarRetornoHttp(response)){
              this.limparForm();
              this.listarDados();
              this.exibirListagemForm = true;
            }          
        }).catch(function() {
          this.exibirMsgAlert("Erro ao cadastrar!", "erro");        
        })
      },

      /**
       * Validação de E-mail com Regx, a linha comentada é para o interpretador do Vue ler Regx
       * 
       * @param {string} email - E-mail do formulario.
       * @return {boolean} 
       */
      validarEmail(email) {
        //eslint-disable-next-line 
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(email) == false) {           
          return false;
        }
        return true;
      },

      /**
       * Método para verificar o retorno do HTTP, .
       * @param {object} resp - Objeto com a resposta.
       */
      verificarRetornoHttp(resp) {
        if (resp.erro) {
          this.exibirMsgAlert(resp.msg, "erro");
          return true;
        } else {
          if (resp.msg !== null) {
            this.exibirMsgAlert(resp.msg, "sucesso");
            return false;
          }
        }
      },

      /**
       * Método para limpar o Formulário.
       */
      limparForm() {
        let formHtml = document.getElementById("usuarioForm");
        formHtml.reset();
        this.registroFormData = new FormData();
        this.registro = { id: null, name: "", cpf: "", email: ""};
      },

      /**
       * Método para preparar o formulário para edição, baseado no ID
       * @param {int} id - ID do formulário
       */
      prepararFormEditar(id) {
        this.limparMsgAlert();
        this.$usuarioService.getId(id).then(response => {
          if(!this.verificarRetornoHttp(response)){
            this.registro.id = response.dados[0].id;
            this.registro.name = response.dados[0].name;
            this.registro.cpf = response.dados[0].cpf;
            this.registro.email = response.dados[0].email;        
            this.exibirListagemForm = false;
          }
        }).catch(function() {
          this.exibirMsgAlert("Erro ao alterar.","erro");      
        });
      },

      /**
       * Método para cancelar a operaçõe e limpar o formulário
       */
      cancelarOperacao() {
        this.limparForm();
        this.limparMsgAlert();
        this.exibirListagemForm = true;
      },

      /**
       * Método para editar um registro
       * @param {object} registro - Objeto com as informações
       */
      editar(registro){
        this.limparMsgAlert();      
        if (!validarCpf(registro.cpf)) {
          this.exibirMsgAlert("O CPF informado é inválido!", "erro");
          return;        
        } else if (!this.validarEmail(registro.email)) {
          this.exibirMsgAlert("O E-Mail informado é inválido.", "erro");
          return;    
        }     
        this.$usuarioService.editar(registro).then(response => {          
          if (!this.verificarRetornoHttp(response)){
            this.limparForm();
            this.listarDados();
            this.exibirListagemForm = true;
          }          
        }).catch(function() {        
          this.exibirMsgAlert("Erro ao cadastrar!", "erro");        
        })
      },

      /**
       * Método para excluir um usuario baseado no ID
       * @param {int} id - ID do Usuário a ser excluido
       */
      deletar(id) {
        this.$usuarioService.deletar(id).then(response => {
          if(!this.verificarRetornoHttp(response)){        
            const indice = this.listagem.findIndex(item => item.id == id);
            this.listagem.splice(indice, 1);        
            this.exibirListagemForm = true;                    
          }
        }).catch(error => {
          this.exibirMsgAlert("Erro ao excluír.", error);
        })
      }
    },
    mounted() {
      this.listarDados();
    }
  }
</script>
<style scoped>
  align-table {
    text-align: center;  
  };

  .format {
    padding-top :5px;
    padding-bottom :5px;
  };
</style>
