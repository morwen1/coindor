import request from '@/utils/request'

export function create(data, url) {
  return request({
    url: '/'+url,
    method: 'post',
    data
  })
}

export function update(data, url, id) {
  return request({
    url: '/'+url+'/'+id,
    method: 'put',
    data
  })
}

export function get(id, url) {
  return request({
    url: '/'+url+'/'+id,
    method: 'get'
  })
}

export function getAll(query, url) {
  return request({
    url: '/'+url,
    method: 'get',
    params: query
  })
}

export function getAllID(query, url, id) {
  return request({
    url: '/'+url+'/'+id,
    method: 'get',
    params: query
  })
}

export function borrar(id, url) {
  return request({
    url: '/'+url+'/'+id,
    method: 'delete'
  })
}
