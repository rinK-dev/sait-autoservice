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
