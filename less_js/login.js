const $email = document.querySelector('.email_input')
const $password = document.querySelector('.password_input')
const $btn_submit = document.querySelector('.btn_submit')
const $a_ref = document.querySelector('.href_p')
const Base_url = 'https://todo-itacademy.herokuapp.com/api'
function Register(){
  fetch(`${Base_url}/login`, {
    method:'POST',
    body: JSON.stringify({
      email:$email.value ,
      password:$password.value
    }),
    headers:{
      'Content-type' : 'application/json'
    }
  })
  .then(res => res.json())
  .then(res =>{
    localStorage.setItem('accessToken' , res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    localStorage.setItem('isActivated', res.user.isActivated)
    localStorage.setItem('Id_u', res.user.id)
    window.open('./about.html' , '_self')
  })
}
$btn_submit.addEventListener('click' , e =>{
  e.preventDefault()
  Register()
})
$a_ref.addEventListener('click', e =>{
  e.preventDefault()
  window.open('./register.html' , '_self')
})