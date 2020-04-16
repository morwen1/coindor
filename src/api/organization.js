import request from '@/utils/request'

export function createOrganization(data) {
  return request({
    url: '/organization',
    method: 'post',
    data
  })
}

export function deleteOrganization(id) {
  return request({
    url: '/organization/'+id,
    method: 'delete'
  })
}

export function getOrganization(id) {
  return request({
    url: '/organization/'+id,
    method: 'get'
  })
}

export function getOrganizationAll(query) {
  return request({
    url: '/organization',
    method: 'get',
    params: query
  })
}

export function getUserOrganization() {
  return request({
    url: '/organizationuser/',
    method: 'get'
  })
}

export function getUserAllOrganization(id) {
  return request({
    url: '/organizationuserall/'+id,
    method: 'get'
  })
}