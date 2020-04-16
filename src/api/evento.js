import request from '@/utils/request'

export function createEvent(data) {
  return request({
    url: '/evento',
    method: 'post',
    data
  })
}

export function updateEvent(data) {
  return request({
    url: '/evento',
    method: 'put',
    data
  })
}

export function getEvent(id) {
  return request({
    url: '/evento/'+id,
    method: 'get'
  })
}

export function getEventAll(query) {
  return request({
    url: '/evento',
    method: 'get',
    params: query
  })
}
