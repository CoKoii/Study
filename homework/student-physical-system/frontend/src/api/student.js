import http from './http'

export function fetchStudents(params) {
  return http.get('/students', { params })
}

export function fetchStudent(stuNo) {
  return http.get(`/students/${stuNo}`)
}

export function createStudent(payload) {
  return http.post('/students', payload)
}

export function updateStudent(stuNo, payload) {
  return http.put(`/students/${stuNo}`, payload)
}

export function deleteStudent(stuNo) {
  return http.delete(`/students/${stuNo}`)
}
