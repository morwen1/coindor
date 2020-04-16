import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/users',
    component: Layout,
    redirect: '/users/list',
    name: 'users',
    meta: {
      title: 'Trabajadores',
      icon: 'peoples',
      roles: ['Administrador']
    },
    children: [
      { path: 'create', component: () => import('@/views/users/create'), name: 'Crear Trabajador', meta: { title: 'Crear Trabajador', icon: 'edit',  roles: ['Administrador']  }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/users/edit'), name: 'Editar Trabajador', meta: { title: 'Editar Trabajador', noCache: true,  roles: ['Administrador']  }, hidden: true },
      { path: 'list', component: () => import('@/views/users/list'), name: 'Trabajadores', meta: { title: 'Usuarios', icon: 'list',  roles: ['Administrador'] }},
    
    ]
  },
  {
    path: '/perfil',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/users/editUser'), 
        name: 'users',
        meta: { title: 'Perfil', icon: 'users' }
      }
    ]
  },
  {
    path: '/tax',
    component: Layout,
    redirect: '/tax/list',
    name: 'Tasas',
    meta: {
      title: 'Tasas',
      icon: 'chart',
      roles: ['Administrador']
    },
    children: [
      { path: 'create', component: () => import('@/views/tax/create'), name: 'Crear Tasa', meta: { title: 'Crear Tasas', icon: 'edit',  roles: ['Administrador']  }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/tax/edit'), name: 'Editar Tasa', meta: { title: 'Editar Tasas', noCache: true,  roles: ['Administrador']  }, hidden: true },
      { path: 'list', component: () => import('@/views/tax/list'), name: 'Tasas', meta: { title: 'Tasas', icon: 'list',  roles: ['Administrador'] }},
    ]
  },
  {
    path: '/client',
    component: Layout,
    redirect: '/client/list',
    name: 'client',
    meta: {
      title: 'Clientes',
      icon: 'people',
      roles: ['Administrador','Trabajador','Verificador de Depositos'],
    },
    children: [
      { path: 'create', component: () => import('@/views/client/create'), name: 'Crear Clientes', meta: { title: 'Crear Clientes', icon: 'edit',  roles: ['Administrador','Trabajador','Verificador de Depositos']  }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/client/edit'), name: 'Editar Clientes', meta: { title: 'Editar Clientes', noCache: true,  roles: ['Administrador','Trabajador','Verificador de Depositos']     }, hidden: true },
      { path: 'list', component: () => import('@/views/client/list'), name: 'Clientes', meta: { title: 'Clientes', icon: 'list',  roles: ['Administrador','Trabajador','Verificador de Depositos']  }},
    ]
  },
  {
    path: '/affiliates',
    component: Layout,
    redirect: '/affiliates/list',
    name: 'affiliates',
    hidden: true,
    meta: {
      title: 'Afiliados',
      icon: 'people',
      roles: ['Administrador','Trabajador','Verificador de Depositos'],
    },
    children: [
      { path: 'create', component: () => import('@/views/affiliates/create'), name: 'Crear Afiliados', meta: { title: 'Crear Afiliados', icon: 'edit',  roles: ['Administrador','Trabajador','Verificador de Depositos']  }, hidden: true},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/affiliates/edit'), name: 'Editar Afiliados', meta: { title: 'Editar Afiliados', noCache: true,  roles: ['Administrador','Trabajador','Verificador de Depositos']     }, hidden: true },
      { path: 'list/:id(\\d+)', component: () => import('@/views/affiliates/list'), name: 'Afiliados', meta: { title: 'Afiliados', icon: 'list',  noCache: true, roles: ['Administrador','Trabajador','Verificador de Depositos']  }, hidden: true},
    ]
  },
  {
    path: '/transferencia',
    component: Layout,
    redirect: '/transferencia/list',
    name: 'Transferencias',
    meta: {
      title: 'Transferencia',
      icon: 'component',
      roles: ['Administrador','Trabajador','Gestor','Visualizador de Transferencia','Comisionista','Verificador de Depositos'],
    },
    children: [
      { path: 'create', component: () => import('@/views/transferencia/create'), name: 'Crear Transferencia', meta: { title: 'Crear Transferencias',  roles: ['Administrador','Trabajador','Verificador de Depositos'] , noCache: true } },
      { path: 'edit/:id(\\d+)', component: () => import('@/views/transferencia/edit'), name: 'Editar Transferencia', meta: { title: 'Editar Transferencia',  roles: ['Administrador'] , noCache: true }, hidden: true },
      { path: 'ver/:id(\\d+)', component: () => import('@/views/transferencia/ver'), name: 'Ver Transferencia', meta: { title: 'Ver Transferencia',  roles: ['Administrador','Trabajador','Gestor','Visualizador de Transferencia', 'Comisionista','Verificador de Depositos'] , noCache: true }, hidden: true },
      { path: 'list', component: () => import('@/views/transferencia/list'), name: 'Transferencias', meta: {  title: 'Transferencias', icon: 'component' ,  roles: ['Administrador','Trabajador','Gestor','Visualizador de Transferencia', 'Comisionista','Verificador de Depositos'] }}
    ]
  },
  {
    path: '/bank',
    component: Layout,
    redirect: '/bank/list',
    name: 'Bancos',
    meta: {
      title: 'Bancos',
      icon: 'international',
      roles: ['Administrador']
    },
    children: [
      { path: 'create', component: () => import('@/views/bank/create'), name: 'Crear Bancos', meta: { title: 'Crear Bancos', icon: 'edit',  roles: ['Administrador']  }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/bank/edit'), name: 'Editar Bancos', meta: { title: 'Editar Bancos', noCache: true,  roles: ['Administrador']  }, hidden: true },
      { path: 'operation/:id(\\d+)', component: () => import('@/views/bank/operation'), name: 'Operación Bancaria', meta: { title: 'Operación Bancaria', noCache: true,  roles: ['Administrador']  }, hidden: true },
      { path: 'list', component: () => import('@/views/bank/list'), name: 'Bancos', meta: { title: 'Bancos', icon: 'list',  roles: ['Administrador'] }},
      { path: 'detail/:id(\\d+)', component: () => import('@/views/bank/detail'), name: 'Operaciones de Banco', meta: { title: 'Operaciones', noCache: true,  roles: ['Administrador']  }, hidden: true }
    ]
  },
    {
    path: '/deposit',
    component: Layout,
    redirect: '/deposit/list',
    name: 'Depositos',
    meta: {
      title: 'Depositos',
      icon: 'documentation',
      roles: ['Administrador','Verificador de Depositos']
    },
    children: [
      { path: 'create', component: () => import('@/views/deposit/create'), name: 'Registrar Deposito', meta: { title: 'Registrar Deposito', icon: 'edit',  roles: ['Administrador','Verificador de Depositos']  }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/deposit/edit'), name: 'Editar Deposito', meta: { title: 'Editar Deposito', noCache: true,  roles: ['Administrador','Verificador de Depositos']  }, hidden: true },
      { path: 'list', component: () => import('@/views/deposit/list'), name: 'Deposito', meta: { title: 'Depositos', icon: 'list',  roles: ['Administrador','Verificador de Depositos'] }},
      { path: 'masivo', component: () => import('@/views/deposit/masivo'), name: 'Carga Masiva', meta: { title: 'Carga Masiva', icon: 'list',  roles: ['Administrador','Verificador de Depositos'] }},
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: 'noredirect',
    name: 'report',
    meta: {
      title: 'Reportes',
      icon: 'excel',
      roles: ['Administrador','Trabajador','Verificador de Depositos','Visualizador de Transferencia']
    },
    children: [
      { path: 'Bancos', component: () => import('@/views/report/bankList'), name: 'Reportes de Bancos', meta: { title: 'Reportes de Bancos', roles: ['Administrador','Visualizador de Transferencia'], noCache: true }},
      { path: 'Dia', component: () => import('@/views/report/diaList'), name: 'Reporte Diario', meta: { title: 'Reporte Diario', roles: ['Administrador'], noCache: true }},
      { path: 'Gestor', component: () => import('@/views/report/gestorList'), name: 'Reportes de Gestor', meta: { title: 'Reportes de Gestor', roles: ['Administrador'], noCache: true }},
      { path: 'Trabajador', component: () => import('@/views/report/trabajadorList'), name: 'Reportes de Trabajador', meta: { title: 'Reportes de Trabajador', roles: ['Administrador'], noCache: true }},
      { path: 'Comisionista', component: () => import('@/views/report/comisionistaList'), name: 'Reportes de Comisionista', meta: { title: 'Reportes de Comisionista', roles: ['Administrador'], noCache: true }},
	    { path: 'trabajadoruser', component: () => import('@/views/report/trabajadoruser'), name: 'Reporte Personal', meta: { title: 'Reporte Personal', icon: 'excel', roles: ['Visualizador de Transferencia','Trabajador','Verificador de Depositos']}},
	    { path: 'gestordetail/:id(\\d+)', component: () => import('@/views/report/gestorListdetail'), name: 'Gestor Detalle', meta: { title: 'Gestor Detalle', noCache: true, roles: ['Administrador'] }, hidden: true },
	    { path: 'trabajadordetail/:id(\\d+)', component: () => import('@/views/report/trabajadorListdetail'), name: 'Trabajador Detalle', meta: { title: 'Trabajador Detalle', roles: ['Visualizador de Transferencia','Trabajador','Verificador de Depositos','Administrador'] }, hidden: true }
   ]
  },
    {
    path: '/retirement',
    component: Layout,
    redirect: '/retirement/list',
    name: 'Retiros',
    meta: {
      title: 'Retiros',
      icon: 'clipboard',
      roles: ['Administrador']
    },
    hidden:true,
    children: [
      { path: 'create', component: () => import('@/views/retirement/create'), name: 'Generar Retiro', meta: { title: 'Generar Retiro', icon: 'edit' }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/retirement/edit'), name: 'Editar Retiro', meta: { title: 'Editar Retiro', noCache: true   }, hidden: true },
      { path: 'list', component: () => import('@/views/retirement/list'), name: 'Retiros', meta: { title: 'Retiros', icon: 'list'}},
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
