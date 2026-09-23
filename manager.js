const API="http://localhost:8080/api", token=localStorage.token;
if(!token)location.href="login.html";
async function api(p, o= {
}) {
    o.headers= {
        ...(o.headers|| {
        }), Authorization:"Bearer "+token, "Content-Type":"application/json"
    };
    let r=await fetch(API+p, o), d=await r.json();
    if(!r.ok)throw Error(d.error||"Ошибка");
    return d
}
async function load() {
    try {
        let d=await api("/manager/mechanics");
        list.innerHTML=d.users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td class="role">${u.role}</td><td>${u.active?"Активен":"Заблокирован"}</td><td>${u.role==="manager"?"":`<button class="danger" onclick="toggle(${u.id})">${u.active?"Заблокировать":"Разблокировать"}</button>`}</td></tr>`).join("")
    } catch(e) {
        msg.innerHTML='<p class="error">'+e.message+"</p>"
    }
}
async function invite() {
    let email=prompt("Gmail механика");
    if(!email)return;
    let name=prompt("Имя");
    if(!name)return;
    try {
        let d=await api("/manager/invitations", {
            method:"POST", body:JSON.stringify( {
                email, name
            })
        });
        alert("Ссылка приглашения:\n"+d.invite_url);
        load()
    } catch(e) {
        alert(e.message)
    }
}
async function toggle(id) {
    try {
        await api("/manager/mechanics/"+id+"/toggle", {
            method:"POST"
        });
        load()
    } catch(e) {
        alert(e.message)
    }
}
function logout() {
    localStorage.removeItem("token");
    location.href="login.html"
}
load();

// замена строки внутри load():
list.innerHTML = d.users.map((u,i) => `<tr style="--i:${i}"><td>${u.name}</td><td>${u.email}</td><td class="role">${u.role}</td><td><span class="status ${u.active?'active':'blocked'}">${u.active?'Активен':'Заблокирован'}</span></td><td>${u.role==="manager"?"":`<button class="danger" onclick="toggle(${u.id})">${u.active?"Заблокировать":"Разблокировать"}</button>`}</td></tr>`).join("");

// простая система тостов — добавить один раз в файл
function toast(text, type = 'success') {
    let box = document.querySelector('.toast-container');
    if (!box) { box = document.createElement('div'); box.className = 'toast-container'; document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = text;
    box.appendChild(t);
    setTimeout(() => { t.classList.add('leaving'); setTimeout(() => t.remove(), 200); }, 2600);
}

// в invite(): заменить alert("Ссылка приглашения:\n"+d.invite_url) на:
navigator.clipboard?.writeText(d.invite_url);
toast('Ссылка приглашения скопирована в буфер');

// в catch(e) заменить alert(e.message) на toast(e.message, 'error')