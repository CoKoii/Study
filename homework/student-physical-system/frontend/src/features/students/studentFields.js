export const genderOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' }
]

export const studentFields = [
  { key: 'stuNo', label: '学号', input: 'text', placeholder: '请输入学号' },
  { key: 'stuName', label: '姓名', input: 'text', placeholder: '请输入姓名' },
  { key: 'gender', label: '性别', input: 'select', options: genderOptions },
  { key: 'age', label: '年龄', input: 'number', min: 1 },
  { key: 'className', label: '班级', input: 'text', placeholder: '请输入班级' },
  { key: 'height', label: '身高(cm)', input: 'number', min: 1, step: 0.1 },
  { key: 'weight', label: '体重(kg)', input: 'number', min: 1, step: 0.1 },
  { key: 'score', label: '体测成绩', input: 'number', min: 0, step: 0.1 }
]

export function createDefaultStudent() {
  return {
    stuNo: '',
    stuName: '',
    gender: '男',
    age: 18,
    className: '',
    height: 170,
    weight: 60,
    score: 80
  }
}

export function resetStudentForm(target) {
  Object.assign(target, createDefaultStudent())
}
