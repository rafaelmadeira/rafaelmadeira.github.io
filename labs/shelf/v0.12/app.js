(function(){
"use strict";
var KEY="shelf-everyday-v011", DB="shelf-v011-files";
var TOOLS=[
  {id:"home",name:"Home",icon:"house"},
  {id:"journal",name:"Journal",icon:"book-open"},
  {id:"calendar",name:"Calendar",icon:"calendar"},
  {id:"planner",name:"Planner",icon:"clipboard"},
  {id:"notebooks",name:"Notebooks",icon:"notebook"},
  {id:"library",name:"Library",icon:"library"}
];
var ICONS={
 house:'<path d="m3 10 9-7 9 7v11H3z"/><path d="M9 21v-7h6v7"/>',
 book:'<path d="M4 4h7a3 3 0 0 1 3 3v14H7a3 3 0 0 0-3 0zM14 7a3 3 0 0 1 3-3h7v17h-7a3 3 0 0 0-3 0"/>',
 'book-open':'<path d="M3 5h7a4 4 0 0 1 4 4v12H7a4 4 0 0 0-4 0zM14 9a4 4 0 0 1 4-4h3v16h-3a4 4 0 0 0-4 0"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18"/>',
 clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4a3 3 0 0 1 6 0M9 12h6M9 16h5"/>',
 notebook:'<path d="M7 3h14v18H7zM3 7h4M3 12h4M3 17h4M11 8h6M11 12h4"/>',
 library:'<path d="M4 3v18M10 3v18M15 6l4-1 3 15-4 1zM2 21h21"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
 inbox:'<path d="M4 4h16l2 15H2zM2 14h6l2 3h4l2-3h6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 star:'<path d="m12 2 3 7 7 1-5 5 1.2 7L12 18.5 5.8 22 7 15l-5-5 7-1z"/>',
 starfill:'<path d="m12 2 3 7 7 1-5 5 1.2 7L12 18.5 5.8 22 7 15l-5-5 7-1z" fill="currentColor"/>',
 folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3z"/>',
 note:'<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>',
 image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m3 17 6-5 4 3 3-4 5 6"/>',
 video:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
 file:'<path d="M6 2h8l5 5v15H6zM14 2v6h5M9 13h7M9 17h6"/>',
 link:'<path d="m10 14-1 1a5 5 0 0 1-7-7l3-3a5 5 0 0 1 7 0M14 10l1-1a5 5 0 0 1 7 7l-3 3a5 5 0 0 1-7 0M8 16l8-8"/>',
 layers:'<path d="m12 2 10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5"/>',
 check:'<path d="m5 12 4 4 10-10"/>',
 square:'<rect x="4" y="4" width="16" height="16" rx="3"/>',
 'check-circle':'<circle cx="12" cy="12" r="9"/><path d="m7 12 3.5 3.5L17 9"/>',
 'chevron-left':'<path d="m15 5-7 7 7 7"/>',
 'chevron-right':'<path d="m9 5 7 7-7 7"/>',
 arrow:'<path d="M19 12H5m7-7-7 7 7 7"/>',
 more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 x:'<path d="M5 5 19 19M19 5 5 19"/>',
 bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 9H3c0-1 3-2 3-9M10 21h4"/>',
 hash:'<path d="M10 3 7 21M17 3l-3 18M4 9h16M3 16h16"/>',
 archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v12h14V9M10 13h4"/>',
 trash:'<path d="M4 7h16M10 3h4M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
 download:'<path d="M12 3v14m-5-5 5 5 5-5M4 18v3h16v-3"/>',
 upload:'<path d="M12 17V3m-5 5 5-5 5 5M4 17v4h16v-4"/>',
 attach:'<path d="m8 12 6-6a4 4 0 0 1 6 6l-8 8a6 6 0 0 1-9-9l8-8"/>',
 'external-link':'<path d="M14 3h7v7M10 14 21 3M19 13v7H4V5h7"/>',
 'calendar-days':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v5M16 3v5M3 11h18M8 15h3M14 15h3"/>',
 'list-todo':'<rect x="3" y="4" width="5" height="5" rx="1"/><path d="M5 6.5 6 7.5 8 5M11 6h10M3 15h5v5H3zM11 17h10"/>',
 'map-pin':'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 filter:'<path d="M3 4h18l-7 8v8l-4-2v-6z"/>',
 pen:'<path d="M3 21l5-1 12-12-4-4L4 16zM14 6l4 4"/>',
 repeat:'<path d="M4 8a7 7 0 0 1 13-2l3 3M20 4v5h-5M20 16a7 7 0 0 1-13 2l-3-3M4 20v-5h5"/>',
 sparkle:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
 'corner-down-right':'<path d="M4 4v10a4 4 0 0 0 4 4h12m-5-5 5 5-5 5"/>',
 bookmark:'<path d="M5 3h14v19l-7-4-7 4z"/>',
 'dots-vertical':'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>'
};
function ic(n,size){return '<svg xmlns="http://www.w3.org/2000/svg" width="'+(size||17)+'" height="'+(size||17)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[n]||ICONS.note)+'</svg>'}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function safeUrl(v){try{var u=new URL(String(v));return ["http:","https:"].includes(u.protocol)?u.href:""}catch(e){return ""}}
function hostname(v){try{return new URL(v).hostname.replace(/^www\./,"")}catch(e){return ""}}
function ndate(d){var x=new Date(d);return new Date(x.getTime()-x.getTimezoneOffset()*60000).toISOString().slice(0,10)}
function today(){return ndate(new Date())}
function offsetDay(k,n){var d=new Date((k||today())+"T12:00:00");d.setDate(d.getDate()+n);return ndate(d)}
function monthKey(k){return (k||today()).slice(0,7)}
function monthStep(k,n){var d=new Date(k+"-15T12:00:00");d.setMonth(d.getMonth()+n);return ndate(d).slice(0,7)}
function humanDay(k,opts){if(!k)return "";var d=new Date(k+"T12:00:00");return d.toLocaleDateString("en-US",opts||{weekday:"short",month:"short",day:"numeric"})}
function humanTime(t){return t||""}
function uid(){return (typeof crypto!=="undefined"&&crypto.randomUUID)?crypto.randomUUID():"s"+Date.now().toString(36)+Math.random().toString(36).slice(2)}
function now(){return Date.now()}
function stripHtml(raw){var d=document.createElement("div");d.innerHTML=String(raw||"");return d.textContent||""}
function plain(v){return String(v||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim()}
function trim(v,n){return String(v||"").slice(0,n||180)}
function ent(type,title,extra){return Object.assign({
 id:uid(),type:type,title:title||"",body:"",html:"",createdAt:now(),updatedAt:now(),contextIds:[],
 notebookId:null,folderId:null,sourceId:null,starred:false,pinned:false,archived:false,trashed:false,
 date:"",time:"",endTime:"",dueDate:"",location:"",completed:false,projectStatus:"active",
 url:"",resourceKind:"link",blobId:null,fileName:"",mime:"",fileSize:0,tags:[],color:"default",demo:false
},extra||{})}
function seed(){
 var d=today(),tomorrow=offsetDay(d,1),yesterday=offsetDay(d,-1);
 var project=ent("project","Alpine Park HOA",{body:"Example project context. Add a task, note, or resource here and find it again in its own tool.",starred:true,demo:true});
 var visit=ent("event","Oftalmologista · exemplo",{date:tomorrow,time:"14:00",location:"Consultório (exemplo)",body:"A calendar event with its own supporting information.",demo:true});
 var t1=ent("task","Revisar homepage",{contextIds:[project.id],dueDate:d,demo:true});
 var t2=ent("task","Separar exames anteriores",{contextIds:[visit.id],dueDate:tomorrow,demo:true});
 var t3=ent("task","Anotar perguntas para a consulta",{contextIds:[visit.id],dueDate:tomorrow,demo:true});
 var t4=ent("task","Revisar referências de design",{dueDate:"",demo:true});
 var notebook1=ent("notebook","Ideas",{demo:true});
 var notebook2=ent("notebook","Recipes",{demo:true});
 var n1=ent("note","Perguntas para o médico",{html:"<p>Quero conversar sobre mudanças no grau e perguntar quando seria indicado repetir os exames.</p>",contextIds:[visit.id],demo:true});
 var n2=ent("note","Notas do projeto",{html:"<p>Este é um exemplo de anotação ligada ao projeto. Ela também aparece em <b>Notebooks → All notes</b>.</p>",contextIds:[project.id],demo:true});
 var n3=ent("note","Organização como consequência do uso",{html:"<p>O sistema deve ficar organizado porque foi utilizado, não porque alguém teve tempo de configurá-lo.</p>",notebookId:notebook1.id,starred:true,demo:true});
 var n4=ent("note","Receita de panquecas",{html:"<p><b>Ingredientes:</b> farinha, leite, ovos.</p><p><b>Preparo:</b> misturar e dourar em frigideira.</p>",notebookId:notebook2.id,demo:true});
 var r1=ent("resource","Documentação WordPress",{url:"https://wordpress.org/documentation/",resourceKind:"link",contextIds:[project.id],body:"Referência pública de demonstração",demo:true});
 var r2=ent("resource","Exame anterior.pdf",{resourceKind:"document",fileName:"Exame anterior.pdf",contextIds:[visit.id],body:"Arquivo ilustrativo. Anexe seu próprio PDF para testar um arquivo real.",demo:true});
 var r3=ent("resource","MDN Web Docs",{url:"https://developer.mozilla.org/en-US/",resourceKind:"link",starred:true,demo:true});
 var journal=ent("journal","",{date:yesterday,html:"<p>Um registro de exemplo para demonstrar como o diário funciona.</p><p>As notas adicionadas a esta entrada também podem ser encontradas em Notebooks.</p>",demo:true});
 return {version:11,entities:[project,visit,t1,t2,t3,t4,notebook1,notebook2,n1,n2,n3,n4,r1,r2,r3,journal],
 ui:{tool:"home",view:"today",selectedDate:d,month:monthKey(d),focusId:null,detailId:null,lastTool:"home",lastView:"today",recent:[project.id,visit.id],search:""},demo:true}
}
var state;
try{state=JSON.parse(localStorage.getItem(KEY)||"null");if(!state||!Array.isArray(state.entities))state=seed()}catch(e){state=seed()}
state.ui=state.ui||seed().ui;
var $=function(id){return document.getElementById(id)};
var rail=$("toolrail"),sidebar=$("sidebar"),workspace=$("workspace"),modalRoot=$("modal-root"),toastEl=$("toast");
var activeComposer="auto",composerFor=null,composerText="",modalState=null,uploadContext=null,mediaUrls=[],toastTimer=null;
var lastToolView=null,workingSearch="";
function get(id){return state.entities.find(function(x){return x.id===id})}
function list(type,includeHidden){return state.entities.filter(function(x){return (!type||x.type===type)&&(includeHidden||(!x.archived&&!x.trashed))})}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast("Cannot save: browser storage may be full. Export a backup.")}}
function touched(e){if(!e)return;e.updatedAt=now();save()}
function isDemo(e){return !!e.demo}
function rels(e){return state.entities.filter(function(x){return !x.trashed&&!x.archived&&x.contextIds&&x.contextIds.includes(e.id)})}
function sources(e){return (e.contextIds||[]).map(get).filter(function(x){return x&&!x.trashed&&!x.archived})}
function meaningfulContext(e){return sources(e).length>0}
function count(type){return list(type).length}
function toast(s){toastEl.textContent=s;toastEl.classList.add("open");clearTimeout(toastTimer);toastTimer=setTimeout(function(){toastEl.classList.remove("open")},2800)}
function typeIcon(e){if(!e)return "layers";if(e.type==="resource")return e.resourceKind==="image"?"image":e.resourceKind==="video"?"video":e.resourceKind==="link"?"link":"file";return {event:"calendar",task:"check-circle",note:"note",project:"clipboard",journal:"book-open",notebook:"notebook",folder:"folder"}[e.type]||"layers"}
function typeName(type){return {event:"Event",task:"Task",note:"Note",resource:"Resource",project:"Project",journal:"Journal entry",notebook:"Notebook",folder:"Folder"}[type]||"Item"}
function objTitle(e){return e.title|| (e.type==="journal"?humanDay(e.date):e.fileName||hostname(e.url)||"Untitled")}
function outOfDate(e){return !!(e.dueDate&&!e.completed&&e.dueDate<today())}
function contextName(e){var p=sources(e);return p.length?p.map(function(x){return objTitle(x)}).join(" · "):""}
function isFocusValid(){var f=get(state.ui.focusId);return f&&!f.trashed&&!f.archived?f:null}
function prettyMonth(k){return new Date(k+"-15T12:00:00").toLocaleDateString("en-US",{month:"long",year:"numeric"})}
function byRecent(a,b){return b.updatedAt-a.updatedAt}
function byDue(a,b){return (a.dueDate||"9999").localeCompare(b.dueDate||"9999")||a.createdAt-b.createdAt}
function addRecent(id){if(!id)return;state.ui.recent=[id].concat((state.ui.recent||[]).filter(function(x){return x!==id})).slice(0,12)}
function buttonIcon(name){return ic(name,17)}
function getAllSearchable(){return list().filter(function(x){return x.type!=="folder"&&x.type!=="notebook"})}
function searchMatch(e,q){q=(q||"").toLowerCase().trim();if(!q)return true;var txt=[e.title,e.body,stripHtml(e.html),e.url,e.fileName,contextName(e),(e.tags||[]).join(" ")].join(" ").toLowerCase();return q.split(/\s+/).every(function(w){return txt.includes(w)})}
function renderRail(){
 rail.innerHTML='<button class="rail-logo" data-act="navigate" data-tool="home" data-view="today" aria-label="Shelf Home" title="Shelf">'+ic("layers",23)+'</button>'+
 TOOLS.map(function(t){return '<button class="rail-item'+(state.ui.tool===t.id?" active":"")+'" data-act="tool" data-tool="'+t.id+'" title="'+t.name+'" aria-label="'+t.name+'">'+ic(t.icon,21)+'<span>'+t.name+'</span></button>'}).join("")+
 '<span class="rail-spacer"></span><button class="rail-footer-btn" data-act="search" title="Search everything" aria-label="Search">'+ic("search",18)+'</button>';
}
function sr(label,view,icon,opts){opts=opts||{};var sel=state.ui.view===view&&state.ui.tool===(opts.tool||state.ui.tool);return '<button class="sb-row'+(sel?" active":"")+(opts.sub?" sb-sub":"")+'" data-act="navigate" data-tool="'+esc(opts.tool||state.ui.tool)+'" data-view="'+esc(view)+'"><span class="sb-ico">'+ic(icon,16)+'</span><span class="label">'+esc(label)+'</span>'+(opts.count==null?"":'<span class="sb-num">'+opts.count+'</span>')+'</button>'}
function sh(label,createType){return '<div class="sb-section-heading"><span>'+esc(label)+'</span>'+(createType?'<button data-act="create" data-type="'+createType+'" title="New '+createType+'">'+ic("plus",14)+'</button>':"")+'</div>'}
function miniCalendar(){
 var key=state.ui.month||monthKey(today()),year=+key.slice(0,4),m=+key.slice(5,7)-1;
 var first=new Date(year,m,1),start=first.getDay(),days=new Date(year,m+1,0).getDate();
 var entries=list("event");var html='<div class="mini-calendar"><div class="mini-head"><button data-act="month-prev" title="Previous month">'+ic("chevron-left",14)+'</button><span>'+esc(prettyMonth(key))+'</span><button data-act="month-next" title="Next month">'+ic("chevron-right",14)+'</button></div><div class="mini-grid">';
 ["S","M","T","W","T","F","S"].forEach(function(x){html+='<span class="mini-week">'+x+'</span>'});
 for(var i=0;i<42;i++){var x=i-start+1,date=ndate(new Date(year,m,x,12)),valid=x>=1&&x<=days,events=entries.some(function(e){return e.date===date});
  html+='<button class="'+(!valid?"muted ":"")+(date===today()?"today ":"")+(date===state.ui.selectedDate?"selected ":"")+(events?"has-event":"")+'" data-act="date" data-date="'+date+'" title="'+esc(humanDay(date))+'">'+new Date(date+"T12:00:00").getDate()+'</button>';
 }
 return html+'</div></div>'
}
function renderSidebar(){
 var t=state.ui.tool,html='<div class="sb-head"><h2>'+esc((TOOLS.find(function(x){return x.id===t})||TOOLS[0]).name)+'</h2><button data-act="create-primary" title="New in '+esc(t)+'">'+ic("plus",18)+'</button></div><div class="sb-scroll">';
 if(t==="home"){
  html+=sr("Today","today","sun")+sr("Inbox","inbox","inbox",{count:list("task").filter(function(x){return !x.dueDate&&!x.completed}).length})+sr("Recent","recent","clock")+sr("Starred","starred","star");
  html+=sh("Working on");
  var recent=(state.ui.recent||[]).map(get).filter(function(e){return e&&!e.archived&&!e.trashed}).slice(0,6);
  html+=recent.map(function(e){return '<button class="sb-row" data-act="open" data-id="'+e.id+'"><span class="sb-ico">'+ic(typeIcon(e),16)+'</span><span class="label">'+esc(objTitle(e))+'</span></button>'}).join("")||'<div class="sidebar-empty">Open anything to see it here</div>';
 }
 if(t==="journal"){
  html+=sr("Today's entry","today","sun")+sr("Timeline","timeline","clock");
  html+=sh("Recent months");
  var byMonth={};list("journal").forEach(function(e){var k=monthKey(e.date);byMonth[k]=(byMonth[k]||0)+1});
  html+=Object.keys(byMonth).sort().reverse().map(function(k){return sr(prettyMonth(k),"month:"+k,"book-open",{count:byMonth[k]})}).join("")||'<div class="sidebar-empty">No entries yet</div>';
 }
 if(t==="calendar"){
  html+=miniCalendar();
  html+=sr("Month view","month","calendar")+sr("Upcoming","upcoming","clock");
  html+=sh("Calendars");
  html+=sr("My calendar","all","calendar-days",{count:list("event").length});
 }
 if(t==="planner"){
  var tasks=list("task");
  html+=sr("Today","today","sun",{count:tasks.filter(function(x){return !x.completed&&x.dueDate&&x.dueDate<=today()}).length});
  html+=sr("Inbox","inbox","inbox",{count:tasks.filter(function(x){return !x.completed&&!x.dueDate}).length});
  html+=sr("Upcoming","upcoming","calendar-days")+sr("Completed","completed","check");
  html+=sh("Projects","project");
  html+=list("project").sort(byRecent).map(function(p){return '<button class="sb-row" data-act="open" data-id="'+p.id+'"><span class="sb-ico">'+ic("folder",16)+'</span><span class="label">'+esc(objTitle(p))+'</span><span class="sb-num">'+rels(p).filter(function(e){return e.type==="task"&&!e.completed}).length+'</span></button>'}).join("")||'<div class="sidebar-empty">No projects yet</div>';
 }
 if(t==="notebooks"){
  html+=sr("All notes","all","note",{count:list("note").length})+sr("Starred","starred","star");
  html+=sh("From other tools");
  html+=sr("From Calendar","from-events","calendar-days",{count:list("note").filter(function(e){return sources(e).some(function(x){return x.type==="event"})}).length});
  html+=sr("From Planner","from-projects","clipboard",{count:list("note").filter(function(e){return sources(e).some(function(x){return x.type==="project"||x.type==="task"})}).length});
  html+=sr("From Journal","from-journal","book-open",{count:list("note").filter(function(e){return sources(e).some(function(x){return x.type==="journal"})}).length});
  html+=sh("My notebooks","notebook");
  html+=list("notebook").sort(byRecent).map(function(n){return sr(objTitle(n),"book:"+n.id,"notebook",{count:list("note").filter(function(x){return x.notebookId===n.id}).length})}).join("")||'<div class="sidebar-empty">No notebooks yet</div>';
 }
 if(t==="library"){
  var rs=list("resource"),folders=list("folder");
  html+=sr("All items","all","library",{count:rs.length})+sr("Unsorted","unsorted","inbox",{count:rs.filter(function(x){return !x.folderId&&!meaningfulContext(x)}).length})+sr("Starred","starred","star");
  html+=sh("Folders","folder");
  html+=folders.map(function(f){return sr(objTitle(f),"folder:"+f.id,"folder",{count:rs.filter(function(r){return r.folderId===f.id}).length})}).join("")||'<div class="sidebar-empty">No folders yet</div>';
  html+=sh("Collections");
  html+=sr("From Calendar","from-events","calendar-days")+sr("From Planner","from-projects","clipboard");
  html+=sh("By type");
  ["Links","Documents","Images","Videos","Other"].forEach(function(k){var map={Links:["link","article","social","book","movie","comic","music","podcast"],Documents:["document"],Images:["image"],Videos:["video"],Other:["other"]};html+=sr(k,"kind:"+k.toLowerCase(),({Links:"link",Documents:"file",Images:"image",Videos:"video",Other:"folder"})[k],{count:rs.filter(function(r){return map[k].includes(r.resourceKind)}).length})});
 }
 html+='</div><div class="sb-foot"><button class="sb-row" data-act="navigate" data-tool="library" data-view="archive"><span class="sb-ico">'+ic("archive",16)+'</span><span class="label">Archive</span></button><button class="sb-row" data-act="navigate" data-tool="library" data-view="trash"><span class="sb-ico">'+ic("trash",16)+'</span><span class="label">Trash</span></button><small><span>SHELF · v0.11</span><span><button data-act="export">Export</button> · <button data-act="import">Import</button></span></small></div>';
 sidebar.innerHTML=html;
}
function topbar(){
 var focus=isFocusValid();
 return '<div class="topbar"><button class="search-trigger" data-act="search" title="Search everything">'+ic("search",18)+'<span>Search anything…</span><small class="kbd">/</small></button><div class="topbar-spacer"></div>'+
 (focus?'<div class="context-pill" title="New items can be linked to this context">'+ic("layers",13)+'<span class="context-name">'+esc(objTitle(focus))+'</span><button data-act="clear-focus" title="Stop using this context">'+ic("x",13)+'</button></div>':"")+
 '<button class="top-new" data-act="new-menu">'+ic("plus",16)+' New</button><span class="top-avatar" title="Local prototype">'+ic("layers",16)+'</span></div>'
}
function pageHeader(title,subtitle,actions,eyebrow){return '<div class="page-header"><div><div class="page-eyebrow">'+esc(eyebrow||"SHELF")+'</div><h1>'+esc(title)+'</h1>'+(subtitle?'<p>'+esc(subtitle)+'</p>':"")+'</div><div class="page-head-actions">'+(actions||"")+'</div></div>'}
function btn(label,action,iconName,type){return '<button class="button'+(type==="primary"?" primary":type==="subtle"?" subtle":"")+'" data-act="'+esc(action)+'">'+(iconName?ic(iconName,15):"")+esc(label)+'</button>'}
function empty(iconName,title,subtitle,action,type){return '<div class="empty"><div class="empty-icon">'+ic(iconName,27)+'</div><h3>'+esc(title)+'</h3><p>'+esc(subtitle)+'</p>'+(action?'<button class="button" data-act="create" data-type="'+esc(type)+'">'+ic("plus",14)+' '+esc(action)+'</button>':"")+'</div>'}
function shortContext(e){var names=sources(e).map(function(x){return objTitle(x)});return names.length?names.slice(0,2).join(" · "):""}
function taskRow(e){return '<div class="task-row'+(e.completed?" done":"")+'"><button class="task-check'+(e.completed?" checked":"")+'" data-act="toggle-task" data-id="'+e.id+'" title="'+(e.completed?"Mark incomplete":"Complete task")+'" aria-label="'+(e.completed?"Mark incomplete":"Complete task")+'">'+(e.completed?ic("check",13):"")+'</button><button class="item-open" data-act="open" data-id="'+e.id+'"><div class="row-title">'+esc(objTitle(e))+'</div><div class="row-sub">'+esc(shortContext(e)|| (e.dueDate?humanDay(e.dueDate):"No due date"))+'</div></button>'+(outOfDate(e)?'<span class="row-right" style="color:#bb7266">Overdue</span>':"")+'</div>'}
function eventRow(e){return '<div class="event-row"><span class="row-time">'+esc(e.time||"All day")+'</span><div class="row-icon">'+ic("calendar",16)+'</div><button class="item-open" data-act="open" data-id="'+e.id+'"><div class="row-title">'+esc(objTitle(e))+'</div><div class="row-sub">'+esc(e.location||humanDay(e.date))+'</div></button><span class="row-right">'+rels(e).length?rels(e).length+" related":""+'</span></div>'}
function noteRow(e){return '<div class="note-row"><span class="row-icon">'+ic("note",16)+'</span><button class="item-open" data-act="open" data-id="'+e.id+'"><div class="row-title">'+esc(objTitle(e))+'</div><div class="row-sub">'+esc(shortContext(e)||trim(stripHtml(e.html)||e.body,100))+'</div></button></div>'}
function resourceRow(e){return '<div class="file-row"><span class="row-icon">'+ic(typeIcon(e),16)+'</span><button class="item-open" data-act="open" data-id="'+e.id+'"><div class="row-title">'+esc(objTitle(e))+'</div><div class="row-sub">'+esc(shortContext(e)||hostname(e.url)||e.fileName||"Saved resource")+'</div></button>'+(e.blobId?'<button class="icon-button" data-act="download-resource" data-id="'+e.id+'" title="Download file">'+ic("download",15)+'</button>':"")+'</div>'}
function contextRow(e){return '<div class="context-row"><span class="row-icon">'+ic(typeIcon(e),17)+'</span><button class="item-open" data-act="open" data-id="'+e.id+'"><div class="row-title">'+esc(objTitle(e))+'</div><div class="row-sub">'+esc(typeName(e.type))+' · '+esc((rels(e).length||0)+" related items")+'</div></button></div>'}
function rows(list,fn){return '<div class="rows">'+list.map(fn).join("")+'</div>'}
function panel(title,body,extra){return '<div class="panel"><div class="panel-head"><h3>'+esc(title)+'</h3>'+(extra||"")+'</div>'+body+'</div>'}
function section(title,children,count){return '<div class="section-head"><h2>'+esc(title)+'</h2>'+(count!=null?'<span class="section-count">'+count+'</span>':"")+'<span class="section-rule"></span></div>'+children}
function entityCard(e){
 var color=e.color==="blue"?"#f1f7fa":e.color==="yellow"?"#fff9e9":e.color==="pink"?"#fff3f3":"#fff";
 var desc=e.type==="note"?stripHtml(e.html||e.body):e.body||e.location||hostname(e.url)||"";
 var content='<div class="card-top">'+ic(typeIcon(e),17)+'<span style="font-size:10px">'+esc(typeName(e.type))+'</span></div><div class="card-title">'+esc(objTitle(e))+'</div>'+(desc?'<div class="card-excerpt">'+esc(trim(desc,190))+'</div>':"")+'<div class="card-footer">'+ic("clock",12)+'<span>'+esc(shortContext(e)||humanDay(e.date||e.dueDate||ndate(e.updatedAt)))+'</span></div>';
 return '<article class="item-card" style="--card-bg:'+color+'"><button class="card-open" data-act="open" data-id="'+e.id+'">'+content+'</button>'+(e.starred?'<span style="position:absolute;top:10px;right:10px;color:#c3a563">'+ic("starfill",14)+'</span>':"")+'</article>'
}
function resourceCard(e){
 var kind=e.resourceKind,thumb='<div class="resource-preview '+(kind==="image"?"image":kind==="video"?"video":"")+'">'+
 (kind==="image"&&e.blobId?'<img data-preview="'+esc(e.blobId)+'" alt="">':kind==="image"&&safeUrl(e.url)?'<img src="'+esc(e.url)+'" alt="">':ic(typeIcon(e),44))+
 (e.url?'<span class="resource-domain">'+esc(hostname(e.url))+'</span>':"")+'</div>';
 return '<article class="item-card"><button class="card-open" data-act="open" data-id="'+e.id+'" style="padding:0;min-height:0">'+thumb+'<div class="resource-body"><div class="card-title">'+esc(objTitle(e))+'</div><div class="card-footer" style="margin-top:4px">'+ic(typeIcon(e),12)+'<span>'+esc(shortContext(e)||hostname(e.url)||e.fileName||kind)+'</span></div></div></button></article>'
}
function contextBreadcrumb(e){var p=sources(e);return p.map(function(x){return '<button data-act="open" data-id="'+x.id+'">'+esc(objTitle(x))+'</button>'}).join(' <span style="color:#acb7ba"> / </span> ')}
function renderHome(){
 var view=state.ui.view,tasks=list("task"),events=list("event");
 if(view==="inbox"){var inbox=tasks.filter(function(e){return !e.completed&&!e.dueDate});return pageHeader("Inbox","Tasks without a scheduled date.",'<button class="button primary" data-act="create" data-type="task">'+ic("plus",15)+' New task</button>',"HOME")+ (inbox.length?rows(inbox,taskRow):empty("inbox","Your inbox is clear","New tasks without a date will appear here."))}
 if(view==="recent"){var all=(state.ui.recent||[]).map(get).filter(function(e){return e&&!e.trashed&&!e.archived});return pageHeader("Recently opened","Jump back into the things you've been working on.","","HOME")+(all.length?rows(all,contextRow):empty("clock","Nothing opened yet","Open an event, note, or project to see it here."))}
 if(view==="starred"){var stars=list().filter(function(e){return e.starred});return pageHeader("Starred","Things you keep close.","","HOME")+(stars.length?'<div class="card-grid">'+stars.map(entityCard).join("")+'</div>':empty("star","Nothing starred yet","Star items from their detail pages."))}
 var d=today(),due=tasks.filter(function(e){return !e.completed&&e.dueDate&&e.dueDate<=d}).sort(byDue);
 var todaysEvents=events.filter(function(e){return e.date===d}).sort(function(a,b){return a.time.localeCompare(b.time)});
 var upcoming=events.filter(function(e){return e.date>d}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time)}).slice(0,3);
 var active=(state.ui.recent||[]).map(get).filter(function(e){return e&&["project","event","notebook","journal"].includes(e.type)&&!e.trashed}).slice(0,4);
 var j=list("journal").find(function(x){return x.date===d});
 return pageHeader("Today",humanDay(d,{weekday:"long",month:"long",day:"numeric",year:"numeric"}),'<button class="button primary" data-act="new-menu">'+ic("plus",15)+' Capture</button>',"YOUR DAY")+
 '<div class="hero"><div><h2>Everything in its place.</h2><p>Open anything, add what belongs to it, and let Shelf keep things connected.</p></div><div class="hero-illustration">'+ic("layers",53)+'</div></div>'+
 '<div class="dashboard-grid"><div>'+
 panel("Your tasks",due.length?due.map(taskRow).join(""):empty("check-circle","Nothing due today","Tasks with a due date appear here."),'<button class="panel-link" data-act="navigate" data-tool="planner" data-view="today">Open planner</button>')+
 panel("Schedule",todaysEvents.length?todaysEvents.map(eventRow).join(""):(upcoming.length?'<div style="font-size:11px;color:#9ba5a8;margin-bottom:8px">No events today · Coming up</div>'+upcoming.map(eventRow).join(""):empty("calendar","Nothing scheduled","Create an event from Calendar.")),'<button class="panel-link" data-act="navigate" data-tool="calendar" data-view="month">Open calendar</button>')+
 '</div><div>'+
 panel("Continue where you left off",active.length?active.map(contextRow).join(""):empty("clock","Start anywhere","Recent things appear automatically."))+
 panel("Journal",j?'<div class="card-excerpt" style="margin-bottom:13px">'+esc(trim(stripHtml(j.html),170))+'</div>':'<p style="color:#96a2a5;font-size:12px;margin:0 0 12px">A page for today is ready when you are.</p>','<button class="panel-link" data-act="journal-today">'+(j?"Continue writing":"Write today")+'</button>')+
 panel("Quick capture",'<div class="inline-add"><span style="color:#93a0a4">'+ic("plus",16)+'</span><input id="home-capture" placeholder="Write, paste a link, or add a task…" aria-label="Quick capture"><button data-act="home-capture">Save</button></div><div class="capture-tip">Use “todo: ” to capture a task.</div>')+'</div></div>';
}
function renderJournal(){
 var entries=list("journal").sort(function(a,b){return b.date.localeCompare(a.date)}),view=state.ui.view,d=today();
 if(view==="today"){var j=entries.find(function(x){return x.date===d});return pageHeader("Today's journal",humanDay(d,{weekday:"long",month:"long",day:"numeric"}),"","JOURNAL")+
 (j?'<div style="max-width:830px">'+rows([j],noteRow)+'</div><div style="margin-top:15px"><button class="button primary" data-act="open" data-id="'+j.id+'">'+ic("pen",15)+' Continue writing</button></div>':
 '<div class="panel" style="max-width:660px;padding:28px"><div style="font-size:16px;font-weight:700;margin-bottom:8px">A page for today.</div><p style="color:#929ea1;margin-bottom:20px">Write about your day without setting up a notebook, template or database.</p><button class="button primary" data-act="journal-today">'+ic("pen",16)+' Start writing</button></div>')}
 if(view.startsWith("month:"))entries=entries.filter(function(x){return monthKey(x.date)===view.slice(6)});
 return pageHeader(view==="timeline"?"Journal timeline":prettyMonth(view.slice(6)),"Your days, collected automatically.",'<button class="button" data-act="journal-today">'+ic("pen",15)+" Today's entry</button>","JOURNAL")+
 (entries.length?entries.map(function(e){return '<article class="journal-entry"><div class="entry-date">'+esc(humanDay(e.date,{weekday:"long",month:"long",day:"numeric",year:"numeric"}))+'</div><h3>'+esc(e.title||"Journal entry")+'</h3><p>'+esc(trim(stripHtml(e.html),260))+'</p><button class="panel-link" data-act="open" data-id="'+e.id+'" style="margin-top:10px">Open entry '+ic("chevron-right",12)+'</button></article>'}).join(""):empty("book-open","No entries here yet","Your journal entries are organized by date, automatically."))}
