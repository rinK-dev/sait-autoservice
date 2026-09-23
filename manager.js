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
