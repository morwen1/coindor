import request from '@/utils/request'
/*
export function createRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/'+id,
    method: 'delete'
  })
}
*/
export function updateMenuUsers(data) {
  return request({
    url: '/menu-users',
    method: 'put',
    data
  })
}
export function getMenuUsers(id) {
  return request({
    url: '/menu-users/'+id,
    method: 'get'
  })
}

export function getMenuUsersAll(query) {
  return request({
    url: '/menu-users',
    method: 'get',
    params: query
  })
}

/* Menu Role */
export function updateMenuRole(data) {
  return request({
    url: '/menu-role',
    method: 'put',
    data
  })
}
export function getMenuRole(id) {
  return request({
    url: '/menu-role/'+id,
    method: 'get'
  })
}



/* Menu General */
export function updateMenuGeneral(data) {
  return request({
    url: '/menu-general',
    method: 'put',
    data
  })
}
export function getMenuGeneral(id) {
  return request({
    url: '/menu-general/'+id,
    method: 'get'
  })
}

export function getMenuGeneralAll() {
  return request({
    url: '/menu-general',
    method: 'get'
  })
}
