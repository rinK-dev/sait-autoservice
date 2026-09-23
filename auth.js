const API="http://localhost:8080/api";
const q=new URLSearchParams(location.search);
if(location.pathname.endsWith("register.html")) {
    email.value=q.get("email")||"";
    if(!q.get("token"))msg.innerHTML='<p class="error">Нет токена приглашения.</p>'
}
async function req(p, o) {
    const r=await fetch(API+p, o);
    const d=await r.json();
    if(!r.ok)throw Error(d.error||"Ошибка");
    return d
}
async function register(e) {
    e.preventDefault();
    if(password.value!==password2.value)return msg.innerHTML='<p class="error">Пароли не совпадают.</p>';
    try {
        await req("/auth/register", {
            method:"POST", headers: {
                "Content-Type":"application/json"
            }, body:JSON.stringify( {
                token:q.get("token"), email:email.value, name:name.value, password:password.value
            })
        });
        msg.innerHTML='<p class="success">Аккаунт создан. Войдите в систему.</p>';
        setTimeout(()=>location.href="login.html", 800)
    } catch(x) {
        msg.innerHTML='<p class="error">'+x.message+"</p>"
    }
}
async function login(e) {
    e.preventDefault();
    try {
        const d=await req("/auth/login", {
            method:"POST", headers: {
                "Content-Type":"application/json"
            }, body:JSON.stringify( {
                email:email.value, password:password.value
            })
        });
        localStorage.token=d.token;
        location.href=d.role==="manager"?"manager.html":d.role==="mechanic"?"mechanic.html":"client.html"
    } catch(x) {
        msg.innerHTML='<p class="error">'+x.message+"</p>"
    }
}

// добавить возле остальных функций в auth.js

// показать/скрыть пароль — кладём вызов рядом с остальной инициализацией страницы
document.querySelectorAll('.field input[type="password"]').forEach(input => {
    input.parentElement.classList.add('has-toggle');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pw-toggle';
    btn.textContent = '👁';
    btn.onclick = () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? '👁' : '🙈';
    };
    input.insertAdjacentElement('afterend', btn);
});

function setLoading(btn, on) {
    if (on) {
        btn.dataset.label = btn.textContent;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Загрузка…';
    } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.label;
    }
}

// в register(e): в начале try { const btn=e.target.querySelector('button'); setLoading(btn,true);
// в конце finally { setLoading(btn,false) }  — аналогично в login(e)

// при ошибке — тряхнуть форму
function shakeBox() {
    const box = document.querySelector('.box');
    box.classList.remove('shake');
    void box.offsetWidth; // restart animation
    box.classList.add('shake');
}
// вызывать shakeBox() в catch(x) рядом с выводом msg.innerHTML