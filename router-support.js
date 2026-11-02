// Compatibility catalog only; it does not imply live connectivity.
const ROUTER_TARGETS=[
 ["MikroTik RouterOS 7","RouterOS API / REST","موصل مخطط — لم يُفعّل بعد"],
 ["OpenWrt","ubus / RPC / tc","موصل مخطط — لم يُفعّل بعد"],
 ["TP-Link Omada","Controller API","حسب الطراز وإصدار النظام"],
 ["Huawei","واجهات الشركة المصنّعة","حسب الطراز ومزود الخدمة"],
 ["ZTE","واجهات الشركة المصنّعة","حسب الطراز ومزود الخدمة"],
 ["Ubiquiti UniFi","UniFi Network API","موصل مخطط — لم يُفعّل بعد"],
 ["pfSense","Local API / package","موصل مخطط — لم يُفعّل بعد"],
 ["OPNsense","Local API","موصل مخطط — لم يُفعّل بعد"],
 ["أجهزة عامة","SNMP / UPnP","اكتشاف ومراقبة فقط عند توفرها"]
];
const catalog=document.getElementById("routerCatalog");
if(catalog)catalog.innerHTML=ROUTER_TARGETS.map(([name,method,state])=>'<article class="router-card"><b>'+name+'</b><small>'+method+'</small><span class="adapter-state">'+state+'</span></article>').join("");