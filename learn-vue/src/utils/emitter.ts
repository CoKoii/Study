import mitt from 'mitt'
const emitter = mitt()

emitter.on('test1', () => {
  console.log('test1被调用了')
})
emitter.on('test2', () => {
  console.log('test2被调用了')
})
setTimeout(() => {
  emitter.emit('test1')
  emitter.emit('test2')
}, 2000)
export default emitter
