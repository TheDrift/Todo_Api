const $but_sign = document.querySelector('.but_sign')
const $title = document.querySelector('.title')
const $content = document.querySelector('.content')
const $date = document.querySelector('.date')
const $btn_submit = document.querySelector('.btn_submit')
const $todo_card = document.querySelector('.todo_card')
const base_url = 'https://todo-itacademy.herokuapp.com/api'
const accessToken = localStorage.getItem('accessToken')

window.addEventListener('DOMContentLoaded' , () =>{
  getCards()
})
function getCards(){
  fetch(`${base_url}/todos` , {
    method:"GET",
    headers:{
      'Content-type' : 'application/json' ,
      'Authorization' : `Bearer ${accessToken}`
    }
  })
  .then(r => r.json())
  .then(r =>{
    const card = r.todos 
    const res = card.map(t => cardtemplate(t)).join('')
    $todo_card.innerHTML = res
  })
}
function cardtemplate({title, content, date, id, completed, edited}){
  return `
    <div class="card">
      <div class="card-header">
        <h1>${title}</h1>
        ${completed ? `<img src="https://emojio.ru/images/apple-b/2705.png" style="width: 25px; height: 25px; margin-top: 5px; margin-left: 15px">` : ''}
      </div>
      <div class="card-body">
        <p>${content}</p>
      </div>
      <span class="time">
            ${date} 
            ${edited.state ? `<span class="small">Edited. ${edited.date}</span>` : ''}
      </span>
      <div class="card-footer">
        <button class="complete" onclick="completed('${id}')">Сделано</button>
        <button class="edit" onclick="edit('${id}')">Изменить</button>
        <button class="delete" onclick="deleteCard('${id}')">Удалить</button>
      </div>
    </div>
  `
}
function createCards(title, content, date){
  $btn_submit.disabled = true
  fetch(`${base_url}/todos/create` , {
    method:"POST" ,
    headers: {
      'Content-type':'application/json',
      'Authorization':`Bearer ${accessToken}`
    },
    body: JSON.stringify({
      title,
      content, 
      date,
    })
  })
    .then(() => {getCards()})
    .finally(() => $btn_submit.disabled = false)
}
function oneCard(id){
  return fetch(`${base_url}/todos/${id}`, {
    method: 'GET',
    headers: {
      'Content-type':'application/json',
      'Authorization':`Bearer ${accessToken}`
    }
  })
    .then(res => res.json())
}
function completed(id){
  fetch(`${base_url}/todos/${id}/completed`, {
    method: 'GET', 
    headers: {
      'Content-type':'application/json',
      'Authorization':`Bearer ${accessToken}`
    }
  })
    .then(getCards)
}
function deleteCard(id){
  fetch(`${base_url}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-type':'application/json',
      'Authorization':`Bearer ${accessToken}`
    }
  })
    .then(getCards)
}
function edit(id){
  oneCard(id)
  .then(res => {
    const askTitle = prompt('New title', res.title)
    const askContent = prompt('New content', res.content)

    fetch(`${base_url}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type':'application/json',
        'Authorization':`Bearer ${accessToken}`
      },
      body: JSON.stringify({
        title: askTitle || res.title,
        content: askContent || res.content
      })
    })
      .then(getCards)
  })
}
$btn_submit.addEventListener('click' , e =>{
  e.preventDefault()
  $btn_submit.disabled = true
  createCards($title.value, $content.value, $date.value)
})
$but_sign.addEventListener('click' , e =>{
  e.preventDefault()

  const refreshToken = localStorage.getItem('refreshToken')

  $but_sign.disabled = true
  $but_sign.classList.add('disabled')

  fetch(`${base_url}/logout`, {
    method: 'POST',
    headers: {
      'Content-type':'application/json'
    },
    body:JSON.stringify({refreshToken})
  })
    .then(res => res.json())
    .then(() => {
      localStorage.clear()
      window.open('./login.html', '_self')
    })
    .finally(() => {
      $but_sign.disabled = false
      $but_sign.classList.remove('disabled')
    })
})