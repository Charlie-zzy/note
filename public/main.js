const key = location.pathname.split('/').at(-2)
const save = document.getElementById('save')
let data = null,
  handler = null

// 暗色模式支持
let preset = localStorage.getItem('color')
if (!preset) matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'
document.body.className = preset
function toggleDarkmode() {
  preset = preset === 'light' ? 'dark' : 'light'
  document.body.className = preset
  localStorage.setItem('color', preset)
}

// textarea Tab 键支持
const handleTabKey = (evt) => {
  if (evt.key !== 'Tab') return

  evt.preventDefault()
  const start = this.selectionStart,
    end = this.selectionEnd
  if (start === end) {
    document.execCommand('insertText', false, '  ')
  } else {
    const strBefore = this.value.slice(0, start)
    const curLineStart = strBefore.includes('\n')
      ? strBefore.lastIndexOf('\n') + 1
      : 0
    const strBetween = this.value.slice(curLineStart, end + 1)

    this.setSelectionRange(curLineStart, end)
    document.execCommand(
      'insertText',
      false,
      '  ' + strBetween.replace(/\n/g, '\n  ')
    )
    this.setSelectionRange(
      start + 2,
      end + (strBetween.split('\n').length + 1) * 2
    )
  }
}

function update() {
  fetch(`/api/note/edit`, {
    method: 'PUT',
    body: JSON.stringify({ key, data }),
    headers: { 'Content-Type': 'application/json' },
  }).then(() => {
    save.className = 'saved'
    clearTimeout(handler)
    handler = setTimeout(() => {
      if (save.className == 'saved') save.className = ''
    }, 1500)
  })
}

fetch(`/api/note/get?key=${key}`)
  .then(async (e) => {
    const res = await e.json()
    const ok = e.ok && res.ok
    return { ok, data: (ok ? '' : '[错误] ') + res.data }
  })
  .then((e) => {
    const textarea = document.getElementById('note')
    if (e.ok) textarea.disabled = false
    textarea.value = e.data
    console.log('qwq~')

    let handle = null
    textarea.oninput = () => {
      data = textarea.value
      clearTimeout(handle)
      save.className = 'saving'
      handle = setTimeout(() => {
        console.log('qwq.')
        update()
      }, 600)
    }

    textarea.onkeydown = handleTabKey
  })

// 退出时自动保存
onbeforeunload = () => {
  console.log('qwq?')
  if (data) {
    console.log('qwq!')
    update()
  }
}
