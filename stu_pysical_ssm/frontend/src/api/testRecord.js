import http from './http'

export function fetchTestRecords(params) {
    return http.get('/test-records', { params })
}

export function createTestRecord(data) {
    return http.post('/test-records', data)
}

export function updateTestRecord(data) {
    return http.put('/test-records', data)
}

export function deleteTestRecord(stuNo, term) {
    return http.delete('/test-records', { params: { stuNo, term } })
}