function calendarMonthHtml(key){
 var y=+key.slice(0,4),m=+key.slice(5,7)-1,first=new Date(y,m,1),start=first.getDay(),days=new Date(y,m+1,0).getDate(),events=list("event");
 var html='<div class="calendar-wrap"><div class="cal-head"><h2>'+esc(prettyMonth(key))+'</h2><div class="cal-nav"><button data-act="month-prev" aria-label="Previous month">'+ic("chevron-left",17)+'</button><button data-act="month-next" aria-label="Next month">'+ic("chevron-right",17)+'</button></div><button class="button" data-act="calendar-today">Today</button></div><div class="calendar-grid">';
 ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(function(n){html+='<div class="weekday">'+n+'</div>'});
 var total=Math.ceil((start+days)/7)*7;
 for(var i=0;i<total;i++){var x=i-start+1,date=ndate(new Date(y,m,x,12)),valid=x>=1&&x<=days,es=events.filter(function(e){return e.date===date}).sort(function(a,b){return a.time.localeCompare(b.time)});
  html+='<div class="cal-cell'+(!valid?" outside":"")+(date===state.ui.selectedDate?" selected":"")+'"><button class="day-button'+(date===today()?" today":"")+'" data-act="date" data-date="'+date+'">'+new Date(date+"T12:00:00").getDate()+'</button>'+
  es.slice(0,3).map(function(e){return '<button class="cal-event" data-act="open" data-id="'+e.id+'" title="'+esc(objTitle(e))+'">'+esc((e.time?e.time.slice(0,5)+" ":"")+objTitle(e))+'</button>'}).join("")+(es.length>3?'<span class="cal-more">+'+(es.length-3)+" more</span>":"")+'</div>';
 }
 return html+'</div></div>'
}
function renderCalendar(){
 var view=state.ui.view,events=list("event").sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time)});
 if(view==="upcoming"){var up=events.filter(function(e){return e.date>=today()});return pageHeader("Upcoming events","Your next appointments and commitments.",'<button class="button primary" data-act="create" data-type="event">'+ic("plus",15)+' New event</button>',"CALENDAR")+(up.length?'<div class="agenda-list">'+up.map(eventRow).join("")+'</div>':empty("calendar","No upcoming events","Add an event from your Calendar."))}
 if(view==="all"){return pageHeader("My calendar","Every event, all in one place.",'<button class="button primary" data-act="create" data-type="event">'+ic("plus",15)+' New event</button>',"CALENDAR")+(events.length?'<div class="agenda-list">'+events.map(eventRow).join("")+'</div>':empty("calendar","No events yet","Create a new calendar event."))}
 var day=state.ui.selectedDate||today(),ev=events.filter(function(e){return e.date===day});
 return pageHeader("Calendar","Time has its own natural home.",'<button class="button primary" data-act="create" data-type="event">'+ic("plus",15)+' New event</button>',"CALENDAR")+
 calendarMonthHtml(state.ui.month)+
 '<div class="agenda-strip"><h3>'+esc(humanDay(day,{weekday:"long",month:"long",day:"numeric"}))+'</h3><button class="button" data-act="create" data-type="event" data-date="'+day+'">'+ic("plus",14)+' Event</button></div>'+
 (ev.length?'<div class="agenda-list">'+ev.map(eventRow).join("")+'</div>':empty("calendar","No events on this day","Click + Event to schedule something.")) ;
}
function renderPlanner(){
 var view=state.ui.view,all=list("task"),items;
 if(view==="today")items=all.filter(function(e){return !e.completed&&e.dueDate&&e.dueDate<=today()}).sort(byDue);
 else if(view==="inbox")items=all.filter(function(e){return !e.completed&&!e.dueDate});
 else if(view==="upcoming")items=all.filter(function(e){return !e.completed&&e.dueDate>today()}).sort(byDue);
 else if(view==="completed")items=all.filter(function(e){return e.completed}).sort(byRecent);
 else items=all;
 var names={today:"Today",inbox:"Inbox",upcoming:"Upcoming",completed:"Completed"},title=names[view]||"Planner";
 return pageHeader(title,view==="today"?"Focus on what needs action.":"Tasks belong here, even when created elsewhere.",'<button class="button" data-act="create" data-type="project">'+ic("folder",15)+' Project</button><button class="button primary" data-act="create" data-type="task">'+ic("plus",15)+' Task</button>',"PLANNER")+
 (items.length?'<div class="panel" style="max-width:840px;padding:8px 20px">'+items.map(taskRow).join("")+
 (view!=="completed"?'<div class="inline-add"><span>'+ic("plus",16)+'</span><input id="planner-quick" placeholder="Add a task…" aria-label="Add a task"><button data-act="planner-quick">Add</button></div>':"")+'</div>':
 '<div style="max-width:840px">'+empty("check-circle","Nothing here","Your tasks appear here automatically, even when created inside an event or project.","Add task","task")+'</div>')+
 (view==="today"?section("Projects",'<div class="card-grid">'+list("project").sort(byRecent).map(entityCard).join("")+'</div>',count("project")):"");
}
function notesForView(){
 var view=state.ui.view,arr=list("note");
 if(view==="starred")return arr.filter(function(x){return x.starred});
 if(view==="from-events")return arr.filter(function(x){return sources(x).some(function(p){return p.type==="event"})});
 if(view==="from-projects")return arr.filter(function(x){return sources(x).some(function(p){return ["project","task"].includes(p.type)})});
 if(view==="from-journal")return arr.filter(function(x){return sources(x).some(function(p){return p.type==="journal"})});
 if(view.startsWith("book:"))return arr.filter(function(x){return x.notebookId===view.slice(5)});
 return arr
}
function renderNotebooks(){
 var v=state.ui.view,notebooks=list("notebook"),notes=notesForView().sort(byRecent),heading="All notes",sub="Every note is findable, wherever it was written.";
 if(v==="starred")heading="Starred notes";
 if(v==="from-events"){heading="Notes from Calendar";sub="Notes created while looking at an event."}
 if(v==="from-projects"){heading="Notes from Planner";sub="Notes connected to projects and tasks."}
 if(v==="from-journal"){heading="Notes from Journal";sub="Notes linked to journal entries."}
 if(v.startsWith("book:")){var book=get(v.slice(5));heading=book?book.title:"Notebook";sub="A familiar place for your notes."}
 var actions='<button class="button" data-act="create" data-type="notebook">'+ic("notebook",15)+' Notebook</button><button class="button primary" data-act="create" data-type="note">'+ic("plus",15)+' Note</button>';
 var intro=(v==="all"&&notebooks.length?section("Notebooks",'<div class="card-grid">'+notebooks.map(entityCard).join("")+'</div>',notebooks.length):"");
 return pageHeader(heading,sub,actions,"NOTEBOOKS")+intro+section(v==="all"?"Notes":"Contents",notes.length?'<div class="card-grid">'+notes.map(entityCard).join("")+'</div>':empty("note","Nothing written here yet","Write something, even if you don't know where it belongs.","Add note","note"),notes.length)
}
function resourcesForView(){var v=state.ui.view,arr=list("resource");
 if(v==="archive")return state.entities.filter(function(e){return e.archived&&!e.trashed});
 if(v==="trash")return state.entities.filter(function(e){return e.trashed});
 if(v==="unsorted")return arr.filter(function(e){return !e.folderId&&!meaningfulContext(e)});
 if(v==="starred")return arr.filter(function(e){return e.starred});
 if(v==="from-events")return arr.filter(function(e){return sources(e).some(function(p){return p.type==="event"})});
 if(v==="from-projects")return arr.filter(function(e){return sources(e).some(function(p){return p.type==="project"||p.type==="task"})});
 if(v.startsWith("kind:")){var k=v.slice(5),groups={links:["link","article","social","book","movie","comic","music","podcast"],documents:["document"],images:["image"],videos:["video"],other:["other"]};return arr.filter(function(x){return (groups[k]||[]).includes(x.resourceKind)})}
 if(v.startsWith("folder:"))return arr.filter(function(e){return e.folderId===v.slice(7)});
 return arr
}
function renderLibrary(){
 var v=state.ui.view,all=resourcesForView().sort(byRecent),title="All items",sub="Keep resources, not the work of maintaining a library.";
 if(v==="unsorted"){title="Unsorted";sub="Only things without a meaningful context appear here."}
 if(v==="starred")title="Starred";
 if(v==="from-events"){title="From Calendar";sub="Files and references attached to calendar events."}
 if(v==="from-projects"){title="From Planner";sub="Resources supporting your work."}
 if(v==="archive"){title="Archive";sub="Out of sight, but not forgotten."}
 if(v==="trash"){title="Trash";sub="Restore or permanently remove an item."}
 if(v.startsWith("kind:"))title=v.slice(5).charAt(0).toUpperCase()+v.slice(6);
 if(v.startsWith("folder:")){var f=get(v.slice(7));title=f?objTitle(f):"Folder"}
 var actions=(v==="trash"||v==="archive")?"":'<button class="button" data-act="create" data-type="folder">'+ic("folder",15)+' Folder</button><button class="button primary" data-act="create" data-type="resource">'+ic("plus",15)+' Save anything</button>';
 var folderView=v==="all"?list("folder").length?"<div class=\"card-grid\">"+list("folder").map(entityCard).join("")+"</div>":"":"";
 var normalCards=all.map(function(e){return e.type==="resource"?resourceCard(e):entityCard(e)}).join("");
 return pageHeader(title,sub,actions,"LIBRARY")+
 (folderView?section("Folders",folderView,list("folder").length):"")+
 section("Saved resources",all.length?'<div class="card-grid">'+normalCards+'</div>':empty("library","Nothing here yet","Save a link, image or file. Shelf will remember its context.","Save something","resource"),all.length);
}
function safeRich(raw){
 var src=document.createElement("template");src.innerHTML=String(raw||"");
 var allowed=new Set(["P","DIV","BR","B","STRONG","I","EM","U","UL","OL","LI","H2","H3","BLOCKQUOTE","A"]);
 // Keep only trusted formatting and drop attributes from pasted/generated markup.
 function sanitizeElement(node){
  Array.from(node.childNodes).forEach(function(ch){
   if(ch.nodeType===8){ch.remove();return}
   if(ch.nodeType!==1)return;
   var href=ch.tagName==="A"?ch.getAttribute("href"):null;
   if(["SCRIPT","STYLE","IFRAME","OBJECT","SVG","MATH","FORM","INPUT","BUTTON"].includes(ch.tagName)){ch.remove();return}
   sanitizeElement(ch);
   if(!allowed.has(ch.tagName)){while(ch.firstChild)ch.parentNode.insertBefore(ch.firstChild,ch);ch.remove();return}
   Array.from(ch.attributes).forEach(function(attr){ch.removeAttribute(attr.name)});
   if(ch.tagName==="A"&&safeUrl(href)){ch.setAttribute("href",safeUrl(href));ch.setAttribute("rel","noopener noreferrer");ch.setAttribute("target","_blank")}
  })
 }
 sanitizeElement(src.content);return src.innerHTML
}
function detailMain(e){
 var isText=["note","journal"].includes(e.type),parts="";
 if(isText){
  parts+='<div class="rich-editor"><div class="editor-toolbar"><button data-act="format" data-command="bold" title="Bold"><b>B</b></button><button data-act="format" data-command="italic" title="Italic"><i>I</i></button><button data-act="format" data-command="insertUnorderedList" title="Bullet list">• List</button><button data-act="format" data-command="insertOrderedList" title="Numbered list">1. List</button></div><div id="rich-content" class="editor-content" data-placeholder="Write anything…" contenteditable="true" aria-label="Rich text editor">'+safeRich(e.html||"")+'</div></div>';
 }else if(e.type==="resource"){
  if(e.resourceKind==="image"&&e.blobId)parts+='<div class="resource-detail-preview"><img data-preview="'+esc(e.blobId)+'" alt="Saved image"></div>';
  else if(e.resourceKind==="image"&&safeUrl(e.url))parts+='<div class="resource-detail-preview"><img src="'+esc(e.url)+'" alt="Saved image"></div>';
  else parts+='<div class="resource-detail-preview">'+ic(typeIcon(e),58)+'</div>';
  if(safeUrl(e.url))parts+='<div class="resource-link">'+ic("link",16)+'<span>'+esc(e.url)+'</span><a target="_blank" rel="noopener noreferrer" href="'+esc(safeUrl(e.url))+'">Open '+ic("external-link",13)+'</a></div>';
  if(e.blobId)parts+='<button class="button" data-act="download-resource" data-id="'+e.id+'" style="margin:11px 0">'+ic("download",15)+' Download original file</button>';
  if(!e.blobId&&!e.url&&e.fileName)parts+='<div class="warn">Example file only. No actual attachment exists for this demo resource.</div>';
  parts+='<div class="detail-section"><h3>Notes about this resource</h3><textarea class="plain-editor" data-edit="body" placeholder="Your notes about this resource…">'+esc(e.body)+'</textarea></div>'
 }else if(e.type==="notebook"){
  parts+='<p style="color:#8b979a;font-size:12px">A home for notes. Notes created here also appear in All notes.</p>';
  var notes=list("note").filter(function(n){return n.notebookId===e.id}).sort(byRecent);
  parts+=notes.length?rows(notes,noteRow):empty("note","No notes yet","Create a note in this notebook.");
  parts+='<div class="context-actions"><button class="button" data-act="create" data-type="note" data-context="'+e.id+'">'+ic("plus",14)+' New note</button></div>';
 }else if(e.type==="folder"){
  var files=list("resource").filter(function(r){return r.folderId===e.id});
  parts+=files.length?rows(files,resourceRow):empty("folder","Empty folder","Save or move resources here.");
  parts+='<div class="context-actions"><button class="button" data-act="create" data-type="resource" data-context="'+e.id+'">'+ic("plus",14)+' Save resource</button></div>';
 }else{
  if(e.type==="project")parts+='<div class="detail-section"><h3>About this project</h3><textarea class="plain-editor" data-edit="body" placeholder="Context, current state, or anything useful…">'+esc(e.body)+'</textarea></div>';
  else if(e.type==="event")parts+='<div class="detail-section"><h3>About this event</h3><textarea class="plain-editor" data-edit="body" placeholder="What should you remember about this event?">'+esc(e.body)+'</textarea></div>';
  else if(e.type==="task")parts+='<div class="detail-section"><h3>Details</h3><textarea class="plain-editor" data-edit="body" placeholder="Add details if you need them…">'+esc(e.body)+'</textarea></div>';
 }
 return parts
}
function detailMeta(e){
 var out="";
 if(e.type==="event")out+='<div class="meta-pill">'+ic("calendar",15)+'<input type="date" data-edit="date" value="'+esc(e.date)+'" aria-label="Event date"></div><div class="meta-pill">'+ic("clock",15)+'<input type="time" data-edit="time" value="'+esc(e.time)+'" aria-label="Event time"></div><div class="meta-pill">'+ic("map-pin",15)+'<input type="text" data-edit="location" value="'+esc(e.location)+'" placeholder="Location" aria-label="Location"></div>';
 if(e.type==="task")out+='<div class="meta-pill">'+ic("calendar",15)+'<input type="date" data-edit="dueDate" value="'+esc(e.dueDate)+'" aria-label="Due date"></div>';
 if(e.type==="journal")out+='<div class="meta-pill">'+ic("calendar",15)+'<input type="date" data-edit="date" value="'+esc(e.date)+'" aria-label="Journal date"></div>';
 if(e.type==="project")out+='<div class="meta-pill">'+ic("layers",15)+'<select data-edit="projectStatus" aria-label="Project status"><option value="active"'+(e.projectStatus==="active"?" selected":"")+'>Active</option><option value="waiting"'+(e.projectStatus==="waiting"?" selected":"")+'>Waiting</option><option value="completed"'+(e.projectStatus==="completed"?" selected":"")+'>Completed</option></select></div>';
 if(e.type==="resource")out+='<div class="meta-pill">'+ic(typeIcon(e),15)+' '+esc(e.resourceKind)+'</div>';
 if(e.notebookId&&get(e.notebookId))out+='<div class="meta-pill meta-readonly">'+ic("notebook",15)+' '+esc(objTitle(get(e.notebookId)))+'</div>';
 return out?'<div class="meta-rows">'+out+'</div>':""
}
function captureBox(e){
 if(["folder","notebook"].includes(e.type))return "";
 return '<div class="capture-box"><textarea id="context-capture" placeholder="Write, paste a link, or drop something here…" aria-label="Add anything to this context"></textarea><div class="capture-actions">'+
 '<button class="capture-chip" data-act="capture-mode" data-mode="task">'+ic("check-circle",16)+' Task</button>'+
 '<button class="capture-chip" data-act="capture-mode" data-mode="note">'+ic("note",16)+' Note</button>'+
 '<button class="capture-chip" data-act="upload" data-context="'+e.id+'">'+ic("attach",16)+' File</button>'+
 '<button class="capture-chip" data-act="attach-existing" data-context="'+e.id+'">'+ic("link",16)+' Existing</button>'+
 '<button class="button primary" data-act="capture-save" data-context="'+e.id+'">Add</button></div></div>'+
 '<div class="capture-tip">Automatically linked to '+esc(objTitle(e))+'. Use “todo: ” to write a task, or paste a URL to save a resource.</div>';
}
function relatedSection(e){
 var content=rels(e),tasks=content.filter(function(x){return x.type==="task"}),notes=content.filter(function(x){return ["note","journal"].includes(x.type)}),
 resources=content.filter(function(x){return x.type==="resource"}),others=content.filter(function(x){return !["task","note","journal","resource"].includes(x.type)});
 var out="";
 if(tasks.length)out+='<div class="detail-section"><h3>'+ic("check-circle",15)+' Related tasks <span>'+tasks.filter(function(t){return t.completed}).length+' / '+tasks.length+'</span></h3>'+rows(tasks,taskRow)+'</div>';
 if(notes.length)out+='<div class="detail-section"><h3>'+ic("note",15)+' Related notes <span>'+notes.length+'</span></h3>'+rows(notes,noteRow)+'</div>';
 if(resources.length)out+='<div class="detail-section"><h3>'+ic("attach",15)+' Related resources <span>'+resources.length+'</span></h3>'+rows(resources,resourceRow)+'</div>';
 if(others.length)out+='<div class="detail-section"><h3>'+ic("layers",15)+' Related things <span>'+others.length+'</span></h3>'+rows(others,contextRow)+'</div>';
 return out
}
function detailSidebar(e){
 var src=sources(e);[e.notebookId,e.folderId].filter(Boolean).forEach(function(id){var p=get(id);if(p&&!src.includes(p))src.push(p)});
 var s='<div class="panel"><h3>Context</h3>'+
 (src.length?src.map(function(p){return '<div class="related-context">'+ic(typeIcon(p),15)+'<button data-act="open" data-id="'+p.id+'">'+esc(objTitle(p))+'</button><button class="icon-button" data-act="unlink" data-id="'+e.id+'" data-parent="'+p.id+'" title="Unlink from '+esc(objTitle(p))+'">'+ic("x",12)+'</button></div>'}).join(""):'<div style="font-size:11.5px;color:#9ba5a8">An independent item. It is still searchable everywhere.</div>')+
 '<div class="context-actions"><button class="button" data-act="attach-existing" data-context="'+e.id+'">'+ic("link",14)+' Link something</button></div></div>';
 if(e.type==="event"||e.type==="project"||e.type==="task"||e.type==="journal"){
  var linked=rels(e);
  s+='<div class="panel" style="margin-top:16px"><h3>At a glance</h3><div style="display:flex;flex-wrap:wrap;gap:7px">'+
  '<span class="tag">'+linked.filter(function(x){return x.type==="task"}).length+' tasks</span><span class="tag">'+linked.filter(function(x){return x.type==="note"}).length+' notes</span><span class="tag">'+linked.filter(function(x){return x.type==="resource"}).length+' resources</span></div></div>';
 }
 s+='<div class="panel" style="margin-top:16px"><h3>About this item</h3><div style="font-size:11px;color:#9ba5a8">Created '+esc(new Date(e.createdAt).toLocaleDateString())+'<br>Saved automatically'+(e.demo?'<br>Demonstration content':"")+'</div></div>';
 return s
}
function renderDetail(e){
 var fromTool=state.ui.lastTool||state.ui.tool,backTitle=TOOLS.find(function(x){return x.id===fromTool});
 var parentId=(state.ui.detailTrail||[]).slice(-1)[0],parent=parentId?get(parentId):null;var back='<div class="backline"><button data-act="back">'+ic("arrow",16)+' Back to '+esc(parent?objTitle(parent):backTitle?backTitle.name:"Shelf")+'</button> <span>/</span> <span>'+esc(typeName(e.type))+'</span></div>';
 var head='<div class="detail-head"><span class="detail-big-icon">'+ic(typeIcon(e),26)+'</span><div class="detail-head-main"><div class="detail-kind">'+esc(typeName(e.type))+(e.demo?' · EXAMPLE':"")+'</div>'+
 '<div class="'+(e.type==="task"?"check-title":"")+'">'+(e.type==="task"?'<button class="task-check'+(e.completed?" checked":"")+'" data-act="toggle-task" data-id="'+e.id+'">'+(e.completed?ic("check",16):"")+'</button>':"")+
 '<input id="detail-title" class="detail-title-input" data-edit="title" aria-label="Title" value="'+esc(e.title)+'" placeholder="'+(e.type==="journal"?humanDay(e.date):"Untitled")+'"></div></div>'+
 '<div class="detail-actions"><button class="icon-button'+(e.starred?" active":"")+'" data-act="toggle-star" data-id="'+e.id+'" title="'+(e.starred?"Unstar":"Star")+'">'+ic(e.starred?"starfill":"star",17)+'</button>'+
 '<button class="icon-button'+(state.ui.focusId===e.id?" active":"")+'" data-act="focus-context" data-id="'+e.id+'" title="Work in this context">'+ic("layers",17)+'</button>'+
 '<button class="icon-button" data-act="detail-menu" data-id="'+e.id+'" title="More options">'+ic("more",19)+'</button></div></div>';
 var related=relatedSection(e),showCapture=["event","project","task","note","resource","journal"].includes(e.type);
 var detail='<div class="detail-root">'+back+head+detailMeta(e)+'<div class="detail-columns"><div class="detail-core">'+detailMain(e)+
 (related?related:"")+(showCapture?'<div class="detail-section"><h3>'+ic("plus",15)+' Add to '+esc(objTitle(e))+'</h3>'+captureBox(e)+'</div>':"")+
 '</div><div class="detail-side">'+detailSidebar(e)+'</div></div></div>';
 return detail
}
function renderWorkspace(){
 var inner;
 if(state.ui.detailId){var e=get(state.ui.detailId);if(e){inner=renderDetail(e)}else{state.ui.detailId=null;inner=renderHome()}}
 else if(state.ui.tool==="home")inner=renderHome();
 else if(state.ui.tool==="journal")inner=renderJournal();
 else if(state.ui.tool==="calendar")inner=renderCalendar();
 else if(state.ui.tool==="planner")inner=renderPlanner();
 else if(state.ui.tool==="notebooks")inner=renderNotebooks();
 else if(state.ui.tool==="library")inner=renderLibrary();
 else inner=renderHome();
 mediaUrls.forEach(function(u){URL.revokeObjectURL(u)});mediaUrls=[];
 workspace.innerHTML=topbar()+'<div class="ws-body">'+inner+'</div>';
 fillPreviews()
}
function paint(){renderRail();renderSidebar();renderWorkspace()}
function go(tool,view,stay){if(!stay&&state.ui.detailId){state.ui.detailId=null}state.ui.detailTrail=[];state.ui.tool=tool;state.ui.view=view||({home:"today",journal:"today",calendar:"month",planner:"today",notebooks:"all",library:"all"}[tool]||"today");save();paint();workspace.scrollTop=0}
function openEntity(id){var e=get(id);if(!e)return;if(state.ui.detailId&&state.ui.detailId!==id){state.ui.detailTrail=(state.ui.detailTrail||[]).concat(state.ui.detailId).slice(-15)}else if(!state.ui.detailId){state.ui.detailTrail=[];state.ui.lastTool=state.ui.tool;state.ui.lastView=state.ui.view}state.ui.detailId=id;addRecent(id);save();paint();workspace.scrollTop=0}
function back(){if(state.ui.detailTrail&&state.ui.detailTrail.length){state.ui.detailId=state.ui.detailTrail.pop();save();paint();workspace.scrollTop=0;return}state.ui.detailId=null;state.ui.tool=state.ui.lastTool||state.ui.tool;state.ui.view=state.ui.lastView||state.ui.view;save();paint();workspace.scrollTop=0}
function journalToday(){var j=list("journal").find(function(e){return e.date===today()});if(!j){j=ent("journal","",{date:today()});state.entities.unshift(j);save()}openEntity(j.id)}
function classifyUrl(url){
 var u=new URL(url),h=u.hostname.toLowerCase(),p=u.pathname.toLowerCase();
 if(/\.(png|jpg|jpeg|webp|gif|avif)$/i.test(p))return "image";
 if(/\.(mp4|webm|mov)$/i.test(p)||/youtube\.com|youtu\.be|vimeo\.com/.test(h))return "video";
 if(/\.(pdf|docx?|xlsx?|pptx?|odt)$/i.test(p))return "document";
 if(/podcasts|pocketcasts|overcast|podbean|\/episode\//.test(h+p))return "podcast";
 if(/spotify|music\.apple|bandcamp|soundcloud|deezer/.test(h))return "music";
 if(/goodreads|openlibrary|bookshop\.org/.test(h))return "book";
 if(/imdb|letterboxd|themoviedb/.test(h))return "movie";
 if(/comicvine|leagueofcomicgeeks|webtoons/.test(h))return "comic";
 if(/reddit|twitter|x\.com|instagram|tiktok|facebook|threads\.net|linkedin|bsky/.test(h))return "social";
 if(/medium|substack|theguardian|nytimes|bbc|theverge|arstechnica|\/(article|news|story|blog)\//.test(h+p))return "article";
 return "link"
}
function captureObject(value,contextId,mode){
 var t=(value||"").trim();if(!t)return null;
 var url=t;if(/^www\./i.test(url))url="https://"+url;
 if(!/^https?:\/\//i.test(url)&&/^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(url))url="https://"+url;
 var recognized=safeUrl(url),type="note",title=t,extra={};
 if(mode==="task"||mode==="auto"&&/^(todo:|task:|\[\s?\])\s*/i.test(t)){type="task";title=t.replace(/^(todo:|task:|\[\s?\])\s*/i,"")}
 else if(mode!=="note"&&recognized){type="resource";title=hostname(recognized);extra.url=recognized;extra.resourceKind=classifyUrl(recognized)}
 else{type="note";title=t.split(/\n/)[0].slice(0,85);extra.html="<p>"+esc(t).replace(/\n/g,"</p><p>")+"</p>"}
 var context=get(contextId),id=context?context.id:null;
 if(id)extra.sourceId=id;
 if(context&&context.type==="notebook"&&type==="note")extra.notebookId=id;
 else if(context&&context.type==="folder"&&type==="resource")extra.folderId=id;
 else if(id)extra.contextIds=[id];
 var x=ent(type,title,extra);
 state.entities.unshift(x);save();return x;
}
function captureSave(contextId){
 var input=contextId?$("context-capture"):$("home-capture");
 if(!input||!input.value.trim())return;
 var actual=contextId||state.ui.focusId||null,created=captureObject(input.value,actual,activeComposer);
 if(created){activeComposer="auto";paint();toast(typeName(created.type)+" saved"+(actual&&get(actual)?" · linked to "+objTitle(get(actual)):"")+". Also in "+(created.type==="task"?"Planner":created.type==="note"?"Notebooks":"Library"))}
}
function primaryType(t){return {home:null,journal:"journal",calendar:"event",planner:"task",notebooks:"note",library:"resource"}[t]}
function openCreate(type,contextId,opts){
 opts=opts||{};if(type==="journal"){journalToday();return}
 if(!contextId&&type==="note"&&state.ui.tool==="notebooks"&&state.ui.view.startsWith("book:"))contextId=state.ui.view.slice(5);
 if(!contextId&&type==="resource"&&state.ui.tool==="library"&&state.ui.view.startsWith("folder:"))contextId=state.ui.view.slice(7);
 modalState={mode:"create",type:type,contextId:contextId||state.ui.focusId||null,opts:opts};
 var e=get(modalState.contextId),hint=e?"This will be connected to "+objTitle(e)+".":"No setup needed. You can always organize it later.";
 var title="New "+typeName(type).toLowerCase(),field='<div class="field"><label for="new-title">Title</label><input id="new-title" placeholder="'+(type==="event"?"e.g. Dentist, 2 PM":type==="project"?"e.g. Alpine Park HOA":"Give it a name")+'" required></div>';
 if(type==="note")field='<div class="field"><label for="new-title">Title (optional)</label><input id="new-title" placeholder="Start with an idea…"></div>';
 if(type==="resource")field='<div class="field"><label for="new-url">Paste a URL (or upload a file instead)</label><input id="new-url" placeholder="https://example.com"></div><div class="field"><label for="new-title">Title (optional)</label><input id="new-title" placeholder="Recognized automatically if blank"></div><button class="button" data-act="upload" data-context="'+esc(modalState.contextId||"")+'">'+ic("upload",15)+' Choose a file</button>';
 if(type==="event")field+='<div class="field-row"><div class="field"><label for="new-date">Date</label><input id="new-date" type="date" value="'+esc(opts.date||state.ui.selectedDate||today())+'" required></div><div class="field"><label for="new-time">Time</label><input id="new-time" type="time" value="14:00"></div></div><div class="field"><label for="new-location">Location (optional)</label><input id="new-location" placeholder="Add location"></div>';
 if(type==="task")field+='<div class="field"><label for="new-due">Due date (optional)</label><input id="new-due" type="date" value="'+esc(opts.dueDate||"")+'"></div>';
 if(type==="note"||type==="project")field+='<div class="field"><label for="new-body">Start writing (optional)</label><textarea id="new-body" rows="3" placeholder="Anything you want to remember…"></textarea></div>';
 openModal('<div class="modal-header"><h2>'+esc(title)+'</h2><button class="icon-button" data-act="modal-close" aria-label="Close">'+ic("x",19)+'</button></div><div class="modal-scroll"><p class="modal-help">'+esc(hint)+'</p><form id="create-form">'+field+'<div class="modal-buttons"><button type="button" class="button" data-act="modal-close">Cancel</button><button type="submit" class="button primary">'+ic("plus",14)+' Create</button></div></form></div>');
 var input=$("new-title")||$("new-url");if(input)input.focus();
}
function submitCreate(){
 if(!modalState||modalState.mode!=="create")return;
 var type=modalState.type,context=get(modalState.contextId),title=$("new-title")?$("new-title").value.trim():"";
 var url=$("new-url")?safeUrl($("new-url").value.trim()):"";
 if(type==="resource"&&!url){toast("Paste a valid URL, or choose a file");return}
 if(!title){if(type==="resource")title=hostname(url);else if(type==="note")title="";else{toast("Add a title first");return}}
 var extra={};
 if(type==="resource"){extra.url=url;extra.resourceKind=classifyUrl(url)}
 if(type==="event"){extra.date=$("new-date").value||today();extra.time=$("new-time").value;extra.location=$("new-location").value.trim()}
 if(type==="task")extra.dueDate=$("new-due").value||"";
 if((type==="note"||type==="project")&&$("new-body")){extra.body=$("new-body").value.trim();if(type==="note")extra.html=extra.body?"<p>"+esc(extra.body).replace(/\n/g,"</p><p>")+"</p>":""}
 if(context)extra.sourceId=context.id;
 if(context&&context.type==="notebook"&&type==="note")extra.notebookId=context.id;
 else if(context&&context.type==="folder"&&type==="resource")extra.folderId=context.id;
 else if(context)extra.contextIds=[context.id];
 var e=ent(type,title,extra);state.entities.unshift(e);save();closeModal();openEntity(e.id);toast(typeName(type)+" created"+(context?" · linked to "+objTitle(context):""))
}
function openModal(inner){modalRoot.innerHTML='<div class="modal-backdrop" data-act="modal-close"></div><div class="modal-box" role="dialog" aria-modal="true">'+inner+'</div>';modalRoot.classList.add("open");modalRoot.setAttribute("aria-hidden","false")}
function closeModal(){modalRoot.classList.remove("open");modalRoot.setAttribute("aria-hidden","true");modalRoot.innerHTML="";modalState=null;workingSearch=""}
function newMenu(){
 var t=state.ui.tool;
 var types=[{type:"task",title:"Task",help:"Something to do",icon:"check-circle"},{type:"event",title:"Calendar event",help:"Something on your schedule",icon:"calendar"},{type:"note",title:"Note",help:"Something to write or remember",icon:"note"},{type:"resource",title:"Link or file",help:"Something worth keeping",icon:"link"},{type:"project",title:"Project",help:"Something to work on",icon:"clipboard"},{type:"notebook",title:"Notebook",help:"A place for written things",icon:"notebook"}];
 openModal('<div class="modal-header"><h2>Save anything</h2><button class="icon-button" data-act="modal-close">'+ic("x",19)+'</button></div><div class="modal-scroll"><p class="modal-help">Paste a link or jot down a thought. No setup needed.</p><div class="capture-box" style="margin:0 0 15px"><textarea id="global-capture" placeholder="Write, paste a URL, or type “todo: ” for a task…" aria-label="Save anything"></textarea><div class="capture-actions"><span class="capture-tip" style="margin:0 0 0 7px;flex:1">Enter to save · Shift+Enter for a new line</span><button class="button primary" data-act="global-capture-save">'+ic("plus",14)+' Save</button></div></div><div style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#a3adae;margin:15px 0 8px">OR ADD USING A TOOL</div><div class="menu-list">'+types.map(function(x){return '<button class="menu-choice" data-act="create" data-type="'+x.type+'">'+ic(x.icon,20)+'<span><b style="font-size:12.5px">'+x.title+'</b><br><small>'+x.help+'</small></span>'+ic("chevron-right",16)+'</button>'}).join("")+'</div></div>');
 setTimeout(function(){var t=$("global-capture");if(t)t.focus()},10);
}
function saveGlobalCapture(){var el=$("global-capture");if(!el||!el.value.trim())return;var x=captureObject(el.value,state.ui.focusId||null,"auto");if(!x)return;closeModal();paint();toast(typeName(x.type)+" saved"+(x.sourceId&&get(x.sourceId)?" · linked to "+objTitle(get(x.sourceId)):""))}
function searchModal(){
 modalState={mode:"search"};
 openModal('<div class="modal-header"><h2>Find anything</h2><button class="icon-button" data-act="modal-close">'+ic("x",19)+'</button></div><div class="modal-scroll"><input id="global-search" class="search-input" type="search" placeholder="Find a note, event, file, task, project…" autocomplete="off" aria-label="Search all items"><div id="search-results" class="search-results"></div></div>');
 setTimeout(function(){var s=$("global-search");if(s)s.focus()},10);updateSearchResults("")
}
function updateSearchResults(q){
 var el=$("search-results");if(!el)return;
 var all=getAllSearchable().filter(function(e){return searchMatch(e,q)}).sort(byRecent).slice(0,35);
 el.innerHTML=all.length?all.map(function(e){return '<button class="search-result" data-act="open" data-id="'+e.id+'"><span class="row-icon">'+ic(typeIcon(e),16)+'</span><span><strong>'+esc(objTitle(e))+'</strong><small>'+esc(typeName(e.type))+(shortContext(e)?" · "+esc(shortContext(e)):"")+'</small></span>'+ic("chevron-right",15)+'</button>'}).join(""):'<div class="modal-empty">No matching items.</div>';
}
function attachModal(contextId){
 var context=get(contextId);if(!context)return;
 modalState={mode:"attach",contextId:contextId};
 openModal('<div class="modal-header"><h2>Add existing item</h2><button class="icon-button" data-act="modal-close">'+ic("x",19)+'</button></div><div class="modal-scroll"><p class="modal-help">Connect an existing task, note or resource to '+esc(objTitle(context))+'. No copying.</p><input class="search-input" id="attach-search" placeholder="Search existing items…" autocomplete="off"><div id="attach-results" class="search-results"></div></div>');
 updateAttachResults("");$("attach-search").focus()
}
function updateAttachResults(q){
 var el=$("attach-results");if(!el||!modalState)return;
 var target=get(modalState.contextId);if(!target)return;
 var arr=list().filter(function(e){if(e.id===target.id||["folder","notebook"].includes(e.type)||!searchMatch(e,q))return false;
 if(target.type==="notebook")return e.type==="note"&&e.notebookId!==target.id;
 if(target.type==="folder")return e.type==="resource"&&e.folderId!==target.id;
 return !(e.contextIds||[]).includes(target.id)}).sort(byRecent).slice(0,40);
 el.innerHTML=arr.length?arr.map(function(e){return '<button class="search-result" data-act="attach-one" data-id="'+e.id+'">'+ic(typeIcon(e),18)+'<span><strong>'+esc(objTitle(e))+'</strong><small>'+esc(typeName(e.type))+(contextName(e)?" · "+esc(contextName(e)):"")+'</small></span>'+ic("plus",16)+'</button>'}).join(""):'<div class="modal-empty">Nothing else to link.</div>'
}
function detailsMenu(e){
 if(!e)return;
 modalState={mode:"options",id:e.id};
 openModal('<div class="modal-header"><h2>'+esc(objTitle(e))+'</h2><button class="icon-button" data-act="modal-close">'+ic("x",19)+'</button></div><div class="modal-scroll"><div class="menu-list">'+
 '<button class="menu-choice" data-act="toggle-star" data-id="'+e.id+'">'+ic("star",19)+'<span>'+(e.starred?"Remove star":"Star this item")+'</span></button>'+
 '<button class="menu-choice" data-act="focus-context" data-id="'+e.id+'">'+ic("layers",19)+'<span>'+(state.ui.focusId===e.id?"Stop working here":"Work in this context")+'</span></button>'+
 '<button class="menu-choice" data-act="attach-existing" data-context="'+e.id+'">'+ic("link",19)+'<span>Link an existing item</span></button>'+
 '<button class="menu-choice" data-act="archive-item" data-id="'+e.id+'">'+ic("archive",19)+'<span>'+(e.archived?"Restore from archive":"Archive")+'</span></button>'+
 '<button class="menu-choice" data-act="'+(e.trashed?"restore-item":"trash-item")+'" data-id="'+e.id+'" style="color:#b1786f">'+ic("trash",19)+'<span>'+(e.trashed?"Restore from trash":"Move to trash")+'</span></button>'+
 (e.trashed?'<button class="menu-choice" data-act="delete-forever" data-id="'+e.id+'" style="color:#b2564b">'+ic("trash",19)+'<span>Delete permanently</span></button>':"")+
 '</div></div>');
}
function toggleTask(id){var e=get(id);if(!e)return;e.completed=!e.completed;touched(e);paint();toast(e.completed?"Task completed":"Task reopened")}
function focusContext(id){state.ui.focusId=state.ui.focusId===id?null:id;save();closeModal();paint();toast(state.ui.focusId?"Working on "+objTitle(get(id)):"Context cleared")}
function unlink(id,parentId){var e=get(id);if(!e)return;e.contextIds=(e.contextIds||[]).filter(function(x){return x!==parentId});if(e.folderId===parentId)e.folderId=null;if(e.notebookId===parentId)e.notebookId=null;touched(e);paint();toast("Link removed; item kept in its own tool")}
function archiveItem(id){var e=get(id);if(!e)return;e.archived=!e.archived;touched(e);closeModal();if(state.ui.detailId===id)back();else paint();toast(e.archived?"Archived":"Restored")}
function trashItem(id){var e=get(id);if(!e)return;e.trashed=true;e.archived=false;touched(e);closeModal();if(state.ui.detailId===id)back();else paint();toast("Moved to Trash")}
function restoreItem(id){var e=get(id);if(!e)return;e.trashed=false;touched(e);closeModal();paint();toast("Restored")}
function deleteForever(id){if(!confirm("Permanently delete this item? This cannot be undone."))return;state.entities=state.entities.filter(function(x){return x.id!==id});state.entities.forEach(function(x){x.contextIds=(x.contextIds||[]).filter(function(y){return y!==id});if(x.folderId===id)x.folderId=null;if(x.notebookId===id)x.notebookId=null});save();closeModal();if(state.ui.detailId===id)back();else paint();toast("Deleted permanently")}
function resourceDownload(e){if(e.blobId){loadBlob(e.blobId).then(function(blob){if(!blob){toast("File missing from local storage");return}var link=document.createElement("a"),url=URL.createObjectURL(blob);link.href=url;link.download=e.fileName||objTitle(e);link.click();setTimeout(function(){URL.revokeObjectURL(url)},6000)}).catch(function(){toast("Could not load file")})}else if(safeUrl(e.url)){window.open(safeUrl(e.url),"_blank","noopener,noreferrer")}else{toast("This is an illustrative resource, not an attached file")}}
function openDb(){return new Promise(function(resolve,reject){var req=indexedDB.open(DB,1);req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains("files"))req.result.createObjectStore("files")};req.onsuccess=function(){resolve(req.result)};req.onerror=function(){reject(req.error)}})}
async function storeBlob(id,blob){var db=await openDb();try{await new Promise(function(resolve,reject){var t=db.transaction("files","readwrite");t.objectStore("files").put(blob,id);t.oncomplete=resolve;t.onerror=function(){reject(t.error)}})}finally{db.close()}}
async function loadBlob(id){var db=await openDb();try{return await new Promise(function(resolve,reject){var req=db.transaction("files","readonly").objectStore("files").get(id);req.onsuccess=function(){resolve(req.result)};req.onerror=function(){reject(req.error)}})}finally{db.close()}}
async function fillPreviews(){
 var elems=Array.from(workspace.querySelectorAll("[data-preview]"));
 for(var img of elems){try{var blob=await loadBlob(img.getAttribute("data-preview"));if(blob&&img.isConnected){var u=URL.createObjectURL(blob);mediaUrls.push(u);img.src=u}}catch(e){}}
}
async function handleUpload(files){
 files=Array.from(files||[]);if(!files.length)return;var context=get(uploadContext||(state.ui.tool==="library"&&state.ui.view.startsWith("folder:")?state.ui.view.slice(7):null));uploadContext=null;var saved=0;
 for(var file of files){try{
  var kind=file.type.startsWith("image/")?"image":file.type.startsWith("video/")?"video":file.type.startsWith("audio/")?"music": "document";
  var e=ent("resource",file.name.replace(/\.[^/.]+$/,""),{resourceKind:kind,fileName:file.name,mime:file.type,fileSize:file.size,blobId:uid()});
  if(context){e.sourceId=context.id;if(context.type==="folder")e.folderId=context.id;else e.contextIds=[context.id]}
  await storeBlob(e.blobId,file);state.entities.unshift(e);saved++;
 }catch(err){toast("Some files could not be stored")}}
 save();closeModal();paint();toast(saved+" file"+(saved===1?"":"s")+" saved"+(context?" · linked to "+objTitle(context):"")+". Also in Library")}
function toB64(b){return new Promise(function(resolve,reject){var reader=new FileReader();reader.onload=function(){resolve(String(reader.result).split(",")[1])};reader.onerror=reject;reader.readAsDataURL(b)})}
function fromB64(data,mime){var raw=atob(data),chunks=[];for(var i=0;i<raw.length;i+=8192){var bit=raw.slice(i,i+8192),a=new Uint8Array(bit.length);for(var j=0;j<bit.length;j++)a[j]=bit.charCodeAt(j);chunks.push(a)}return new Blob(chunks,{type:mime||"application/octet-stream"})}
async function exportAll(){try{var out={format:"shelf-v011",savedAt:new Date().toISOString(),data:state,files:[]};
 var ids=Array.from(new Set(state.entities.map(function(e){return e.blobId}).filter(Boolean)));
 for(var id of ids){var b=await loadBlob(id);if(b)out.files.push({id:id,mime:b.type,data:await toB64(b)})}
 var url=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:"application/json"})),a=document.createElement("a");a.href=url;a.download="shelf-v011-backup-"+today()+".json";a.click();setTimeout(function(){URL.revokeObjectURL(url)},10000);toast("Backup exported")
 }catch(err){toast("Export failed: "+err.message)}}
