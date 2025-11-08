// ---------- Utilidades ----------
function openApp(url){ window.location.href=url; }
function goHome(){ window.location.href='index.html'; }

// ---------- Reloj ----------
function updateClock(){
  const now=new Date();
  const h=now.getHours().toString().padStart(2,'0');
  const m=now.getMinutes().toString().padStart(2,'0');
  document.getElementById("time").textContent=`${h}:${m}`;
  document.getElementById("date").textContent=
    now.toLocaleDateString('es-ES',{weekday:"short",day:"2-digit",month:"short"});
}
setInterval(updateClock,1000);
updateClock();

// ---------- Clima + fondo + color dinámico ----------
function updateWeather(lat,lon){
  fetch(`https://reaper-weather.vercel.app/weather?lat=${lat}&lon=${lon}`)
  .then(r=>r.json())
  .then(data=>{
    const wtemp=document.getElementById("wtemp");
    const wcond=document.getElementById("wcond");
    const wicon=document.getElementById("wicon");
    const bg=document.querySelector("body.desktop");
    const apps=document.querySelectorAll(".app p");
    const taskbar=document.querySelector(".taskbar");
    const status=document.querySelector(".status-bar");

    wtemp.textContent=Math.round(data.temp)+"°C";
    wcond.textContent=data.condition;

    let c1="#0D1A2E", c2="#0D1A2E", text="#fff";
    if (data.condition.includes("soleado")) { c1="#FF4FC3"; c2="#C586FF"; text="#000"; }
    else if (data.condition.includes("nublado")) { c1="#0D1A2E"; c2="#204B8F"; text="#fff"; }
    else if (data.condition.includes("lluvia")) { c1="#05162D"; c2="#0A2A4D"; text="#fff"; }
    else if (data.condition.includes("tormenta")) { c1="#2C2C2C"; c2="#585858"; text="#fff"; }
    else if (data.condition.includes("nieve")) { c1="#A8D8FF"; c2="#E0F7FF"; text="#000"; }

    bg.style.background=`linear-gradient(160deg, ${c1}, ${c2})`;
    bg.style.color=text;
    taskbar.style.color=text;
    status.style.color=text;
    apps.forEach(a=>a.style.color=text);

    const icon=data.icon.includes("sol")?"☀️":
      data.icon.includes("nublado")?"☁️":
      data.icon.includes("lluvia")?"🌧️":
      data.icon.includes("tormenta")?"⛈️":
      data.icon.includes("nieve")?"❄️":"🌤️";
    wicon.src=`https://emojiapi.dev/api/v1/${encodeURIComponent(icon)}/40.png`;
  })
  .catch(e=>console.error("Error clima",e));
}

// Ubicación + refresco
if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(
    pos=>{
      window.currentLat=pos.coords.latitude;
      window.currentLon=pos.coords.longitude;
      updateWeather(pos.coords.latitude,pos.coords.longitude);
    },
    ()=>updateWeather(40.4167,-3.70325)
  );
}else updateWeather(40.4167,-3.70325);

setInterval(()=>{
  if(window.currentLat&&window.currentLon)
    updateWeather(window.currentLat,window.currentLon);
}, 600000);
