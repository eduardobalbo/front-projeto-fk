<template>
  <div>
    <h1>Usuários</h1>
    <div v-for="(item, items) in listagem" v-bind:key="items">
      <div class="card  mb-3" >
        <div class="card-header">
          <strong>Usuário: {{item.id}}</strong>
        </div>
        <div class="card-body">  
          <p class="card-text">Nome: {{item.name}}</p>       
          <p class="card-text">CPF: {{item.cpf}}</p>
          <p class="card-text">Email: {{item.email}}</p>
        </div>
      </div>    
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {    
  },

  data(){
    return {
      listagem : null
    }
  },
  methods: {
    /**
    * Método para listar os dados. 
    */
    listarDados(){
      this.$usuarioService.getTodos().then(response => {
        if(response.erro){
          this.exibirMsgAlert("Erro ao alterar.","erro");          
        } else {
          this.listagem = response.dados.map(function(objeto){
            return { id: objeto.id, name: objeto.name,cpf: objeto.cpf,email: objeto.email}
          }, this.$server);
        }
      }).catch( function(){
      this.exibirMsgAlert("Erro ao alterar.","erro");      
    });    
  }
},
  mounted(){
      this.listarDados();
    }
  }
</script>

<style scoped>
</style>
