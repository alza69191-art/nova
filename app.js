const KEY="netpilot-users-v1";
let users=load(),editing=null;
const $=id=>document.getElementById(id);
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
function persist(){localStorage.setItem(KEY,JSON.stringify(users));render()}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 $("totalUsers").textContent=users.length;
 $("activeUsers").textContent=users.filter(u=>u.enabled).length;
 $("allocated").innerHTML=users.reduce((n,u)=>n+Number(u.down||0),0).toFixed(1)+' <em>Mbps</em>';
 const q=$("search").value.trim().toLowerCase();
 const shown=users.filter(u=>(u.name+" "+u.ip+" "+u.mac).toLowerCase().includes(q));
 $("usersTable").innerHTML=shown.map(u=>`<tr><td><span class="user-name">${esc(u.name)}</span><span class="sub">مستخدم شبكة</span></td><td dir="ltr">${esc(u.ip||"—")}<span class="sub">${esc(u.mac||"")}</span></td><td>${Number(u.down).toLocaleString()}</td><td>${Number(u.up).toLocaleString()}</td><td>${Number(u.quota)||"بلا حد"}</td><td><span class="status ${u.enabled?"":"off"}">${u.enabled?"مسموح":"موقوف محلياً"}</span></td><td><div class="row-actions"><button class="mini" data-edit="${u.id}">تعديل</button><button class="mini" data-toggle="${u.id}">${u.enabled?"إيقاف":"تفعيل"}</button><button class="mini" data-delete="${u.id}">حذف</button></div></td></tr>`).join("");
 $("empty").style.display=shown.length?"none":"block";
 const max=Math.max(1,...users.map(u=>Number(u.down)||0));
 $("distribution").innerHTML=users.length?users.map(u=>`<div class="dist-row"><span>${esc(u.name)}</span><div class="bar"><i style="width:${Math.max(2,(Number(u.down)||0)/max*100)}%"></i></div><b dir="ltr">${Number(u.down)||0} Mbps</b></div>`).join(""):'<span class="sub">أضف مستخدمين لعرض التوزيع.</span>';
}
function openForm(user=null){
 editing=user?.id??null;$("dialogTitle").textContent=user?"تعديل المستخدم":"إضافة مستخدم";
 $("name").value=user?.name||"";$("ip").value=user?.ip||"";$("mac").value=user?.mac||"";
 $("down").value=user?.down??10;$("up").value=user?.up??2;$("quota").value=user?.quota??0;$("enabled").checked=user?.enabled??true;
 $("userDialog").showModal();
}
function save(e){e.preventDefault();const name=$("name").value.trim();if(!name)return;
 const item={id:editing||crypto.randomUUID(),name,ip:$("ip").value.trim(),mac:$("mac").value.trim(),down:Math.max(0,Number($("down").value)),up:Math.max(0,Number($("up").value)),quota:Math.max(0,Number($("quota").value)),enabled:$("enabled").checked};
 if(editing)users=users.map(u=>u.id===editing?item:u);else users.push(item);
 $("userDialog").close();persist();
}
$("addTop").onclick=()=>openForm();$("userForm").addEventListener("submit",save);$("search").addEventListener("input",render);
$("usersTable").addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;const id=b.dataset.edit||b.dataset.toggle||b.dataset.delete;const u=users.find(x=>x.id===id);if(!u)return;
 if(b.dataset.edit)openForm(u);
 if(b.dataset.toggle){u.enabled=!u.enabled;persist()}
 if(b.dataset.delete&&confirm("حذف هذا المستخدم من السجل المحلي؟")){users=users.filter(x=>x.id!==id);persist()}
});
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({app:"NetPilot",version:1,users},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="netpilot-backup.json";a.click();URL.revokeObjectURL(a.href)};
$("importBtn").onclick=()=>$("importFile").click();
$("importFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d.users))throw Error();if(confirm("استبدال المستخدمين الحاليين بالنسخة المستوردة؟")){users=d.users;persist()}}catch{alert("ملف النسخة الاحتياطية غير صالح.")}e.target.value=""};
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
