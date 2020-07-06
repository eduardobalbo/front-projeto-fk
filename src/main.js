//Importando bibliotecas do Vue
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

//Importando componentes
import Home from './components/home/Home.vue'
import MasterUsuarios from './components/usuarios/MasterUsuarios.vue'

//Importando o Bootstrap
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

//Importando servicos
import UsuarioService from './service/UsuarioService';
import {ConfigClass} from './classes/ConfigClass';

//Passando um caminho para o Server
let server = `${ConfigClass.getUrlApi().toString()}`;

//Propriedade Prototype, gera as atribuições aos objetos instanciados
Vue.prototype.$usuarioService = UsuarioService;
Vue.prototype.$server = server;

//Criando as rotas com o Vue Router
Vue.use(VueRouter);
Vue.config.productionTip = false

const routes = 
[
  {
    name: 'Usuarios',
    path: '/users',
    component: MasterUsuarios
  }, 
  {
    name: 'Home',
    path: '/home',
    component: Home
  }
]

//Passando as rotas ao VueRouter
const router = new VueRouter({ mode: 'history', routes: routes });

//Renderizando com o Vue
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
