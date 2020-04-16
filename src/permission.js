import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // Determine si ha habido token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // Si la página actual es el tablero de instrumentos, no se disparará después de cada enganche, así que manejelo manualmente
    } else {
      if (store.getters.roles.length === 0) { // Determine si el usuario actual ha extraído la información de user_info
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const roles = res.data.roles // note: El contexto debe ser una matriz, como por ejemplo: ['editor', 'desarrollar']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // Generar tablas de enrutamiento accesibles basadas en roles
            router.addRoutes(store.getters.addRouters) // Agregue dinámicamente tablas de enrutamiento accesibles
            next({ ...to, replace: true }) // El método de hack asegura que addRoutes esté completo, establezca replace: true para que la navegación no deje un registro de historial
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Error de verificación, vuelva a iniciar sesión')
            next({ path: '/' })
          })
        })
      } else {
        // console.log('No se que cosa roles lenght')
        // No hay necesidad de cambiar dinámicamente los permisos directamente () eliminar el siguiente juicio de permiso ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // En la lista blanca de acceso gratuito, ve directamente
      next()
    } else {
      next('/login') // De lo contrario, todos redirigen a la página de inicio de sesión
      NProgress.done() // Si la página actual es de inicio de sesión no se activará después de cada enlace, por lo tanto, acézcalo manualmente
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
