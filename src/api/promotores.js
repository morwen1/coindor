import request from '@/utils/request'

export function createPromotor(data) {
  return request({
    url: '/promotores',
    method: 'post',
    data
  })
}

export function updatePromotor(data) {
  return request({
    url: '/promotores',
    method: 'put',
    data
  })
}

export function getPromotor(id) {
  return request({
    url: '/promotores/'+id,
    method: 'get'
  })
}

export function getPromotorAll(query) {
  return request({
    url: '/promotores',
    method: 'get',
    params: query
  })
}
export function getPromotorEvent(id) {
  return request({
    url: '/promotoreseventadmin/'+id,
    method: 'get'
  })
}