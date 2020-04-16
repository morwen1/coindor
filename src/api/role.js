import request from '@/utils/request'

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

export function getRole(id) {
  return request({
    url: '/role/'+id,
    method: 'get'
  })
}

export function getRoleAll(query) {
  return request({
    url: '/role',
    method: 'get',
    params: query
  })
}
