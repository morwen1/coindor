import request from '@/utils/request'

export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users',
    method: 'put',
    data
  })
}

export function getUser(id) {
  return request({
    url: '/users/'+id,
    method: 'get'
  })
}

export function getUserAll(query) {
  return request({
    url: '/users',
    method: 'get',
    params: query
  })
}
