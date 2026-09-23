const API="http://localhost:8080/api", token=localStorage.token;
if(!token)location.href="login.html";
async function load() {
    let r=await fetch(API+"/client/dashboard", {
        headers: {
            Authorization:"Bearer "+token
        }
    }), d=await r.json();
    if(!r.ok)return alert(d.error);
    name.textContent=d.name;
    cars.innerHTML=d.cars.map(c=>`<div class="card"><h2>${c.brand} ${c.model}</h2><p>${c.plate_number} · ${c.year} · ${c.mileage} км</p>${c.history.map(x=>`<div class="history green"><b>${x.title}</b><p>${x.description||""}</p><small>${x.date} · ${x.mileage} км</small><p>🔧 ${x.parts||"Детали не указаны"}</p></div>`).join("")||"<p>История пуста</p>"}</div>`).join("")
}
function logout() {
    localStorage.removeItem("token");
    location.href="login.html"
}
load();
