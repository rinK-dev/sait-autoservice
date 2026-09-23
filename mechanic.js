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
    let d=await api("/mechanic/clients");
    clients.innerHTML=d.clients.map(c=>`<div class="card"><h2>${c.name}</h2><p>${c.email}</p>${c.cars.map(x=>`<div class="history"><b>${x.brand} ${x.model}</b><br>Номер: ${x.plate_number}<br>Пробег: ${x.mileage} км<br><button class="primary" onclick="addWork(${x.id},'${(x.brand+" "+x.model).replace(/'/g,"\\'")}')">Добавить работу</button></div>`).join("")}</div>`).join("")
}
function addWork(id, name) {
    form.innerHTML=`<p>${name}</p><div class="field"><label>Дата</label><input id="date" type="date" value="${new Date().toISOString().slice(0,10)}"></div><div class="field"><label>Пробег</label><input id="mileage" type="number"></div><div class="field"><label>Работа</label><input id="title" placeholder="Замена масла"></div><div class="field"><label>Заменённые детали</label><input id="parts"></div><div class="field"><label>Комментарий</label><textarea id="description"></textarea></div><button class="primary" onclick="saveWork(${id})">Сохранить</button>`;
    modal.classList.remove("hidden")
}
async function saveWork(id) {
    try {
        await api("/mechanic/service-records", {
            method:"POST", body:JSON.stringify( {
                car_id:id, date:date.value, mileage:+mileage.value, title:title.value, parts:parts.value, description:description.value
            })
        });
        modal.classList.add("hidden");
        load();
        alert("Сохранено")
    } catch(e) {
        alert(e.message)
    }
}
function logout() {
    localStorage.removeItem("token");
    location.href="login.html"
}
load();
