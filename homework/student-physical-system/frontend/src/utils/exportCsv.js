const studentHeaders = [
  ['stuNo', '学号'],
  ['stuName', '姓名'],
  ['gender', '性别'],
  ['age', '年龄'],
  ['className', '班级'],
  ['height', '身高(cm)'],
  ['weight', '体重(kg)'],
  ['score', '体测成绩']
]

export function exportStudentsCsv(records, filename = 'students.csv') {
  const rows = [
    studentHeaders.map(([, title]) => title),
    ...records.map((record) => studentHeaders.map(([key]) => record[key] ?? ''))
  ]
  const csv = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCsvCell(value) {
  const text = String(value)
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}