async function importAll(file){try{var d=JSON.parse(await file.text());if(!d||d.format!=="shelf-v011"||!d.data||!Array.isArray(d.data.entities))throw Error("Invalid v0.11 backup");if(!confirm("Replace the current v0.11 library with the backup?"))return;for(var f of d.files||[]){await storeBlob(f.id,fromB64(f.data,f.mime))}state=d.data;state.ui.detailId=null;save();paint();toast("Backup restored")}catch(err){toast("Import failed: "+err.message)}}
function editField(target){var e=get(state.ui.detailId);if(!e)return;var f=target.getAttribute("data-edit");if(!f)return;if(f==="title"||f==="body"||f==="date"||f==="time"||f==="dueDate"||f==="location"||f==="projectStatus"){e[f]=target.value;touched(e)}}
function applyRichEdit(){var e=get(state.ui.detailId),el=$("rich-content");if(!e||!el)return;e.html=safeRich(el.innerHTML);e.body=stripHtml(e.html);touched(e)}
function formatRich(command){var el=$("rich-content");if(!el)return;el.focus();document.execCommand(command,false,null);applyRichEdit()}
function monthMove(dir){state.ui.month=monthStep(state.ui.month||monthKey(today()),dir);state.ui.selectedDate=state.ui.month+"-01";state.ui.detailId=null;save();paint()}
function onClick(ev){
 var b=ev.target.closest("[data-act]");if(!b)return;
 var act=b.getAttribute("data-act"),id=b.getAttribute("data-id"),type=b.getAttribute("data-type"),ctx=b.getAttribute("data-context"),view=b.getAttribute("data-view"),tool=b.getAttribute("data-tool"),current=get(id);
 if(act==="tool"){go(tool);return}
 if(act==="navigate"){go(tool||state.ui.tool,view);return}
 if(act==="open"){closeModal();openEntity(id);return}
 if(act==="back"){back();return}
 if(act==="new-menu"){newMenu();return}
 if(act==="global-capture-save"){saveGlobalCapture();return}
 if(act==="create-primary"){var t=primaryType(state.ui.tool);if(!t)newMenu();else openCreate(t,null);return}
 if(act==="create"){openCreate(type,ctx||null,{date:b.getAttribute("data-date")||null});return}
 if(act==="journal-today"){journalToday();return}
 if(act==="search"){searchModal();return}
 if(act==="date"){state.ui.selectedDate=b.getAttribute("data-date");state.ui.month=monthKey(state.ui.selectedDate);go("calendar","month");return}
 if(act==="month-prev"){monthMove(-1);return}
 if(act==="month-next"){monthMove(1);return}
 if(act==="calendar-today"){state.ui.selectedDate=today();state.ui.month=monthKey(today());go("calendar","month");return}
 if(act==="toggle-task"){toggleTask(id);return}
 if(act==="toggle-star"&&current){current.starred=!current.starred;touched(current);closeModal();paint();return}
 if(act==="detail-menu"){detailsMenu(current);return}
 if(act==="focus-context"){focusContext(id);return}
 if(act==="clear-focus"){state.ui.focusId=null;save();paint();return}
 if(act==="modal-close"){closeModal();return}
 if(act==="attach-existing"){attachModal(ctx||state.ui.detailId);return}
 if(act==="attach-one"){
  var target=get(modalState&&modalState.contextId);if(!current||!target)return;
  if(target.type==="notebook"&&current.type==="note")current.notebookId=target.id;
  else if(target.type==="folder"&&current.type==="resource")current.folderId=target.id;
  else{if(!current.contextIds)current.contextIds=[];if(!current.contextIds.includes(target.id))current.contextIds.push(target.id)}
  touched(current);closeModal();paint();toast("Linked to "+objTitle(target)+" · no duplicate created");return
 }
 if(act==="unlink"){unlink(id,b.getAttribute("data-parent"));return}
 if(act==="format"){formatRich(b.getAttribute("data-command"));return}
 if(act==="capture-mode"){activeComposer=activeComposer===b.getAttribute("data-mode")?"auto":b.getAttribute("data-mode");Array.from(document.querySelectorAll(".capture-chip[data-mode]")).forEach(function(el){el.classList.toggle("active",el.getAttribute("data-mode")===activeComposer)});return}
 if(act==="capture-save"){captureSave(ctx);return}
 if(act==="home-capture"){captureSave(null);return}
 if(act==="planner-quick"){
  var inp=$("planner-quick");if(inp&&inp.value.trim()){var task=ent("task",inp.value.trim(),{dueDate:state.ui.view==="today"?today():""});var focus=isFocusValid();if(focus)task.contextIds=[focus.id];state.entities.unshift(task);save();paint();toast("Task saved in Planner")}return
 }
 if(act==="upload"){uploadContext=ctx||state.ui.detailId||state.ui.focusId||null;$("upload-input").click();return}
 if(act==="download-resource"){if(current)resourceDownload(current);return}
 if(act==="archive-item"){archiveItem(id);return}
 if(act==="trash-item"){trashItem(id);return}
 if(act==="restore-item"){restoreItem(id);return}
 if(act==="delete-forever"){deleteForever(id);return}
 if(act==="export"){exportAll();return}
 if(act==="import"){$("backup-input").click();return}
}
document.addEventListener("click",onClick);
document.addEventListener("submit",function(ev){if(ev.target.id==="create-form"){ev.preventDefault();submitCreate()}});
document.addEventListener("input",function(ev){
 var el=ev.target;
 if(el.id==="global-search"){updateSearchResults(el.value);return}
 if(el.id==="attach-search"){updateAttachResults(el.value);return}
 if(el.id==="rich-content"){applyRichEdit();return}
 if(el.hasAttribute("data-edit")){editField(el);return}
});
document.addEventListener("change",function(ev){if(ev.target.hasAttribute("data-edit")){editField(ev.target);paint()}});
document.addEventListener("keydown",function(ev){
 var target=ev.target,tag=target.tagName||"";
 if(ev.key==="Escape"){if(modalRoot.classList.contains("open")){closeModal();return}if(state.ui.detailId){back();return}}
 if(ev.key==="/"&&!["INPUT","TEXTAREA"].includes(tag)&&!target.isContentEditable&&!ev.ctrlKey&&!ev.metaKey){ev.preventDefault();searchModal();return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="home-capture"){ev.preventDefault();captureSave(null);return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="global-capture"){ev.preventDefault();saveGlobalCapture();return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="planner-quick"){ev.preventDefault();var b=document.querySelector('[data-act="planner-quick"]');if(b)b.click();return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="context-capture"){ev.preventDefault();captureSave(state.ui.detailId);return}
});
document.addEventListener("paste",function(ev){
 if(ev.target.id!=="rich-content")return;
 ev.preventDefault();
 var text=ev.clipboardData?ev.clipboardData.getData("text/plain"):"";
 document.execCommand("insertText",false,text)
});
$("upload-input").addEventListener("change",function(){handleUpload(this.files);this.value=""});
$("backup-input").addEventListener("change",function(){if(this.files[0])importAll(this.files[0]);this.value=""});
document.addEventListener("dragover",function(ev){if(ev.dataTransfer&&Array.from(ev.dataTransfer.types||[]).includes("Files"))ev.preventDefault()});
document.addEventListener("drop",function(ev){if(ev.dataTransfer&&ev.dataTransfer.files&&ev.dataTransfer.files.length){ev.preventDefault();uploadContext=state.ui.detailId||state.ui.focusId||null;handleUpload(ev.dataTransfer.files)}});
save();paint();
})();
