(function(){
"use strict";
var KEY="shelf-everyday-v015", LEGACY="shelf-everyday-v014", LEGACY_OLD="shelf-everyday-v013", LEGACY_ANCIENT="shelf-everyday-v012", DB="shelf-v011-files";
var LIBRARY_TYPES=[
 {id:"article",name:"Articles",icon:"file"},{id:"image",name:"Images",icon:"image"},
 {id:"video",name:"Videos",icon:"video"},{id:"document",name:"Documents",icon:"file"},
 {id:"book",name:"Books",icon:"book"},{id:"podcast",name:"Podcasts",icon:"book-open"},
 {id:"music",name:"Music",icon:"book-open"},{id:"social",name:"Social",icon:"link"},
 {id:"movie",name:"Movies",icon:"video"},{id:"comic",name:"Comics",icon:"book"},
 {id:"other",name:"Other",icon:"folder"}];
var TOOLS=[
 {id:"home",name:"Home",icon:"house"},
 {id:"todo",name:"To do",icon:"check-circle"},
 {id:"calendar",name:"Calendar",icon:"calendar"},
 {id:"notes",name:"Notes",icon:"note"},
 {id:"journals",name:"Journals",icon:"book-open"},
 {id:"goals",name:"Goals",icon:"target"},
 {id:"habits",name:"Habits",icon:"flame"},
 {id:"routines",name:"Routines",icon:"list-checks"},
 {id:"projects",name:"Projects",icon:"folder-kanban"},
 {id:"bookmarks",name:"Bookmarks",icon:"bookmark"},
 {id:"resources",name:"Resources",icon:"library"}
];
// Icon paths: official Lucide SVGs (ISC License). See LUCIDE-LICENSE.txt.
var ICONS={
 "target":"<circle cx=\"12\" cy=\"12\" r=\"10\" /><circle cx=\"12\" cy=\"12\" r=\"6\" /><circle cx=\"12\" cy=\"12\" r=\"2\" />",
 "flame":"<path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\" />",
 "list-checks":"<path d=\"M13 5h8\" /><path d=\"M13 12h8\" /><path d=\"M13 19h8\" /><path d=\"m3 17 2 2 4-4\" /><path d=\"m3 7 2 2 4-4\" />",
 "folder-kanban":"<path d=\"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z\" /><path d=\"M8 10v4\" /><path d=\"M12 10v2\" /><path d=\"M16 10v6\" />",
 "desk":"<path d=\"M10.293 2.293a1 1 0 0 1 1.414 0l2.5 2.5 5.994 1.227a1 1 0 0 1 .506 1.687l-7 7a1 1 0 0 1-1.687-.506l-1.227-5.994-2.5-2.5a1 1 0 0 1 0-1.414z\" /><path d=\"m14.207 4.793-3.414 3.414\" /><path d=\"M3 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z\" /><path d=\"m9.086 6.5-4.793 4.793a1 1 0 0 0-.18 1.17L7 18\" />",
 "briefcase":"<path d=\"M12 12h.01\" /><path d=\"M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2\" /><path d=\"M22 13a18.15 18.15 0 0 1-20 0\" /><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\" />",
 "graduation":"<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\" /><path d=\"M22 10v6\" /><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\" />",
 "user":"<circle cx=\"12\" cy=\"8\" r=\"5\" /><path d=\"M20 21a8 8 0 0 0-16 0\" />",
 "house":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
 "book":"<path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20\" />",
 "book-open":"<path d=\"M12 5v16\" /><path d=\"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z\" />",
 "calendar":"<path d=\"M8 2v3\" /><path d=\"M16 2v3\" /><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" /><path d=\"M3 9h18\" /><path d=\"M8 13h.01\" /><path d=\"M12 13h.01\" /><path d=\"M16 13h.01\" /><path d=\"M8 17h.01\" /><path d=\"M12 17h.01\" /><path d=\"M16 17h.01\" />",
 "clipboard":"<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\" /><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\" /><path d=\"m9 14 2 2 4-4\" />",
 "notebook":"<path d=\"M2 6h4\" /><path d=\"M2 10h4\" /><path d=\"M2 14h4\" /><path d=\"M2 18h4\" /><rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\" /><path d=\"M15 2v20\" /><path d=\"M15 7h5\" /><path d=\"M15 12h5\" /><path d=\"M15 17h5\" />",
 "library":"<rect width=\"8\" height=\"18\" x=\"3\" y=\"3\" rx=\"1\" /><path d=\"M7 3v18\" /><path d=\"M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z\" />",
 "plus":"<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
 "search":"<path d=\"m21 21-4.34-4.34\" /><circle cx=\"11\" cy=\"11\" r=\"8\" />",
 "sun":"<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2\" /><path d=\"M12 20v2\" /><path d=\"m4.93 4.93 1.41 1.41\" /><path d=\"m17.66 17.66 1.41 1.41\" /><path d=\"M2 12h2\" /><path d=\"M20 12h2\" /><path d=\"m6.34 17.66-1.41 1.41\" /><path d=\"m19.07 4.93-1.41 1.41\" />",
 "inbox":"<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\" /><path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\" />",
 "clock":"<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 6v6l4 2\" />",
 "star":"<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />",
 "starfill":"<path fill=\"currentColor\" d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />",
 "folder":"<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\" />",
 "note":"<path d=\"M8 2v4\" /><path d=\"M12 2v4\" /><path d=\"M16 2v4\" /><rect width=\"16\" height=\"18\" x=\"4\" y=\"4\" rx=\"2\" /><path d=\"M8 10h6\" /><path d=\"M8 14h8\" /><path d=\"M8 18h5\" />",
 "image":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /><circle cx=\"9\" cy=\"9\" r=\"2\" /><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />",
 "video":"<path d=\"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5\" /><rect x=\"2\" y=\"6\" width=\"14\" height=\"12\" rx=\"2\" />",
 "file":"<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\" /><path d=\"M14 2v5a1 1 0 0 0 1 1h5\" /><path d=\"M10 9H8\" /><path d=\"M16 13H8\" /><path d=\"M16 17H8\" />",
 "link":"<path d=\"M9 17H7A5 5 0 0 1 7 7h2\" /><path d=\"M15 7h2a5 5 0 1 1 0 10h-2\" /><line x1=\"8\" x2=\"16\" y1=\"12\" y2=\"12\" />",
 "layers":"<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\" /><path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\" /><path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\" />",
 "check":"<path d=\"M20 6 9 17l-5-5\" />",
 "square":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" />",
 "check-circle":"<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m16 9-5.5 5.5L8 12\" />",
 "chevron-left":"<path d=\"m15 18-6-6 6-6\" />",
 "chevron-right":"<path d=\"m9 18 6-6-6-6\" />",
 "arrow":"<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />",
 "more":"<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />",
 "pin":"<path d=\"M12 17v5\" /><path d=\"M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z\" />",
 "pinfill":"<path fill=\"currentColor\" d=\"M12 17v5\" /><path d=\"M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z\" />",
 "chevron-up":"<path d=\"m18 15-6-6-6 6\" />",
 "chevron-down":"<path d=\"m6 9 6 6 6-6\" />",
 "x":"<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />",
 "bell":"<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />",
 "hash":"<line x1=\"4\" x2=\"20\" y1=\"9\" y2=\"9\" /><line x1=\"4\" x2=\"20\" y1=\"15\" y2=\"15\" /><line x1=\"10\" x2=\"8\" y1=\"3\" y2=\"21\" /><line x1=\"16\" x2=\"14\" y1=\"3\" y2=\"21\" />",
 "archive":"<rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\" /><path d=\"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8\" /><path d=\"M10 12h4\" />",
 "trash":"<path d=\"M10 11v6\" /><path d=\"M14 11v6\" /><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\" /><path d=\"M3 6h18\" /><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\" />",
 "download":"<path d=\"M12 15V3\" /><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><path d=\"m7 10 5 5 5-5\" />",
 "upload":"<path d=\"M12 3v12\" /><path d=\"m17 8-5-5-5 5\" /><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" />",
 "attach":"<path d=\"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551\" />",
 "external-link":"<path d=\"M15 3h6v6\" /><path d=\"M10 14 21 3\" /><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />",
 "calendar-days":"<path d=\"M8 2v3\" /><path d=\"M16 2v3\" /><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" /><path d=\"M3 9h18\" /><path d=\"M8 13h.01\" /><path d=\"M12 13h.01\" /><path d=\"M16 13h.01\" /><path d=\"M8 17h.01\" /><path d=\"M12 17h.01\" /><path d=\"M16 17h.01\" />",
 "list-todo":"<path d=\"M13 5h8\" /><path d=\"M13 12h8\" /><path d=\"M13 19h8\" /><path d=\"m3 17 2 2 4-4\" /><rect x=\"3\" y=\"4\" width=\"6\" height=\"6\" rx=\"1\" />",
 "map-pin":"<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /><circle cx=\"12\" cy=\"10\" r=\"3\" />",
 "menu":"<path d=\"M4 5h16\" /><path d=\"M4 12h16\" /><path d=\"M4 19h16\" />",
 "filter":"<path d=\"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z\" />",
 "pen":"<path d=\"M13 21h8\" /><path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" />",
 "repeat":"<path d=\"m17 2 4 4-4 4\" /><path d=\"M3 11v-1a4 4 0 0 1 4-4h14\" /><path d=\"m7 22-4-4 4-4\" /><path d=\"M21 13v1a4 4 0 0 1-4 4H3\" />",
 "sparkle":"<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\" /><path d=\"M20 2v4\" /><path d=\"M22 4h-4\" /><circle cx=\"4\" cy=\"20\" r=\"2\" />",
 "corner-down-right":"<path d=\"m15 10 5 5-5 5\" /><path d=\"M4 4v7a4 4 0 0 0 4 4h12\" />",
 "bookmark":"<path d=\"M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z\" />",
 "dots-vertical":"<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"12\" cy=\"5\" r=\"1\" /><circle cx=\"12\" cy=\"19\" r=\"1\" />",
};
function ic(n,size){return '<svg xmlns="http://www.w3.org/2000/svg" width="'+(size||17)+'" height="'+(size||17)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[n]||ICONS.note)+'</svg>'}
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
 goalStatus:"active",goalProgress:0,targetDate:"",frequency:"daily",habitLog:[],routineSteps:[],routineLog:{},
 notebookId:null,folderId:null,journalBookId:null,areaId:null,categoryId:null,sourceId:null,inbox:false,starred:false,pinned:false,archived:false,trashed:false,
 date:"",time:"",endTime:"",dueDate:"",location:"",completed:false,projectStatus:"active",
 url:"",resourceKind:"link",blobId:null,fileName:"",mime:"",fileSize:0,tags:[],color:"default",demo:false
},extra||{})}
function seed(){
 var d=today(),tomorrow=offsetDay(d,1),yesterday=offsetDay(d,-1);
 var aI=ent("area","Ivrnet",{demo:true}),aT=ent("area","Tec",{demo:true}),aC=ent("area","Casa",{demo:true}),aP=ent("area","Pessoal",{demo:true});
 var project=ent("project","Alpine Park HOA",{areaId:aI.id,body:"Example project context. Add a task, note, or resource here and find it again in its own tool.",starred:true,demo:true});
 var visit=ent("event","Oftalmologista · exemplo",{date:tomorrow,time:"14:00",location:"Consultório (exemplo)",body:"A calendar event with its own supporting information.",demo:true});
 var t1=ent("task","Revisar homepage",{contextIds:[project.id],dueDate:d,demo:true});
 var t2=ent("task","Separar exames anteriores",{contextIds:[visit.id],areaId:aP.id,dueDate:tomorrow,demo:true});
 var t3=ent("task","Anotar perguntas para a consulta",{contextIds:[visit.id],areaId:aP.id,dueDate:tomorrow,demo:true});
 var t4=ent("task","Revisar referências de design",{areaId:aT.id,dueDate:"",demo:true});
 var notebook1=ent("notebook","Ideas",{demo:true});
 var notebook2=ent("notebook","Recipes",{demo:true});
 var n1=ent("note","Perguntas para o médico",{html:"<p>Quero conversar sobre mudanças no grau e perguntar quando seria indicado repetir os exames.</p>",contextIds:[visit.id],demo:true});
 var n2=ent("note","Notas do projeto",{html:"<p>Este é um exemplo de anotação ligada ao projeto. Ela também aparece em <b>Notebook → All notes</b>.</p>",contextIds:[project.id],demo:true});
 var n3=ent("note","Organização como consequência do uso",{html:"<p>O sistema deve ficar organizado porque foi utilizado, não porque alguém teve tempo de configurá-lo.</p>",notebookId:notebook1.id,starred:true,demo:true});
 var n4=ent("note","Receita de panquecas",{html:"<p><b>Ingredientes:</b> farinha, leite, ovos.</p><p><b>Preparo:</b> misturar e dourar em frigideira.</p>",notebookId:notebook2.id,demo:true});
 var r1=ent("resource","Documentação WordPress",{url:"https://wordpress.org/documentation/",resourceKind:"link",contextIds:[project.id],body:"Referência pública de demonstração",demo:true});
 var r2=ent("resource","Exame anterior.pdf",{resourceKind:"document",fileName:"Exame anterior.pdf",contextIds:[visit.id],body:"Arquivo ilustrativo. Anexe seu próprio PDF para testar um arquivo real.",demo:true});
 var r3=ent("resource","MDN Web Docs",{url:"https://developer.mozilla.org/en-US/",resourceKind:"link",starred:true,demo:true});
 var journal=ent("journal","",{date:yesterday,html:"<p>Um registro de exemplo para demonstrar como o diário funciona.</p><p>As notas adicionadas a esta entrada também podem ser encontradas em Notebook.</p>",demo:true});
 return {version:15,entities:[aI,aT,aC,aP,project,visit,t1,t2,t3,t4,notebook1,notebook2,n1,n2,n3,n4,r1,r2,r3,journal],
 ui:{tool:"home",view:"today",selectedDate:d,month:monthKey(d),focusId:null,detailId:null,lastTool:"home",lastView:"today",recent:[project.id,visit.id],quickAccess:[],search:""},demo:true}
}
var state;
try{
 var existing=localStorage.getItem(KEY),legacy=localStorage.getItem(LEGACY),old=localStorage.getItem(LEGACY_OLD),ancient=localStorage.getItem(LEGACY_ANCIENT);
 state=JSON.parse(existing||legacy||old||ancient||"null");
 if(!state||!Array.isArray(state.entities))state=seed();
}catch(e){state=seed()}
function ensureAreas(){
 if(state.version>=12)return;
 var names=["Ivrnet","Tec","Casa","Pessoal"],areas=state.entities.filter(function(e){return e.type==="area"});
 if(!areas.length){areas=names.map(function(name){return ent("area",name,{demo:true})});state.entities.unshift.apply(state.entities,areas)}
 function known(n){return areas.find(function(a){return a.title===n})}
 state.entities.forEach(function(e){
  if(!e.demo||e.areaId)return;
  if(e.type==="project"&&e.title==="Alpine Park HOA"&&known("Ivrnet"))e.areaId=known("Ivrnet").id;
  if(e.type==="task"&&e.title==="Revisar referências de design"&&known("Tec"))e.areaId=known("Tec").id;
  if(e.type==="task"&&["Separar exames anteriores","Anotar perguntas para a consulta"].includes(e.title)&&known("Pessoal"))e.areaId=known("Pessoal").id;
 });
 state.version=12
}
ensureAreas();
state.ui=state.ui||seed().ui;
function ensureV13(){
 if(!Array.isArray(state.ui.recent))state.ui.recent=[];
 if(!Array.isArray(state.ui.quickAccess))state.ui.quickAccess=[];
 state.ui.quickAccess=state.ui.quickAccess.filter(function(q){return q&&(["entity","view"].includes(q.kind))});
 state.entities.forEach(function(e){
  if(e.type!=="task")return;
  if(typeof e.inbox!=="boolean")e.inbox=!e.completed&&!e.dueDate&&!e.areaId&&!(e.contextIds||[]).length;
 });
 state.version=13;
}
ensureV13();
function ensureCategories(){
 if(state.ui.categoriesSeeded)return;
 var defaults={"ivrnet":["Support tickets","Website development","WordPress maintenance","Admin","General tasks"],"tec":["Demandas","Iniciativas","Admin"]};
 state.entities.filter(function(e){return e.type==="area"&&!e.trashed}).forEach(function(a){
  var names=defaults[String(a.title).trim().toLowerCase()]||[];
  names.forEach(function(name){
   var exists=state.entities.some(function(c){return c.type==="category"&&c.areaId===a.id&&c.title.toLowerCase()===name.toLowerCase()&&!c.trashed});
   if(!exists)state.entities.push(ent("category",name,{areaId:a.id}))
  })
 });
 var alpine=state.entities.find(function(e){return e.type==="project"&&e.demo&&e.title==="Alpine Park HOA"&&!e.categoryId});
 if(alpine){var c=state.entities.find(function(e){return e.type==="category"&&e.areaId===alpine.areaId&&e.title==="Website development"&&!e.trashed});if(c)alpine.categoryId=c.id}
 state.ui.categoriesSeeded=true
}
ensureCategories();
function ensureJournals(){
 var books=state.entities.filter(function(e){return e.type==="journalbook"&&!e.trashed});
 var def=books.find(function(e){return e.id===state.ui.defaultJournalId})||books.find(function(e){return e.journalDefault});
 if(!def){
  def=ent("journalbook","Journal",{journalDefault:true});
  state.entities.push(def)
 }
 state.ui.defaultJournalId=def.id;
 state.entities.forEach(function(e){
  if(e.type==="journal"&&!e.trashed&&!state.entities.some(function(b){return b.id===e.journalBookId&&b.type==="journalbook"&&!b.trashed}))e.journalBookId=def.id
 });
 if(typeof state.ui.journalCalendarExpanded!=="boolean")state.ui.journalCalendarExpanded=true;
 if(!state.ui.journalMonth)state.ui.journalMonth=monthKey(today());
 if(!state.ui.journalSelectedDate)state.ui.journalSelectedDate=today();
 if(state.ui.tool==="journals"&&(!state.ui.view||["today","timeline"].includes(state.ui.view)))state.ui.view="journalbook:"+def.id;
}
ensureJournals();
function canonicalTool(tool,view){
 if(tool==="planner")return view==="projects"?"projects":"todo";
 if(tool==="notebooks")return "notes";
 if(tool==="journal")return "journals";
 if(tool==="library")return view==="bookmarks"?"bookmarks":"resources";
 return tool
}
function ensureV14(){
 if(!state.ui)state.ui={};
 var oldTool=state.ui.tool||"home",oldView=state.ui.view||"today";
 state.ui.tool=canonicalTool(oldTool,oldView);
 state.ui.view=oldTool==="planner"&&oldView==="projects"?"all":
  oldTool==="library"&&oldView==="bookmarks"?"all":oldView;
 state.ui.lastTool=canonicalTool(state.ui.lastTool||"home",state.ui.lastView);
 if(state.ui.lastTool==="projects"&&state.ui.lastView==="projects")state.ui.lastView="all";
 if(Array.isArray(state.ui.quickAccess)){
  state.ui.quickAccess.forEach(function(q){
   if(q.kind!=="view")return;
   var old=q.tool||"home",view=q.view;
   q.tool=canonicalTool(old,view);
   if(old==="planner"&&view==="projects"||old==="library"&&view==="bookmarks")q.view="all";
  })
 }
 if(state.ui.sidebarDateFilters){
  var oldFilters=state.ui.sidebarDateFilters;
  ["planner","notebooks","journal","library"].forEach(function(k){
   if(oldFilters[k]){oldFilters[canonicalTool(k)]=oldFilters[k];delete oldFilters[k]}
  })
 }
 if(state.ui.miniCalendars){
  var oldCal=state.ui.miniCalendars;
  ["planner","notebooks","journal","library"].forEach(function(k){
   if(oldCal[k]){oldCal[canonicalTool(k)]=oldCal[k];delete oldCal[k]}
  })
 }
 state.entities.forEach(function(e){
  if(e.type==="goal"){if(typeof e.goalProgress!=="number")e.goalProgress=0;if(!e.goalStatus)e.goalStatus="active"}
  if(e.type==="habit"){if(!Array.isArray(e.habitLog))e.habitLog=[];if(!e.frequency)e.frequency="daily"}
  if(e.type==="routine"){if(!Array.isArray(e.routineSteps))e.routineSteps=[];if(!e.routineLog||typeof e.routineLog!=="object")e.routineLog={}}
 });
 state.version=14
}
ensureV14();
function ensureV15(){
 var ui=state.ui||{};
 if(!ui.navSections||typeof ui.navSections!=="object")ui.navSections={todo:true,life:true,resources:true,filters:false,tags:false,pinned:false};
 if(!ui.navNodes||typeof ui.navNodes!=="object")ui.navNodes={tasks:true,projects:false,journals:false,notebooks:false,bookmarks:false,collections:false};
 if(!ui.navMore||typeof ui.navMore!=="object")ui.navMore={};
 if(!ui.miniCalendars||typeof ui.miniCalendars!=="object")ui.miniCalendars={};
 if(!ui.miniCalendars.sidebar)ui.miniCalendars.sidebar={expanded:false,month:monthKey(today())};
 ui.navMenu=null;
 state.version=15
}
ensureV15();
if(state.ui.expandedAreaId===undefined){
 var remembered=state.ui.view&&state.ui.view.startsWith("area:")?state.ui.view.slice(5):null;
 var first=state.entities.find(function(e){return e.type==="area"&&String(e.title).toLowerCase()==="ivrnet"&&!e.trashed});
 state.ui.expandedAreaId=remembered||(first?first.id:null)
}
var $=function(id){return document.getElementById(id)};
var rail=$("toolrail"),sidebar=$("sidebar"),workspace=$("workspace"),modalRoot=$("modal-root"),toastEl=$("toast");
var activeComposer="auto",composerFor=null,composerText="",modalState=null,uploadContext=null,universalUpload=false,mediaUrls=[],toastTimer=null;
var lastToolView=null,workingSearch="",draggingAreaItem=null,draggingQuickKey=null;
function get(id){return state.entities.find(function(x){return x.id===id})}
function list(type,includeHidden){return state.entities.filter(function(x){return (!type||x.type===type)&&(includeHidden||(!x.archived&&!x.trashed))})}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast("Cannot save: browser storage may be full. Export a backup.")}}
function touched(e){if(!e)return;e.updatedAt=now();save()}
function isDemo(e){return !!e.demo}
function rels(e){return state.entities.filter(function(x){return !x.trashed&&!x.archived&&x.contextIds&&x.contextIds.includes(e.id)})}
function sources(e){return (e.contextIds||[]).map(get).filter(function(x){return x&&!x.trashed&&!x.archived})}
function areaIcon(a){var n=(a&&a.title||"").toLowerCase();return n==="ivrnet"?"briefcase":n==="tec"?"graduation":n==="casa"?"house":n==="pessoal"?"user":"layers"}
function areaOf(e,seen){
 if(!e)return null;
 if(e.type==="area")return !e.archived&&!e.trashed?e:null;
 var assigned=get(e.areaId);if(assigned&&assigned.type==="area"&&!assigned.archived&&!assigned.trashed)return assigned;
 seen=seen||new Set();if(seen.has(e.id))return null;seen.add(e.id);
 for(var p of sources(e)){var a=areaOf(p,seen);if(a)return a}
 return null
}
function projectOf(e){return sources(e).find(function(p){return p.type==="project"})||null}
function categoriesIn(area){return list("category").filter(function(c){return !!area&&c.areaId===area.id})}
function categoryOf(e,seen){
 if(!e)return null;
 if(e.type==="category")return !e.archived&&!e.trashed?e:null;
 var area=areaOf(e),category=get(e.categoryId);
 if(category&&category.type==="category"&&!category.trashed&&!category.archived&&area&&category.areaId===area.id)return category;
 seen=seen||new Set();if(seen.has(e.id))return null;seen.add(e.id);
 for(var p of sources(e)){var c=categoryOf(p,seen);if(c&&area&&c.areaId===area.id)return c}
 return null
}
function inCategory(e,category){var c=categoryOf(e);return !!(c&&category&&c.id===category.id)}
function inArea(e,area){var a=areaOf(e);return !!(a&&area&&a.id===area.id)}
function isBookmark(e){return e.type==="resource"&&!!safeUrl(e.url)}
function meaningfulContext(e){return sources(e).length>0||!!areaOf(e)}
function count(type){return list(type).length}
function inInbox(e){return e&&e.type==="task"&&!e.completed&&e.inbox===true}
function inboxCount(){return list("task").filter(inInbox).length}
function toast(s){toastEl.textContent=s;toastEl.classList.add("open");clearTimeout(toastTimer);toastTimer=setTimeout(function(){toastEl.classList.remove("open")},2800)}
function typeIcon(e){if(!e)return "layers";if(e.type==="resource")return e.resourceKind==="image"?"image":e.resourceKind==="video"?"video":e.resourceKind==="link"?"link":"file";return {event:"calendar",task:"check-circle",note:"note",project:"clipboard",journal:"book-open",journalbook:"book-open",notebook:"notebook",folder:"folder",area:"layers",category:"folder",goal:"target",habit:"flame",routine:"list-checks"}[e.type]||"layers"}
function typeName(type){return {event:"Event",task:"Task",note:"Note",resource:"Resource",project:"Project",journal:"Journal entry",journalbook:"Journal",notebook:"Notebook",folder:"Collection",area:"Area",category:"Category",goal:"Goal",habit:"Habit",routine:"Routine"}[type]||"Item"}
function objTitle(e){return e.title|| (e.type==="journal"?humanDay(e.date):e.fileName||hostname(e.url)||"Untitled")}
function outOfDate(e){return !!(e.dueDate&&!e.completed&&e.dueDate<today())}
function contextName(e){var p=sources(e);return p.length?p.map(function(x){return objTitle(x)}).join(" · "):""}
function isFocusValid(){var f=get(state.ui.focusId);return f&&!f.trashed&&!f.archived?f:null}
function prettyMonth(k){return new Date(k+"-15T12:00:00").toLocaleDateString("en-US",{month:"long",year:"numeric"})}
function byRecent(a,b){return b.updatedAt-a.updatedAt}
function byDue(a,b){return (a.dueDate||"9999").localeCompare(b.dueDate||"9999")||a.createdAt-b.createdAt}
function addRecent(id){if(!id)return;state.ui.recent=[id].concat((state.ui.recent||[]).filter(function(x){return x!==id})).slice(0,12)}

var QUICK_PAGES=[
 {tool:"home",view:"today",label:"Home · Today",icon:"sun"},
 {tool:"home",view:"inbox",label:"Home · Inbox",icon:"inbox"},
 {tool:"calendar",view:"month",label:"Calendar · Month",icon:"calendar"},
 {tool:"calendar",view:"upcoming",label:"Calendar · Upcoming",icon:"calendar-days"},
 {tool:"todo",view:"today",label:"To do · Today",icon:"check-circle"},
 {tool:"todo",view:"inbox",label:"To do · Inbox",icon:"inbox"},
 {tool:"todo",view:"upcoming",label:"To do · Upcoming",icon:"calendar-days"},
 {tool:"todo",view:"all",label:"All tasks",icon:"check-circle"},
 {tool:"notes",view:"all",label:"All notes",icon:"note"},
 {tool:"journals",view:"all",label:"All entries",icon:"book-open"},
 {tool:"projects",view:"all",label:"All projects",icon:"folder-kanban"},
 {tool:"bookmarks",view:"all",label:"Bookmarks",icon:"bookmark"},
 {tool:"resources",view:"all",label:"Resources · All items",icon:"library"},
 {tool:"goals",view:"all",label:"Goals",icon:"target"},
 {tool:"habits",view:"all",label:"Habits",icon:"flame"},
 {tool:"routines",view:"all",label:"Routines",icon:"list-checks"}
];
function quickKey(q){
 if(q.kind==="entity")return "entity:"+q.id;
 if(q.kind==="view"){
  if(q.tool==="todo"&&q.view.startsWith("area:"))return "entity:"+q.view.slice(5);
  if(q.tool==="todo"&&q.view.startsWith("category:"))return "entity:"+q.view.slice(9);
  if(q.tool==="notes"&&q.view.startsWith("book:"))return "entity:"+q.view.slice(5);
  if(q.tool==="resources"&&q.view.startsWith("folder:"))return "entity:"+q.view.slice(7)
 }
 return "view:"+q.tool+":"+q.view
}
function quickHas(q){return (state.ui.quickAccess||[]).some(function(x){return quickKey(x)===quickKey(q)})}
function quickVisible(q){
 if(q.kind==="entity"){var e=get(q.id);return !!(e&&!e.trashed&&!e.archived)}
 return q.kind==="view"&&(TOOLS.some(function(t){return t.id===q.tool})||["overview","browse","tag"].includes(q.tool))&&typeof q.view==="string"&&q.view.length>0
}
function quickItem(q){
 if(q.kind==="entity"){
  var e=get(q.id);
  return e?{key:quickKey(q),label:objTitle(e),desc:typeName(e.type),icon:e.type==="area"?areaIcon(e):typeIcon(e)}:null
 }
 var p=QUICK_PAGES.find(function(x){return x.tool===q.tool&&x.view===q.view});
 if(p)return {key:quickKey(q),label:p.label,desc:TOOLS.find(function(x){return x.id===q.tool}).name,icon:p.icon};
 if(q.tool==="todo"&&q.view.startsWith("area:")){
  var area=get(q.view.slice(5));if(area)return {key:quickKey(q),label:objTitle(area),desc:"To do · Area",icon:areaIcon(area)}
 }
 if(q.tool==="todo"&&q.view.startsWith("category:")){
  var cat=get(q.view.slice(9));if(cat)return {key:quickKey(q),label:objTitle(cat),desc:"To do · Category",icon:"folder"}
 }
 if(q.tool==="notes"&&q.view.startsWith("book:")){
  var book=get(q.view.slice(5));if(book)return {key:quickKey(q),label:objTitle(book),desc:"Notebook",icon:"notebook"}
 }
 if(q.tool==="resources"&&q.view.startsWith("folder:")){
  var folder=get(q.view.slice(7));if(folder)return {key:quickKey(q),label:objTitle(folder),desc:"Collection",icon:"folder"}
 }
 if(q.tool==="overview"){
  var labels={todo:"To Do",life:"My Life",resources:"Resources",filters:"Filters",tags:"Tags",pinned:"Pinned"};
  return {key:quickKey(q),label:labels[q.view]||"Shelf",desc:"Section",icon:"folder"}
 }
 if(q.tool==="tag")return {key:quickKey(q),label:"#"+q.view,desc:"Tag",icon:"hash"};
 if(q.tool==="browse"){
  var kinds={link:"Links",note:"Notes",image:"Images",video:"Videos",document:"Documents",task:"Tasks",event:"Events",project:"Projects",journal:"Journal entries"};
  return {key:quickKey(q),label:kinds[q.view]||q.view,desc:"Filter",icon:"filter"}
 }
 return {key:quickKey(q),label:q.view.replace(/[-:]/g," "),desc:q.tool,icon:"layers"}
}
function quickList(){return (state.ui.quickAccess||[]).filter(quickVisible).map(function(q){return {ref:q,item:quickItem(q)}}).filter(function(x){return x.item}).slice(0,80)}
function quickAdd(q){
 if(!q||!quickVisible(q)||quickHas(q))return false;
 state.ui.quickAccess.push(q);save();return true
}
function quickRemove(key){state.ui.quickAccess=state.ui.quickAccess.filter(function(q){return quickKey(q)!==key});save()}
function quickReorder(key,target){
 var arr=state.ui.quickAccess,from=arr.findIndex(function(q){return quickKey(q)===key});
 var to=arr.findIndex(function(q){return quickKey(q)===target});
 if(from<0||to<0||from===to)return false;
 var entry=arr.splice(from,1)[0];arr.splice(to,0,entry);save();return true
}
function quickMove(key,by){
 var arr=state.ui.quickAccess,i=arr.findIndex(function(q){return quickKey(q)===key});
 if(i<0||i+by<0||i+by>=arr.length)return false;
 var entry=arr.splice(i,1)[0];arr.splice(i+by,0,entry);save();return true
}
function quickRef(key){return (state.ui.quickAccess||[]).find(function(q){return quickKey(q)===key})}
function quickOpen(key){var q=quickRef(key);if(!q||!quickVisible(q))return;if(q.kind==="entity")openEntity(q.id);else go(q.tool,q.view)}
function quickRow(q,idx){
 var info=quickItem(q),key=quickKey(q);
 if(!info)return "";
 return '<div class="quick-row" draggable="true" data-quick-drag="'+esc(key)+'" data-quick-drop="'+esc(key)+'">'+
 '<button class="sb-row quick-link" data-act="quick-open" data-key="'+esc(key)+'" title="'+esc(info.label+' · '+info.desc)+'" aria-label="'+esc(info.label)+'">'+
 '<span class="sb-ico">'+ic(info.icon,16)+'</span><span class="label">'+esc(info.label)+'</span></button>'+
 '<span class="quick-controls">'+
 '<button class="quick-control" data-act="quick-move" data-key="'+esc(key)+'" data-dir="-1" title="Move shortcut up" aria-label="Move '+esc(info.label)+' up"'+(idx===0?' disabled':'')+'>'+ic("chevron-up",12)+'</button>'+
 '<button class="quick-control" data-act="quick-move" data-key="'+esc(key)+'" data-dir="1" title="Move shortcut down" aria-label="Move '+esc(info.label)+' down"'+(idx===state.ui.quickAccess.length-1?' disabled':'')+'>'+ic("chevron-down",12)+'</button>'+
 '<button class="quick-control remove" data-act="quick-remove" data-key="'+esc(key)+'" title="Remove shortcut (original stays)" aria-label="Remove '+esc(info.label)+' shortcut">'+ic("x",12)+'</button>'+
 '</span></div>'
}

function buttonIcon(name){return ic(name,17)}
function getAllSearchable(){return list().filter(function(x){return x.type!=="folder"&&x.type!=="notebook"})}
function searchMatch(e,q){q=(q||"").toLowerCase().trim();if(!q)return true;var a=areaOf(e),c=categoryOf(e);var txt=[e.title,e.body,stripHtml(e.html),e.url,e.fileName,contextName(e),a&&a.title,c&&c.title,(e.tags||[]).join(" ")].join(" ").toLowerCase();return q.split(/\s+/).every(function(w){return txt.includes(w)})}
function renderRail(){ /* v0.15: all destinations live in the single persistent sidebar */ }
function sr(label,view,icon,opts){opts=opts||{};var sel=state.ui.view===view&&state.ui.tool===(opts.tool||state.ui.tool);return '<button class="sb-row'+(sel?" active":"")+(opts.sub?" sb-sub":"")+'" data-act="navigate" data-tool="'+esc(opts.tool||state.ui.tool)+'" data-view="'+esc(view)+'"'+(opts.areaDrop?' data-area-drop="'+esc(opts.areaDrop)+'"':"")+'><span class="sb-ico">'+ic(icon,16)+'</span><span class="label">'+esc(label)+'</span>'+(opts.count==null?"":'<span class="sb-num">'+opts.count+'</span>')+'</button>'}
function sh(label,createType){return '<div class="sb-section-heading"><span>'+esc(label)+'</span>'+(createType?'<button data-act="create" data-type="'+createType+'" title="New '+createType+'">'+ic("plus",14)+'</button>':"")+'</div>'}
// One consistent minicalendar in the footer of every tool.
function miniCalendarPreferences(tool){
 var all=state.ui.miniCalendars;
 if(!all||typeof all!=="object")all=state.ui.miniCalendars={};
 tool="sidebar";
 if(!all[tool]){
  all[tool]={
   expanded:tool==="journals"?state.ui.journalCalendarExpanded!==false:true,
   month:tool==="journals"?(state.ui.journalMonth||monthKey(today())):
     tool==="calendar"?(state.ui.month||monthKey(today())):monthKey(today())
  }
 }
 return all[tool]
}
function createdDate(e){
 if(!e||!e.createdAt)return "";
 var stamp=new Date(e.createdAt);
 return isNaN(stamp.getTime())?"":ndate(stamp)
}
function journalBookForView(view){
 view=view||state.ui.view||"";
 if(view.startsWith("journalbook:"))return view.slice("journalbook:".length);
 if(view.startsWith("day:"))return state.ui.journalDayBookId||null;
 if(view==="all"||view==="timeline")return null;
 return state.ui.defaultJournalId
}
function journalEntriesInScope(bookId){
 return list("journal").filter(function(e){return !bookId||e.journalBookId===bookId})
}
function sidebarDateItems(tool){
 var view=state.ui.view||"";
 if(tool==="journals")return journalEntriesInScope(journalBookForView());
 if(tool==="calendar")return list("event");
 if(tool==="todo"){
  var tasks=list("task"),projects=list("project");
  if(view.startsWith("category:")){
   var category=get(view.slice(9));tasks=tasks.filter(function(e){return inCategory(e,category)});
   projects=projects.filter(function(e){return inCategory(e,category)})
  }else if(view.startsWith("area:")){
   var area=get(view.slice(5));tasks=tasks.filter(function(e){return inArea(e,area)});
   projects=projects.filter(function(e){return inArea(e,area)})
  }
  return view==="projects"?projects:tasks.concat(projects)
 }
 if(tool==="notes")return notesForView().concat(view==="all"?list("notebook"):[]);
 if(tool==="resources")return resourcesForView().concat(view==="all"?list("folder"):[]);
 if(tool==="bookmarks")return bookmarksForView();
 if(tool==="projects")return list("project").filter(function(e){
  return view==="all"||view==="active"&&e.projectStatus==="active"||
   view==="waiting"&&e.projectStatus==="waiting"||view==="completed"&&e.projectStatus==="completed"||
   view==="unassigned"&&!areaOf(e)||view.startsWith("area:")&&inArea(e,get(view.slice(5)))
 });
 if(tool==="goals")return list("goal");
 if(tool==="habits")return list("habit");
 if(tool==="routines")return list("routine");
 if(tool==="browse")return browseEntities(view);
 if(tool==="tag")return list().filter(function(e){return (e.tags||[]).some(function(t){return String(t).toLowerCase()===view.toLowerCase()})});
 if(tool==="overview"){
  if(view==="todo")return list().filter(function(e){return ["task","project","routine"].includes(e.type)});
  if(view==="life")return list().filter(function(e){return ["journal","goal","habit"].includes(e.type)});
  if(view==="resources")return list().filter(function(e){return ["resource","note","folder","notebook"].includes(e.type)})
 }
 return list().filter(function(e){return ["task","project","event","journal","note","resource","notebook","folder","goal","habit","routine"].includes(e.type)})
}
function miniDateForTool(tool){
 if(tool==="journals")return state.ui.view.startsWith("day:")?state.ui.view.slice(4):null;
 if(tool==="calendar")return state.ui.selectedDate||today();
 return state.ui.sidebarDateFilters&&state.ui.sidebarDateFilters[tool]||null
}
function sidebarMiniCalendar(tool){
 var prefs=miniCalendarPreferences(tool),key=prefs.month||monthKey(today());
 var year=+key.slice(0,4),month=+key.slice(5,7)-1;
 var start=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate();
 var marks=new Set(),selection=miniDateForTool(tool);
 sidebarDateItems(tool).forEach(function(e){
  var created=createdDate(e);
  if(created&&!(tool==="journals"&&e.type==="journal")&&!(tool==="calendar"&&e.type==="event"))marks.add(created);
  if(["event","journal"].includes(e.type)&&e.date)marks.add(e.date);
  if(e.type==="task"&&e.dueDate)marks.add(e.dueDate);
  if(e.type==="goal"&&e.targetDate)marks.add(e.targetDate);
  if(e.type==="habit") (e.habitLog||[]).forEach(function(d){marks.add(d)});
  if(e.type==="routine")Object.keys(e.routineLog||{}).forEach(function(d){marks.add(d)})
 });
 var html='<div class="mini-calendar sidebar-mini-calendar"><div class="mini-head">'+
 '<button data-act="sidebar-mini-prev" title="Previous month" aria-label="Previous month">'+ic("chevron-left",14)+'</button>'+
 '<span>'+esc(prettyMonth(key))+'</span>'+
 '<button data-act="sidebar-mini-next" title="Next month" aria-label="Next month">'+ic("chevron-right",14)+'</button></div><div class="mini-grid">';
 ["S","M","T","W","T","F","S"].forEach(function(x){html+='<span class="mini-week">'+x+'</span>'});
 for(var i=0;i<42;i++){
  var x=i-start+1,date=ndate(new Date(year,month,x,12)),valid=x>=1&&x<=days,marked=marks.has(date);
  html+='<button class="'+(!valid?"muted ":"")+(date===today()?"today ":"")+
  (date===selection?"selected ":"")+(marked?"has-event":"")+
  '" data-act="sidebar-mini-date" data-date="'+date+'" title="'+esc(humanDay(date))+
  (marked?" · Has content":"")+'" aria-label="'+esc(humanDay(date))+(marked?" — Has content":"")+'">'+
  new Date(date+"T12:00:00").getDate()+'</button>'
 }
 return html+'</div>'+
 (selection&&tool!=="calendar"?'<button class="sidebar-mini-clear" data-act="sidebar-mini-clear">'+ic("x",12)+' Clear date</button>':"")+
 '</div>'
}
function sidebarCalendarFooter(tool){
 var prefs=miniCalendarPreferences(tool);
 return '<div class="sidebar-calendar-shell">'+
 '<button class="sidebar-calendar-toggle" data-act="sidebar-mini-toggle" aria-expanded="'+(prefs.expanded?"true":"false")+
 '" title="'+(prefs.expanded?"Collapse calendar":"Expand calendar")+'">'+
 ic("calendar",15)+'<span>Calendar</span>'+ic(prefs.expanded?"chevron-down":"chevron-right",15)+'</button>'+
 (prefs.expanded?sidebarMiniCalendar(tool):"")+'</div>'
}
function selectSidebarDate(date){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date||"")||isNaN(new Date(date+"T12:00:00").getTime())||ndate(new Date(date+"T12:00:00"))!==date)return;
 var tool=state.ui.tool;miniCalendarPreferences(tool).month=monthKey(date);
 if(tool==="journals"){
  state.ui.journalDayBookId=journalBookForView();
  state.ui.journalSelectedDate=date;
  go("journal","day:"+date);return
 }
 if(tool==="calendar"){
  state.ui.selectedDate=date;state.ui.month=monthKey(date);
  go("calendar","month");return
 }
 if(!state.ui.sidebarDateFilters)state.ui.sidebarDateFilters={};
 state.ui.sidebarDateFilters[tool]=date;
 state.ui.detailId=null;state.ui.detailTrail=[];save();paint();workspace.scrollTop=0
}
function clearSidebarDate(){
 var tool=state.ui.tool;
 if(tool==="journals"&&state.ui.view.startsWith("day:")){
  var bookId=state.ui.journalDayBookId;
  go("journal",bookId?"journalbook:"+bookId:"all");return
 }
 if(state.ui.sidebarDateFilters)delete state.ui.sidebarDateFilters[tool];
 save();paint()
}
function calendarDateHeader(tool,date,subtitle,actions){
 return pageHeader(humanDay(date,{weekday:"long",month:"long",day:"numeric",year:"numeric"}),
  subtitle,actions+'<button class="button subtle" data-act="sidebar-mini-clear">'+ic("x",14)+' Clear date</button>',
  tool.toUpperCase()+" / DATE")
}
// Persistent navigation: section names open aggregators; chevrons only expand.
var NAV_SECTIONS=[
 {key:"todo",title:"To Do",actions:[["task","New task"],["project","New project"],["routine","New routine"]]},
 {key:"life",title:"My Life",actions:[["journalbook","New journal"],["goal","New goal"],["habit","New habit"]]},
 {key:"resources",title:"Resources",actions:[["note","New note"],["resource","Save link or file"],["folder","New collection"]]},
 {key:"filters",title:"Filters",actions:[]},
 {key:"tags",title:"Tags",actions:[]}
];
function navSections(){return state.ui.navSections||(state.ui.navSections={})}
function navNodes(){return state.ui.navNodes||(state.ui.navNodes={})}
function navExpanded(key){return navSections()[key]!==false}
function navOpenDestination(key){
 if(key==="todo")go("overview","todo");
 else if(key==="life")go("overview","life");
 else if(key==="resources")go("overview","resources");
 else if(key==="filters")go("overview","filters");
 else if(key==="tags")go("overview","tags");
 else if(key==="pinned")go("overview","pinned")
}
function navSelected(tool,view){
 return !state.ui.detailId&&state.ui.tool===tool&&state.ui.view===(view||"all")
}
function navTop(label,tool,view,icon,count){
 return '<button class="nav-top-row'+(navSelected(tool,view)?" selected":"")+
 '" data-act="navigate" data-tool="'+esc(tool)+'" data-view="'+esc(view)+
 '" aria-current="'+(navSelected(tool,view)?"page":"false")+'">'+
 ic(icon,17)+'<span class="nav-row-label">'+esc(label)+'</span>'+
 (count?'<span class="nav-subtle-count">'+count+'</span>':"")+'</button>'
}
function navLeaf(label,tool,view,icon,depth,extra){
 extra=extra||{};var active=navSelected(tool,view);
 return '<button class="nav-leaf'+(active?" selected":"")+'" style="--nav-depth:'+(depth||1)+
 '" data-act="navigate" data-tool="'+esc(tool)+'" data-view="'+esc(view)+
 '" title="'+esc(label)+'" aria-current="'+(active?"page":"false")+'">'+
 (icon?'<span class="nav-item-icon">'+ic(icon,15)+'</span>':"")+
 '<span class="nav-row-label">'+esc(label)+'</span>'+
 (extra.count!=null?'<span class="nav-subtle-count">'+extra.count+'</span>':"")+'</button>'
}
function navShowMore(key,array,render){
 var n=array.length,more=state.ui.navMore||(state.ui.navMore={});
 var cap=n<=10?n:Math.min(n,Math.max(5,more[key]||5));
 var output=array.slice(0,cap).map(render).join("");
 if(n>10&&cap<n)output+='<button class="nav-show-more" data-act="nav-show-more" data-key="'+esc(key)+'" data-next="'+Math.min(n,cap+10)+'">Show more</button>';
 else if(n>10&&cap>5)output+='<button class="nav-show-more" data-act="nav-show-less" data-key="'+esc(key)+'">Show less</button>';
 return output
}
function navNode(key,label,icon,tool,view,children){
 var expanded=navNodes()[key]===true,active=navSelected(tool,view);
 return '<div class="nav-branch"><div class="nav-node-row" data-node-key="'+esc(key)+'">'+
 '<button class="nav-node-link'+(active?" selected":"")+'" data-act="navigate" data-tool="'+esc(tool)+
 '" data-view="'+esc(view)+'">'+
 '<span class="nav-item-icon">'+ic(icon,15)+'</span><span class="nav-row-label">'+esc(label)+'</span></button>'+
 '<button class="nav-node-toggle'+(expanded?" open":"")+'" data-act="nav-node-toggle" data-key="'+esc(key)+
 '" aria-label="'+(expanded?"Collapse ":"Expand ")+esc(label)+'" aria-expanded="'+expanded+'">'+
 ic(expanded?"chevron-down":"chevron-right",14)+'</button></div>'+
 (expanded?'<div class="nav-node-children">'+children+'</div>':"")+'</div>'
}
function navSection(key,label,content,extraActions){
 var open=navExpanded(key),active=navSelected("overview",key);
 var config=NAV_SECTIONS.find(function(s){return s.key===key}),actions=extraActions||(config?config.actions:[]);
 var menu='<div class="nav-section-popover" role="menu" aria-label="'+esc(label)+' options" hidden>'+
 '<button role="menuitem" data-act="nav-section-open" data-key="'+esc(key)+'">'+ic("folder",15)+' Open '+esc(label)+'</button>'+
 '<button role="menuitem" data-act="nav-section-toggle" data-key="'+esc(key)+'">'+ic(open?"chevron-up":"chevron-down",15)+(open?" Collapse":" Expand")+'</button>'+
 (actions||[]).map(function(item){return '<button role="menuitem" data-act="create" data-type="'+item[0]+'">'+ic("plus",15)+' '+esc(item[1])+'</button>'}).join("")+
 (key==="pinned"?'<button role="menuitem" data-act="quick-add">'+ic("plus",15)+' Add shortcut</button>':"")+'</div>';
 return '<section class="nav-section'+(open?" expanded":" collapsed")+'">'+
 '<div class="nav-section-row">'+
 '<button class="nav-section-toggle" data-act="nav-section-toggle" data-key="'+esc(key)+
 '" aria-expanded="'+open+'" aria-label="'+(open?"Collapse ":"Expand ")+esc(label)+'">'+
 ic(open?"chevron-down":"chevron-right",14)+'</button>'+
 '<button class="nav-section-title'+(active?" selected":"")+'" data-act="nav-section-open" data-key="'+esc(key)+'">'+esc(label)+'</button>'+
 '<button class="nav-section-options" data-act="nav-section-menu" title="'+esc(label)+' options" aria-label="Options for '+esc(label)+'" aria-haspopup="menu" aria-expanded="false">'+ic("more",16)+'</button>'+
 menu+'</div>'+
 (open?'<div class="nav-section-content">'+content+'</div>':"")+'</section>'
}
function navTags(){
 var map={};
 list().forEach(function(e){(e.tags||[]).forEach(function(tag){tag=String(tag||"").trim();if(!tag)return;var k=tag.toLowerCase();if(!map[k])map[k]={label:tag,count:0};map[k].count++})});
 return Object.keys(map).sort(function(a,b){return a.localeCompare(b)}).map(function(key){return map[key]})
}
function renderSidebar(){
 var taskAreas=list("area"),projects=list("project"),journals=list("journalbook"),books=list("notebook"),
  folders=list("folder"),links=list("resource").filter(isBookmark),more=state.ui.navMore||{};
 var top='<div class="shelf-nav-header">'+
 '<div class="shelf-nav-brand"><span>Shelf</span><span class="shelf-nav-brand-caret">'+ic("chevron-down",14)+'</span>'+
 '<span class="shelf-nav-head-spacer"></span>'+
 '<button data-act="search" class="shelf-nav-icon" title="Search everything" aria-label="Search">'+ic("search",17)+'</button>'+
 '</div>'+
 '<button class="nav-new-item" data-act="universal-open">'+ic("pen",16)+' <span>New item</span><kbd>Q</kbd></button>'+
 '<div class="nav-top-links">'+
 navTop("Today","home","today","sun")+
 navTop("Inbox","home","inbox","inbox",inboxCount())+
 navTop("Calendar","calendar","month","calendar-days")+
 navTop("Recent","home","recent","clock")+
 '</div></div>';
 var tasksChildren=navShowMore("task-areas",taskAreas,function(a){
  return navLeaf(objTitle(a),"todo","area:"+a.id,areaIcon(a),3)
 });
 var activeProjects=projects.filter(function(e){return e.projectStatus==="active"}).sort(function(a,b){return (b.starred?1:0)-(a.starred?1:0)||b.updatedAt-a.updatedAt});
 var projectsChildren=navShowMore("active-projects",activeProjects,function(p){
  return '<button class="nav-leaf nav-object-link" style="--nav-depth:3" data-act="open" data-id="'+esc(p.id)+'" title="'+esc(objTitle(p))+'">'+
   '<span class="nav-item-icon">'+ic("folder-kanban",15)+'</span><span class="nav-row-label">'+esc(objTitle(p))+'</span></button>'
 });
 if(!activeProjects.length)projectsChildren='<div class="nav-muted-item">No active projects</div>';
 var todoContent=
  navNode("tasks","Tasks","check-circle","todo","all",tasksChildren)+
  navNode("projects","Projects","folder-kanban","projects","all",projectsChildren)+
  navLeaf("Routines","routines","today","list-checks",1);
 var journalsChildren=navLeaf("All entries","journals","all","book-open",2);
 journals.sort(function(a,b){return (a.id===state.ui.defaultJournalId?-1:b.id===state.ui.defaultJournalId?1:0)||a.createdAt-b.createdAt});
 journalsChildren+=navShowMore("journalbooks",journals,function(j){
  return navLeaf(objTitle(j),"journals","journalbook:"+j.id,"book-open",2,{count:list("journal").filter(function(e){return e.journalBookId===j.id}).length})
 });
 var lifeContent=navNode("journals","Journal","book-open","journals","journalbook:"+state.ui.defaultJournalId,journalsChildren)+
  navLeaf("Goals","goals","active","target",1)+navLeaf("Habits","habits","today","flame",1);
 var notebookChildren=navShowMore("notebooks",books.sort(byRecent),function(n){
  return navLeaf(objTitle(n),"notes","book:"+n.id,"notebook",2)
 });
 var bookmarkCollections=folders.filter(function(f){return links.some(function(e){return e.folderId===f.id})});
 var bookmarkChildren=navShowMore("bookmark-folders",bookmarkCollections,function(f){
  return navLeaf(objTitle(f),"bookmarks","folder:"+f.id,"folder",2)
 });
 var collectionChildren=navShowMore("collections",folders,function(f){
  return navLeaf(objTitle(f),"resources","folder:"+f.id,"folder",2)
 });
 var resourcesContent=
  navNode("notebooks","Notebook","notebook","notes","all",notebookChildren)+
  navNode("bookmarks","Bookmarks","bookmark","bookmarks","all",bookmarkChildren)+
  navLeaf("Files & documents","resources","files","file",1)+
  navNode("collections","Collections","folder","resources","all",collectionChildren);
 var filters=[
  ["Links","link","link"],["Notes","note","note"],["Images","image","image"],
  ["Videos","video","video"],["Documents","document","file"],
  ["Tasks","task","check-circle"],["Events","event","calendar-days"],
  ["Projects","project","folder-kanban"],["Journal entries","journal","book-open"]
 ];
 var filterContent=filters.map(function(x){return navLeaf(x[0],"browse",x[1],x[2],1)}).join("");
 var tagData=navTags(),tagsContent=navShowMore("tags",tagData,function(tag){
  return navLeaf("#"+tag.label,"tag",tag.label,"hash",1,{count:tag.count})
 });
 if(!tagData.length)tagsContent='<div class="nav-muted-item">No tags yet</div>';
 var shortcuts=quickList(),pinnedContent=navShowMore("pinned",shortcuts,function(item){
  return '<button class="nav-leaf nav-pinned-item" style="--nav-depth:1" data-act="quick-open" data-key="'+esc(quickKey(item.ref))+'">'+
   '<span class="nav-item-icon">'+ic(item.item.icon,15)+'</span><span class="nav-row-label">'+esc(item.item.label)+'</span></button>'
 });
 var navigation='<div class="shelf-nav-scroll" aria-label="Browse Shelf">'+
  navSection("todo","To Do",todoContent)+
  navSection("life","My Life",lifeContent)+
  navSection("resources","Resources",resourcesContent)+
  navSection("filters","Filters",filterContent)+
  navSection("tags","Tags",tagsContent)+
  (shortcuts.length?navSection("pinned","Pinned",pinnedContent):"")+
 '</div>';
 var footer='<div class="shelf-nav-footer">'+sidebarCalendarFooter(state.ui.tool)+
 '<div class="nav-bottom-links">'+
 navLeaf("Archive","resources","archive","archive",0)+
 navLeaf("Trash","resources","trash","trash",0)+
 '</div>'+
 '<div class="shelf-nav-meta"><span>Shelf · v0.15</span><span><button data-act="export">Export</button> · <button data-act="import">Import</button></span></div>'+
 '</div>';
 sidebar.innerHTML=top+navigation+footer
}
function topbar(){
 var focus=isFocusValid();
 return '<div class="topbar"><button class="search-trigger" data-act="search" title="Search or create anything">'+ic("search",18)+'<span>Search or capture anything…</span><small class="kbd">/</small></button><div class="topbar-spacer"></div>'+
 (!state.ui.detailId&&state.ui.tool!=="home"?'<button class="icon-button'+(quickHas({kind:"view",tool:state.ui.tool,view:state.ui.view})?' quick-pinned':'')+'" data-act="quick-pin-current" title="'+(quickHas({kind:"view",tool:state.ui.tool,view:state.ui.view})?'Remove page from Home':'Pin this page to Home')+'" aria-label="Pin or unpin current page in Quick Access">'+ic(quickHas({kind:"view",tool:state.ui.tool,view:state.ui.view})?"pinfill":"pin",17)+'</button>':"")+
 (focus?'<div class="context-pill" title="New items can be linked to this context">'+ic("layers",13)+'<span class="context-name">'+esc(objTitle(focus))+'</span><button data-act="clear-focus" title="Stop using this context">'+ic("x",13)+'</button></div>':"")+
 '<button class="top-new" data-act="new-menu">'+ic("plus",16)+' New</button></div>'
}
function pageHeader(title,subtitle,actions,eyebrow){return '<div class="page-header"><div><div class="page-eyebrow">'+esc(eyebrow||"SHELF")+'</div><h1>'+esc(title)+'</h1>'+(subtitle?'<p>'+esc(subtitle)+'</p>':"")+'</div><div class="page-head-actions">'+(actions||"")+'</div></div>'}
function btn(label,action,iconName,type){return '<button class="button'+(type==="primary"?" primary":type==="subtle"?" subtle":"")+'" data-act="'+esc(action)+'">'+(iconName?ic(iconName,15):"")+esc(label)+'</button>'}
function empty(iconName,title,subtitle,action,type){return '<div class="empty"><div class="empty-icon">'+ic(iconName,27)+'</div><h3>'+esc(title)+'</h3><p>'+esc(subtitle)+'</p>'+(action?'<button class="button" data-act="create" data-type="'+esc(type)+'">'+ic("plus",14)+' '+esc(action)+'</button>':"")+'</div>'}
function shortContext(e){
 var names=sources(e).map(function(x){return objTitle(x)});
 if(names.length)return names.slice(0,2).join(" · ");
 if(["task","project"].includes(e.type)){var c=categoryOf(e);if(c)return objTitle(c)}
 return ""
}
function taskRow(e){return '<div class="task-row'+(e.completed?" done":"")+'" draggable="true" data-area-drag="'+esc(e.id)+'"><button class="task-check'+(e.completed?" checked":"")+'" data-act="toggle-task" data-id="'+e.id+'" title="'+(e.completed?"Mark incomplete":"Complete task")+'" aria-label="'+(e.completed?"Mark incomplete":"Complete task")+'">'+(e.completed?ic("check",13):"")+'</button><button class="item-open" data-act="open" data-id="'+e.id+'"><div class="row-title">'+esc(objTitle(e))+'</div><div class="row-sub">'+esc(shortContext(e)||(areaOf(e)?objTitle(areaOf(e)):e.dueDate?humanDay(e.dueDate):"No due date"))+'</div></button>'+(inInbox(e)?'<button class="button task-inbox-clear" data-act="clear-inbox" data-id="'+e.id+'" title="Keep this as a standalone task and remove it from Inbox">Keep</button>':"")+(outOfDate(e)?'<span class="row-right" style="color:#bb7266">Overdue</span>':"")+'</div>'}
function eventRow(e){return '<div class="event-row"><span class="row-time">'+esc(e.time||"All day")+'</span><div class="row-icon">'+ic("calendar",16)+'</div><button class="item-open" data-act="open" data-id="'+e.id+'"><div class="row-title">'+esc(objTitle(e))+'</div><div class="row-sub">'+esc(e.location||humanDay(e.date))+'</div></button><span class="row-right">'+(rels(e).length?rels(e).length+" related":"")+'</span></div>'}
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
 return '<article class="item-card" style="--card-bg:'+color+'"'+(["task","project"].includes(e.type)?' draggable="true" data-area-drag="'+esc(e.id)+'"':"")+'><button class="card-open" data-act="open" data-id="'+e.id+'">'+content+'</button>'+(e.starred?'<span style="position:absolute;top:10px;right:10px;color:#c3a563">'+ic("starfill",14)+'</span>':"")+'</article>'
}
function resourceCard(e){
 var kind=e.resourceKind,thumb='<div class="resource-preview '+(kind==="image"?"image":kind==="video"?"video":"")+'">'+
 (kind==="image"&&e.blobId?'<img data-preview="'+esc(e.blobId)+'" alt="">':kind==="image"&&safeUrl(e.url)?'<img src="'+esc(e.url)+'" alt="">':ic(typeIcon(e),44))+
 (e.url?'<span class="resource-domain">'+esc(hostname(e.url))+'</span>':"")+'</div>';
 return '<article class="item-card"><button class="card-open" data-act="open" data-id="'+e.id+'" style="padding:0;min-height:0">'+thumb+'<div class="resource-body"><div class="card-title">'+esc(objTitle(e))+'</div><div class="card-footer" style="margin-top:4px">'+ic(typeIcon(e),12)+'<span>'+esc(shortContext(e)||hostname(e.url)||e.fileName||kind)+'</span></div></div></button></article>'
}
function contextBreadcrumb(e){var p=sources(e);return p.map(function(x){return '<button data-act="open" data-id="'+x.id+'">'+esc(objTitle(x))+'</button>'}).join(' <span style="color:#acb7ba"> / </span> ')}
function renderDeskForDate(date){
 var events=list("event").filter(function(e){return e.date===date}).sort(function(a,b){return (a.time||"").localeCompare(b.time||"")});
 var due=list("task").filter(function(e){return e.dueDate===date}).sort(byDue);
 var journal=list("journal").filter(function(e){return e.date===date}).sort(byRecent);
 var created=list().filter(function(e){
  return createdDate(e)===date&&["task","project","event","journal","note","resource","notebook","folder"].includes(e.type)&&
   !due.some(function(t){return t.id===e.id})&&!events.some(function(t){return t.id===e.id})&&!journal.some(function(t){return t.id===e.id})
 }).sort(byRecent);
 var result=calendarDateHeader("Home",date,"Everything connected to this day.","");
 var total=events.length+due.length+journal.length+created.length;
 if(!total)return result+empty("calendar","Nothing recorded for this day","Use the calendar to explore another date, or capture something new.");
 if(events.length)result+=section("Events",rows(events,eventRow),events.length);
 if(due.length)result+=section("Tasks due",rows(due,taskRow),due.length);
 if(journal.length)result+=section("Journal",rows(journal,contextRow),journal.length);
 if(created.length)result+=section("Created on this day",rows(created,contextRow),created.length);
 return result
}

function renderHome(){
 var filter=miniDateForTool("home");
 if(filter)return renderDeskForDate(filter);
 var view=state.ui.view,tasks=list("task"),events=list("event");
 if(view==="inbox"){var inbox=tasks.filter(inInbox);return pageHeader("Inbox","Tasks waiting to be processed.",'<button class="button primary" data-act="create" data-type="task">'+ic("plus",15)+' New task</button>',"DESK")+ (inbox.length?rows(inbox,taskRow):empty("inbox","Your inbox is clear","Captured tasks waiting for a decision will appear here."))}
 if(view==="recent"){var all=(state.ui.recent||[]).map(get).filter(function(e){return e&&!e.trashed&&!e.archived});return pageHeader("Recently opened","Jump back into the things you've been working on.","","DESK")+(all.length?rows(all,contextRow):empty("clock","Nothing opened yet","Open an event, note, or project to see it here."))}
 if(view==="starred"){var stars=list().filter(function(e){return e.starred});return pageHeader("Starred","Things you keep close.","","DESK")+(stars.length?'<div class="card-grid">'+stars.map(entityCard).join("")+'</div>':empty("star","Nothing starred yet","Star items from their detail pages."))}
 var d=today(),due=tasks.filter(function(e){return !e.completed&&e.dueDate&&e.dueDate<=d}).sort(byDue);
 var todaysEvents=events.filter(function(e){return e.date===d}).sort(function(a,b){return a.time.localeCompare(b.time)});
 var upcoming=events.filter(function(e){return e.date>d}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time)}).slice(0,3);
 var active=(state.ui.recent||[]).map(get).filter(function(e){return e&&["project","event","notebook","journal"].includes(e.type)&&!e.trashed}).slice(0,4);
 var j=list("journal").find(function(x){return x.date===d&&x.journalBookId===state.ui.defaultJournalId});
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
function journalPageMenu(book){
 if(!book||book.trashed)return "";
 return '<div class="journal-page-menu">'+
 '<button class="button journal-page-options" data-act="journal-options" data-id="'+esc(book.id)+'" type="button" aria-haspopup="menu" aria-expanded="false" title="Journal options" aria-label="Options for '+esc(objTitle(book))+'">'+ic("more",18)+'</button>'+
 '<div class="journal-menu-popover" role="menu" aria-label="Journal options" hidden>'+
 '<button type="button" role="menuitem" class="journal-menu-choice" data-act="journal-rename" data-id="'+esc(book.id)+'">'+ic("pen",16)+' Rename journal</button>'+
 '<button type="button" role="menuitem" class="journal-menu-choice danger" data-act="journal-delete" data-id="'+esc(book.id)+'">'+ic("trash",16)+' Delete journal</button>'+
 '</div></div>'
}
function renderJournal(){
 var view=state.ui.view||"",bookId=journalBookForView(view),book=bookId?get(bookId):null;
 var entries=journalEntriesInScope(bookId).sort(function(a,b){return b.date.localeCompare(a.date)||b.createdAt-a.createdAt});
 var date=view.startsWith("day:")?view.slice(4):view==="today"?today():null;
 if(date){
  entries=entries.filter(function(e){return e.date===date});
  var dayHeading=humanDay(date,{weekday:"long",month:"long",day:"numeric",year:"numeric"});
  var createAction='<button class="button primary" data-act="journal-create-date" data-date="'+esc(date)+'" data-book="'+esc(bookId||state.ui.defaultJournalId)+'">'+ic("pen",15)+' Write entry</button>';
  return pageHeader(dayHeading,book?objTitle(book):"All journals",createAction+journalPageMenu(book),"JOURNAL")+
   (entries.length?entries.map(function(e){
    return '<article class="journal-entry"><div class="entry-date">'+esc(objTitle(get(e.journalBookId)||{title:"Journal"}))+'</div>'+
     '<h3>'+esc(e.title||"Journal entry")+'</h3><p>'+esc(trim(stripHtml(e.html),260))+'</p>'+
     '<button class="panel-link" data-act="open" data-id="'+e.id+'" style="margin-top:10px">Open entry '+ic("chevron-right",12)+'</button></article>'
   }).join(""):empty("book-open","No entry for this day","You can start writing for this date."))+
   (!entries.length?"":'<div style="margin-top:13px">'+createAction+'</div>');
 }
 if(view.startsWith("month:"))entries=entries.filter(function(e){return monthKey(e.date)===view.slice(6)});
 var title=view==="all"||view==="timeline"?"All entries":book?objTitle(book):"Journal";
 if(view.startsWith("month:"))title=prettyMonth(view.slice(6));
 return pageHeader(title,"Your days, collected automatically.",
  '<button class="button" data-act="journal-today">'+ic("pen",15)+" Today's entry</button>"+journalPageMenu(book),"JOURNAL")+
  (entries.length?entries.map(function(e){
   return '<article class="journal-entry"><div class="entry-date">'+esc(humanDay(e.date,{weekday:"long",month:"long",day:"numeric",year:"numeric"}))+
    (bookId?"":' · '+esc(objTitle(get(e.journalBookId)||{title:"Journal"})))+'</div>'+
    '<h3>'+esc(e.title||"Journal entry")+'</h3>'+
    '<p>'+esc(trim(stripHtml(e.html),260))+'</p>'+
    '<button class="panel-link" data-act="open" data-id="'+e.id+'" style="margin-top:10px">Open entry '+ic("chevron-right",12)+'</button></article>'
  }).join(""):empty("book-open","No entries yet","Your journal entries will appear here automatically."));
}
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
function areaTaskAdd(area){
 return '<div class="inline-add area-quick"><span>'+ic("plus",16)+'</span><input id="area-quick" placeholder="Add a task in '+esc(objTitle(area))+'…" aria-label="Add a task in this area"><button data-act="area-quick" data-id="'+esc(area.id)+'">Add</button></div>'
}
function renderArea(area){
 if(!area||area.type!=="area")return pageHeader("Area not found","The area might have been removed.","","PLANNER");
 var allProjects=list("project").filter(function(e){return inArea(e,area)}).sort(byRecent);
 var allTasks=list("task").filter(function(e){return inArea(e,area)}).sort(byDue);
 var projects=allProjects.filter(function(e){return !categoryOf(e)});
 var tasks=allTasks.filter(function(e){return !categoryOf(e)});
 var categories=categoriesIn(area);
 var pending=allTasks.filter(function(t){return !t.completed}).length;
 var actions='<button class="button" data-act="quick-toggle-entity" data-id="'+esc(area.id)+'">'+ic(quickHas({kind:"entity",id:area.id})?"pinfill":"pin",15)+' '+(quickHas({kind:"entity",id:area.id})?"Unpin from Home":"Pin to Home")+'</button>'+
 '<button class="button" data-act="rename-area" data-id="'+esc(area.id)+'">'+ic("pen",15)+' Rename</button>'+
 '<button class="button" data-act="create-category" data-area="'+esc(area.id)+'">'+ic("plus",15)+' Category</button>'+
 '<button class="button" data-act="create" data-type="project" data-context="'+esc(area.id)+'">'+ic("plus",15)+' Project</button>'+
 '<button class="button primary" data-act="create" data-type="task" data-context="'+esc(area.id)+'">'+ic("plus",15)+' Task</button>';
 var overview='<div class="area-summary"><span>'+ic("folder",15)+' '+allProjects.length+' project'+(allProjects.length===1?"":"s")+'</span><span>'+ic("check-circle",15)+' '+pending+' open task'+(pending===1?"":"s")+'</span></div>';
 var out=pageHeader(objTitle(area),"Choose a category to narrow your view. Work without a category stays below.",actions,"PLANNER / AREA")+overview;
 if(categories.length){
  out+=section("Categories",'<div class="category-grid">'+categories.map(function(c){
   var cp=allProjects.filter(function(e){return inCategory(e,c)}).length;
   var ct=allTasks.filter(function(e){return inCategory(e,c)&&!e.completed}).length;
   return '<button class="category-card" data-act="category-open" data-id="'+esc(c.id)+'">'+
    '<span class="category-icon">'+ic("folder",19)+'</span><span class="category-card-name">'+esc(objTitle(c))+'</span>'+
    '<span class="category-card-meta">'+cp+' project'+(cp===1?"":"s")+' · '+ct+' open task'+(ct===1?"":"s")+'</span>'+ic("chevron-right",15)+'</button>'
  }).join("")+'</div>',categories.length)
 }
 if(!categories.length)out+=section("Categories",'<div class="area-hint">No categories yet. Create one whenever you need a more focused view.</div>',0);
 out+=section(categories.length?"Projects without a category":"Projects",projects.length?'<div class="card-grid">'+projects.map(entityCard).join("")+'</div>':empty("folder","No uncategorized projects","Projects assigned to categories can be found by opening the category."),projects.length);
 out+=section(categories.length?"Tasks without a category":"Other tasks",'<div class="panel area-task-panel">'+
  (tasks.length?tasks.filter(function(e){return !projectOf(e)}).map(taskRow).join("")+
  tasks.filter(function(e){return !!projectOf(e)}).map(taskRow).join(""):'<p class="area-hint">No uncategorized tasks. Create a task here, or open a category.</p>')+
  areaTaskAdd(area)+'</div>',tasks.length);
 return out
}
function categoryTaskAdd(category){
 return '<div class="inline-add area-quick"><span>'+ic("plus",16)+'</span>'+
 '<input id="category-quick" placeholder="Add a task in '+esc(objTitle(category))+'…" aria-label="Add a task in this category">'+
 '<button data-act="category-quick" data-id="'+esc(category.id)+'">Add</button></div>'
}
function renderCategory(category){
 if(!category||category.type!=="category"||category.trashed)return pageHeader("Category not found","The category may have been removed.","","PLANNER");
 var area=get(category.areaId);
 if(!area||area.type!=="area")return pageHeader("Area not found","The parent area may have been removed.","","PLANNER");
 var projects=list("project").filter(function(e){return inCategory(e,category)}).sort(byRecent);
 var tasks=list("task").filter(function(e){return inCategory(e,category)}).sort(byDue);
 var direct=tasks.filter(function(e){return !projectOf(e)}),within=tasks.filter(function(e){return !!projectOf(e)});
 var pending=tasks.filter(function(e){return !e.completed}).length;
 var actions='<button class="button" data-act="quick-toggle-entity" data-id="'+esc(category.id)+'">'+ic(quickHas({kind:"entity",id:category.id})?"pinfill":"pin",15)+' '+(quickHas({kind:"entity",id:category.id})?"Unpin":"Pin to Home")+'</button>'+
 '<button class="button" data-act="rename-category" data-id="'+esc(category.id)+'">'+ic("pen",15)+' Rename</button>'+
 '<button class="button" data-act="delete-category" data-id="'+esc(category.id)+'">'+ic("trash",15)+' Remove</button>'+
 '<button class="button" data-act="create" data-type="project" data-context="'+esc(category.id)+'">'+ic("plus",15)+' Project</button>'+
 '<button class="button primary" data-act="create" data-type="task" data-context="'+esc(category.id)+'">'+ic("plus",15)+' Task</button>';
 return '<div class="backline"><button data-act="area-open" data-id="'+esc(area.id)+'">'+ic("arrow",16)+' '+esc(objTitle(area))+'</button> <span>/</span> <span>'+esc(objTitle(category))+'</span></div>'+
 pageHeader(objTitle(category),"Only the projects and tasks in this category.",actions,"PLANNER / "+objTitle(area))+
 '<div class="area-summary"><span>'+ic("folder",15)+' '+projects.length+' project'+(projects.length===1?"":"s")+'</span>'+
 '<span>'+ic("check-circle",15)+' '+pending+' open task'+(pending===1?"":"s")+'</span></div>'+
 section("Projects",projects.length?'<div class="card-grid">'+projects.map(entityCard).join("")+'</div>':empty("folder","No projects here yet","A project added here automatically belongs to "+objTitle(area)+" · "+objTitle(category)+"."),projects.length)+
 section("Other tasks",'<div class="panel area-task-panel">'+
 (direct.length?direct.map(taskRow).join(""):'<p class="area-hint">Create a task here and it will automatically belong to this category.</p>')+
 categoryTaskAdd(category)+'</div>',direct.length)+
 (within.length?section("Tasks in projects",'<div class="panel area-task-panel">'+within.map(taskRow).join("")+'</div>',within.length):"")
}
function renderAllProjects(){
 var projects=list("project").sort(byRecent),areas=list("area");
 var out=pageHeader("All projects","Projects remain findable regardless of their area.",
 '<button class="button primary" data-act="create" data-type="project">'+ic("plus",15)+' New project</button>',"PLANNER");
 for(var a of areas){var group=projects.filter(function(p){return inArea(p,a)});if(group.length)out+=section(objTitle(a),'<div class="card-grid">'+group.map(entityCard).join("")+'</div>',group.length)}
 var unassigned=projects.filter(function(p){return !areaOf(p)});
 if(unassigned.length)out+=section("Without an area",'<div class="card-grid">'+unassigned.map(entityCard).join("")+'</div>',unassigned.length);
 if(!projects.length)out+=empty("folder","No projects yet","A project can begin as just a title.","New project","project");
 return out;
}
function renderPlannerDate(date){
 var v=state.ui.view,tasks=list("task"),projects=list("project"),context="To do";
 if(v.startsWith("area:")){
  var a=get(v.slice(5));if(a){context=objTitle(a);tasks=tasks.filter(function(t){return inArea(t,a)});projects=projects.filter(function(p){return inArea(p,a)})}
 }else if(v.startsWith("category:")){
  var c=get(v.slice(9));if(c){context=objTitle(c);tasks=tasks.filter(function(t){return inCategory(t,c)});projects=projects.filter(function(p){return inCategory(p,c)})}
 }else if(v==="projects")context="Projects";
 var due=v==="projects"?[]:tasks.filter(function(t){return t.dueDate===date}).sort(byDue);
 var createdTasks=v==="projects"?[]:tasks.filter(function(t){return createdDate(t)===date&&!due.some(function(x){return x.id===t.id})}).sort(byRecent);
 var createdProjects=projects.filter(function(p){return createdDate(p)===date}).sort(byRecent);
 var out=calendarDateHeader("To do",date,"Tasks due or created on this date · "+context,"");
 if(due.length)out+=section("Due on this day",rows(due,taskRow),due.length);
 if(createdTasks.length)out+=section("Tasks created on this day",rows(createdTasks,taskRow),createdTasks.length);
 if(createdProjects.length)out+=section("Projects created on this day",'<div class="card-grid">'+createdProjects.map(entityCard).join("")+'</div>',createdProjects.length);
 if(!due.length&&!createdTasks.length&&!createdProjects.length)out+=empty("calendar","No work recorded for this date","Select another day or clear the date to return to your planner.");
 return out
}

function renderPlanner(){
 var filter=miniDateForTool("todo");if(filter)return renderPlannerDate(filter);
 var view=state.ui.view,all=list("task"),items;
 if(view.startsWith("category:"))return renderCategory(get(view.slice(9)));
 if(view.startsWith("area:"))return renderArea(get(view.slice(5)));
 if(view==="projects")return renderAllProjects();
 if(view==="today")items=all.filter(function(e){return !e.completed&&e.dueDate&&e.dueDate<=today()}).sort(byDue);
 else if(view==="inbox")items=all.filter(inInbox);
 else if(view==="upcoming")items=all.filter(function(e){return !e.completed&&e.dueDate>today()}).sort(byDue);
 else if(view==="completed")items=all.filter(function(e){return e.completed}).sort(byRecent);
 else items=all.sort(byRecent);
 var names={today:"Today",inbox:"Inbox",upcoming:"Upcoming",completed:"Completed",all:"All tasks"},title=names[view]||"To do";
 return pageHeader(title,view==="today"?"Focus on what needs action.":"Tasks belong here, even when created elsewhere.",
 '<button class="button" data-act="create" data-type="project">'+ic("folder",15)+' Project</button><button class="button primary" data-act="create" data-type="task">'+ic("plus",15)+' Task</button>',"PLANNER")+
 (items.length?'<div class="panel" style="max-width:840px;padding:8px 20px">'+items.map(taskRow).join("")+
 (view!=="completed"?'<div class="inline-add"><span>'+ic("plus",16)+'</span><input id="planner-quick" placeholder="Add a task…" aria-label="Add a task"><button data-act="planner-quick">Add</button></div>':"")+'</div>':
 '<div style="max-width:840px">'+empty("check-circle","Nothing here","Tasks created in a project or area also appear here.","Add task","task")+'</div>')+
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
function renderNotebook(){
 var filter=miniDateForTool("notes");
 if(filter){
  var notes=notesForView().filter(function(n){return createdDate(n)===filter}).sort(byRecent);
  var books=state.ui.view==="all"?list("notebook").filter(function(n){return createdDate(n)===filter}):[];
  var out=calendarDateHeader("Notebook",filter,"Notes created on this date · "+(state.ui.view.startsWith("book:")?objTitle(get(state.ui.view.slice(5))||{title:"Notebook"}):"Current notebook view"),"");
  if(notes.length)out+=section("Notes",'<div class="card-grid">'+notes.map(entityCard).join("")+'</div>',notes.length);
  if(books.length)out+=section("Notebooks created",'<div class="card-grid">'+books.map(entityCard).join("")+'</div>',books.length);
  return notes.length||books.length?out:out+empty("note","No notes created on this day","Choose another date or clear the selection.");
 }
 var v=state.ui.view,notebooks=list("notebook"),notes=notesForView().sort(byRecent),heading="All notes",sub="Every note is findable, wherever it was written.";
 if(v==="starred")heading="Starred notes";
 if(v==="from-events"){heading="Notes from Calendar";sub="Notes created while looking at an event."}
 if(v==="from-projects"){heading="Notes from To do and Projects";sub="Notes connected to projects and tasks."}
 if(v==="from-journal"){heading="Notes from Journal";sub="Notes linked to journal entries."}
 if(v.startsWith("book:")){var book=get(v.slice(5));heading=book?book.title:"Notebook";sub="A familiar place for your notes."}
 var actions='<button class="button" data-act="create" data-type="notebook">'+ic("notebook",15)+' Notebook</button><button class="button primary" data-act="create" data-type="note">'+ic("plus",15)+' Note</button>';
 var intro=(v==="all"&&notebooks.length?section("Notebook",'<div class="card-grid">'+notebooks.map(entityCard).join("")+'</div>',notebooks.length):"");
 return pageHeader(heading,sub,actions,"NOTEBOOKS")+intro+section(v==="all"?"Notes":"Contents",notes.length?'<div class="card-grid">'+notes.map(entityCard).join("")+'</div>':empty("note","Nothing written here yet","Write something, even if you don't know where it belongs.","Add note","note"),notes.length)
}
function resourcesForView(){var v=state.ui.view,arr=list("resource");
 if(v==="archive")return state.entities.filter(function(e){return e.archived&&!e.trashed});
 if(v==="trash")return state.entities.filter(function(e){return e.trashed&&!(e.type==="journal"&&e.trashedWithJournal&&get(e.trashedWithJournal)&&get(e.trashedWithJournal).trashed)});
 if(v==="unsorted")return arr.filter(function(e){return !e.folderId&&!meaningfulContext(e)&&!isBookmark(e)});
 if(v==="bookmarks")return arr.filter(isBookmark);
 if(v==="files")return arr.filter(function(e){return !!e.blobId||!!e.fileName||e.resourceKind==="document"});
 if(v==="starred")return arr.filter(function(e){return e.starred});
 if(v==="from-events")return arr.filter(function(e){return sources(e).some(function(p){return p.type==="event"})});
 if(v==="from-projects")return arr.filter(function(e){return sources(e).some(function(p){return p.type==="project"||p.type==="task"})});
 if(v.startsWith("kind:")){var k=v.slice(5),groups={links:["link","article","social","book","movie","comic","music","podcast"],documents:["document"],images:["image"],videos:["video"],other:["other"]};return arr.filter(function(x){return (groups[k]||[]).includes(x.resourceKind)})}
 if(v.startsWith("folder:"))return arr.filter(function(e){return e.folderId===v.slice(7)});
 return arr
}
function renderLibrary(){
 var filter=miniDateForTool("resources");
 if(filter){
  var saved=resourcesForView().filter(function(x){return createdDate(x)===filter}).sort(byRecent);
  var collections=state.ui.view==="all"?list("folder").filter(function(x){return createdDate(x)===filter}):[];
  var out=calendarDateHeader("Resources",filter,"Resources saved or created on this date · Current Resources view","");
  if(saved.length)out+=section("Saved items",'<div class="card-grid">'+saved.map(function(e){return e.type==="resource"?resourceCard(e):entityCard(e)}).join("")+'</div>',saved.length);
  if(collections.length)out+=section("Collections created",'<div class="card-grid">'+collections.map(entityCard).join("")+'</div>',collections.length);
  return saved.length||collections.length?out:out+empty("library","Nothing saved on this day","Choose another date or clear the selection.");
 }
 var v=state.ui.view,all=resourcesForView().sort(byRecent),title="All items",sub="Keep resources, not the work of maintaining a library.";
 if(v==="unsorted"){title="Unsorted";sub="Only things without a meaningful context appear here."}
 if(v==="bookmarks"){title="Bookmarks";sub="Links you saved, whether or not they belong to a project or folder."}
 if(v==="files"){title="Files & documents";sub="All your files and attached documents, regardless of where they belong."}
 if(v==="starred")title="Starred";
 if(v==="from-events"){title="From Calendar";sub="Files and references attached to calendar events."}
 if(v==="from-projects"){title="From To do and Projects";sub="Resources supporting your work."}
 if(v==="archive"){title="Archive";sub="Out of sight, but not forgotten."}
 if(v==="trash"){title="Trash";sub="Restore or permanently remove an item."}
 if(v.startsWith("kind:")){var filter=LIBRARY_TYPES.find(function(x){return x.id===v.slice(5)});title=filter?filter.name:"Resources"}
 if(v.startsWith("folder:")){var f=get(v.slice(7));title=f?objTitle(f):"Collection"}
 var actions=(v==="trash"||v==="archive")?"":'<button class="button" data-act="create" data-type="folder">'+ic("folder",15)+' Collection</button><button class="button primary" data-act="create" data-type="resource">'+ic("plus",15)+' Save anything</button>';
 var folderView=v==="all"?list("folder").length?"<div class=\"card-grid\">"+list("folder").map(entityCard).join("")+"</div>":"":"";
 var normalCards=all.map(function(e){
  if(v==="trash"&&e.type==="journalbook"){
   var linked=state.entities.filter(function(x){return x.type==="journal"&&x.trashed&&x.trashedWithJournal===e.id}).length;
   return '<article class="item-card journal-trash-card"><div class="card-top">'+ic("book-open",17)+' Journal</div>'+
    '<div class="card-title">'+esc(objTitle(e))+'</div><div class="card-excerpt">'+linked+' entr'+(linked===1?"y":"ies")+' in Trash</div>'+
    '<div class="journal-trash-actions"><button class="button primary" data-act="restore-item" data-id="'+esc(e.id)+'">Restore journal</button>'+
    '<button class="button" data-act="delete-forever" data-id="'+esc(e.id)+'">Delete forever</button></div></article>'
  }
  return e.type==="resource"?resourceCard(e):entityCard(e)
 }).join("");
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
function routineDetail(e){
 var steps=Array.isArray(e.routineSteps)?e.routineSteps:[],day=miniDateForTool("routines")||today();
 var logged=routineStepsForDate(e,day),done=steps.filter(function(step){return logged.includes(step.id)}).length;
 return '<div class="detail-section routine-detail"><h3>Checklist · '+esc(humanDay(day))+
  '<span class="routine-completed">'+done+'/'+steps.length+'</span></h3>'+
  (steps.length?'<div class="routine-steps">'+steps.map(function(st){
   var yes=logged.includes(st.id);
   return '<div class="routine-step"><button class="habit-check'+(yes?" done":"")+'" data-act="routine-step-toggle" data-id="'+esc(e.id)+'" data-step="'+esc(st.id)+'" data-date="'+day+'" title="'+(yes?"Uncheck":"Complete step")+'">'+(yes?ic("check",16):"")+'</button>'+
    '<span'+(yes?' class="routine-step-done"':"")+'>'+esc(st.text)+'</span>'+
    '<button class="routine-remove-step" data-act="routine-step-remove" data-id="'+esc(e.id)+'" data-step="'+esc(st.id)+'" title="Remove step" aria-label="Remove step">'+ic("x",14)+'</button></div>'
  }).join("")+'</div>':'<p class="area-hint">Add your first step to make this a reusable checklist.</p>')+
  '<div class="inline-add"><span>'+ic("plus",16)+'</span><input id="routine-new-step" placeholder="Add a step…" aria-label="New step"><button data-act="routine-step-add" data-id="'+esc(e.id)+'">Add</button></div>'+
  (done?'<button class="button routine-reset" data-act="routine-reset" data-id="'+esc(e.id)+'" data-date="'+day+'">Reset this run</button>':"")+
 '</div>'+
 '<div class="detail-section"><h3>Notes</h3><textarea class="plain-editor" data-edit="body" placeholder="Anything you want to remember about this routine…">'+esc(e.body)+'</textarea></div>'
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
  parts+=files.length?rows(files,resourceRow):empty("folder","Empty collection","Save or add resources here.");
  parts+='<div class="context-actions"><button class="button" data-act="create" data-type="resource" data-context="'+e.id+'">'+ic("plus",14)+' Save resource</button></div>';
  }else{
  if(e.type==="goal"){
   var value=Math.max(0,Math.min(100,Number(e.goalProgress)||0));
   parts+='<div class="detail-section"><h3>Progress</h3><div class="goal-progress-large"><div class="goal-meter"><span style="width:'+value+'%"></span></div><strong>'+value+'%</strong></div></div>'+
    '<div class="detail-section"><h3>About this goal</h3><textarea class="plain-editor" data-edit="body" placeholder="What will success look like?">'+esc(e.body)+'</textarea></div>';
  }
  if(e.type==="habit"){
   var done=habitDone(e,today());
   parts+='<div class="habit-detail-check"><button class="habit-check'+(done?" done":"")+'" data-act="habit-toggle" data-id="'+esc(e.id)+'" data-date="'+today()+'">'+(done?ic("check",18):"")+'</button>'+
   '<div><strong>'+(done?"Completed today":"Check in today")+'</strong><small>'+habitStreak(e)+(e.frequency==="weekly"?"-week":"-day")+" streak · "+(Array.isArray(e.habitLog)?e.habitLog.length:0)+" total check-ins"+'</small></div></div>'+
   '<div class="detail-section"><h3>Notes</h3><textarea class="plain-editor" data-edit="body" placeholder="Make this habit easier to keep…">'+esc(e.body)+'</textarea></div>';
  }
  if(e.type==="routine")parts+=routineDetail(e);
  if(e.type==="project")parts+='<div class="detail-section"><h3>About this project</h3><textarea class="plain-editor" data-edit="body" placeholder="Context, current state, or anything useful…">'+esc(e.body)+'</textarea></div>';
  else if(e.type==="event")parts+='<div class="detail-section"><h3>About this event</h3><textarea class="plain-editor" data-edit="body" placeholder="What should you remember about this event?">'+esc(e.body)+'</textarea></div>';
  else if(e.type==="task")parts+='<div class="detail-section"><h3>Details</h3><textarea class="plain-editor" data-edit="body" placeholder="Add details if you need them…">'+esc(e.body)+'</textarea></div>';
 }
 return parts
}
function detailMeta(e){
 var out="";
 if(e.type==="event")out+='<div class="meta-pill">'+ic("calendar",15)+'<input type="date" data-edit="date" value="'+esc(e.date)+'" aria-label="Event date"></div><div class="meta-pill">'+ic("clock",15)+'<input type="time" data-edit="time" value="'+esc(e.time)+'" aria-label="Event time"></div><div class="meta-pill">'+ic("map-pin",15)+'<input type="text" data-edit="location" value="'+esc(e.location)+'" placeholder="Location" aria-label="Location"></div>';
 if(e.type==="task"){
  out+='<div class="meta-pill">'+ic("calendar",15)+'<input type="date" data-edit="dueDate" value="'+esc(e.dueDate)+'" aria-label="Due date"></div>';
  if(inInbox(e))out+='<button class="button" data-act="clear-inbox" data-id="'+e.id+'">'+ic("check",14)+' Keep outside Inbox</button>';
 }
 if(e.type==="journal")out+='<div class="meta-pill">'+ic("calendar",15)+'<input type="date" data-edit="date" value="'+esc(e.date)+'" aria-label="Journal date"></div>';
 if(e.type==="project")out+='<div class="meta-pill">'+ic("layers",15)+'<select data-edit="projectStatus" aria-label="Project status"><option value="active"'+(e.projectStatus==="active"?" selected":"")+'>Active</option><option value="waiting"'+(e.projectStatus==="waiting"?" selected":"")+'>Waiting</option><option value="completed"'+(e.projectStatus==="completed"?" selected":"")+'>Completed</option></select></div>';
 if(e.type==="task"||e.type==="project"){
  var parent=e.type==="task"?projectOf(e):null,via=parent?areaOf(parent):null;
  var label=via?"Via "+objTitle(parent)+" · "+objTitle(via):"No area";
  out+='<div class="meta-pill">'+ic("layers",15)+'<select data-edit="areaId" aria-label="Area" title="Area">'+
   '<option value="">'+esc(label)+'</option>'+
   list("area").map(function(a){return '<option value="'+esc(a.id)+'"'+(e.areaId===a.id?' selected':"")+'>'+esc(objTitle(a))+'</option>'}).join("")+'</select></div>';
 }
 if(e.type==="task"||e.type==="project"){
  var a=areaOf(e),cat=categoryOf(e),parentProject=e.type==="task"?projectOf(e):null;
  if(a){
   var inherited=cat&&!e.categoryId&&parentProject;
   var label=inherited?"Via "+objTitle(parentProject)+" · "+objTitle(cat):"No category";
   out+='<div class="meta-pill">'+ic("folder",15)+'<select data-edit="categoryId" aria-label="Category" title="Category">'+
    '<option value="">'+esc(label)+'</option>'+
    categoriesIn(a).map(function(c){return '<option value="'+esc(c.id)+'"'+(e.categoryId===c.id?' selected':"")+'>'+esc(objTitle(c))+'</option>'}).join("")+
    '</select></div>'
  }
 }
 if(e.type==="goal"){
  out+='<div class="meta-pill">'+ic("target",15)+'<select data-edit="goalStatus" aria-label="Goal status">'+
   ['active','paused','achieved'].map(function(v){return '<option value="'+v+'"'+(e.goalStatus===v?" selected":"")+'>'+
    (v==="active"?"Active":v==="paused"?"On hold":"Achieved")+'</option>'}).join("")+'</select></div>'+
   '<div class="meta-pill">'+ic("calendar",15)+'<input type="date" data-edit="targetDate" value="'+esc(e.targetDate||"")+'" aria-label="Target date"></div>'+
   '<div class="meta-pill">'+ic("target",15)+'<input type="number" min="0" max="100" step="5" data-edit="goalProgress" value="'+Math.max(0,Math.min(100,Number(e.goalProgress)||0))+'" aria-label="Progress percentage"> %</div>'
 }
 if(e.type==="habit"||e.type==="routine")out+='<div class="meta-pill">'+ic("repeat",15)+'<select data-edit="frequency" aria-label="Frequency">'+
  '<option value="daily"'+(e.frequency==="daily"?" selected":"")+'>Daily</option>'+
  '<option value="weekly"'+(e.frequency==="weekly"?" selected":"")+'>Weekly</option></select></div>';
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
 var area=["task","project"].includes(e.type)?areaOf(e):null;
 var areaLink=area?'<div class="related-context">'+ic(areaIcon(area),15)+'<button data-act="navigate" data-tool="planner" data-view="area:'+esc(area.id)+'">'+esc(objTitle(area))+'</button></div>':"";
 var s='<div class="panel"><h3>Context</h3>'+areaLink+
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
 '<button class="icon-button'+(quickHas({kind:"entity",id:e.id})?' quick-pinned':'')+'" data-act="quick-toggle-entity" data-id="'+e.id+'" title="'+(quickHas({kind:"entity",id:e.id})?'Remove from Home Quick Access':'Pin to Home Quick Access')+'" aria-label="Pin or unpin in Desk">'+ic(quickHas({kind:"entity",id:e.id})?"pinfill":"pin",17)+'</button>'+
 '<button class="icon-button'+(state.ui.focusId===e.id?" active":"")+'" data-act="focus-context" data-id="'+e.id+'" title="Work in this context">'+ic("layers",17)+'</button>'+
 '<button class="icon-button" data-act="detail-menu" data-id="'+e.id+'" title="More options">'+ic("more",19)+'</button></div></div>';
 var related=relatedSection(e),showCapture=["event","project","task","note","resource","journal","goal","habit","routine"].includes(e.type);
 var detail='<div class="detail-root">'+back+head+detailMeta(e)+'<div class="detail-columns"><div class="detail-core">'+detailMain(e)+
 (related?related:"")+(showCapture?'<div class="detail-section"><h3>'+ic("plus",15)+' Add to '+esc(objTitle(e))+'</h3>'+captureBox(e)+'</div>':"")+
 '</div><div class="detail-side">'+detailSidebar(e)+'</div></div></div>';
 return detail
}

function renderProjects(){
 var view=state.ui.view||"all",all=list("project").sort(byRecent);
 var filtered=all;
 if(view==="active"||view==="waiting"||view==="completed")filtered=all.filter(function(e){return e.projectStatus===view});
 else if(view==="unassigned")filtered=all.filter(function(e){return !areaOf(e)});
 else if(view.startsWith("area:"))filtered=all.filter(function(e){return inArea(e,get(view.slice(5)))});
 var heading=view==="all"?"Projects":view==="active"?"Active projects":view==="waiting"?"Waiting projects":
  view==="completed"?"Completed projects":view==="unassigned"?"Without an area":
  view.startsWith("area:")?objTitle(get(view.slice(5))||{title:"Area"}):"Projects";
 var date=miniDateForTool("projects");
 if(date){
  var dated=filtered.filter(function(e){return createdDate(e)===date});
  return calendarDateHeader("Projects",date,"Projects created on this date · "+heading,"")+
   (dated.length?'<div class="card-grid">'+dated.map(entityCard).join("")+'</div>':empty("folder-kanban","No projects created on this date","Clear the date to see all projects."))
 }
 var actions='<button class="button primary" data-act="create" data-type="project">'+ic("plus",15)+' Project</button>';
 var out=pageHeader(heading,"All your projects, one click away. Areas remain optional.",actions,"PROJECTS");
 if(view==="all"){
  var active=filtered.filter(function(p){return p.projectStatus==="active"}),waiting=filtered.filter(function(p){return p.projectStatus==="waiting"}),completed=filtered.filter(function(p){return p.projectStatus==="completed"});
  if(active.length)out+=section("Active",'<div class="card-grid">'+active.map(entityCard).join("")+'</div>',active.length);
  if(waiting.length)out+=section("Waiting",'<div class="card-grid">'+waiting.map(entityCard).join("")+'</div>',waiting.length);
  if(completed.length)out+=section("Completed",'<div class="card-grid">'+completed.map(entityCard).join("")+'</div>',completed.length);
 }else if(filtered.length)out+='<div class="card-grid">'+filtered.map(entityCard).join("")+'</div>';
 return filtered.length?out:out+empty("folder-kanban","No projects here yet","Create a project and start working without defining a hierarchy.","New project","project")
}
function bookmarksForView(){
 var items=list("resource").filter(isBookmark),view=state.ui.view||"all";
 if(view==="starred")return items.filter(function(e){return e.starred});
 if(view==="unsorted")return items.filter(function(e){return !e.folderId});
 if(view.startsWith("folder:"))return items.filter(function(e){return e.folderId===view.slice(7)});
 return items
}
function renderBookmarks(){
 var view=state.ui.view||"all",items=bookmarksForView().sort(byRecent);
 var title=view==="starred"?"Starred bookmarks":view==="unsorted"?"Unsorted bookmarks":
  view.startsWith("folder:")?objTitle(get(view.slice(7))||{title:"Collection"}):"Bookmarks";
 var date=miniDateForTool("bookmarks");
 if(date){
  items=items.filter(function(e){return createdDate(e)===date});
  var out=calendarDateHeader("Bookmarks",date,"Bookmarks saved on this day · "+title,"");
  return out+(items.length?'<div class="card-grid">'+items.map(resourceCard).join("")+'</div>':empty("bookmark","No bookmarks from this date","Choose another day or clear the date."))
 }
 var actions='<button class="button primary" data-act="create" data-type="resource">'+ic("plus",15)+' Save link</button>';
 return pageHeader(title,"Every saved link is here, even when related to a project.",actions,"BOOKMARKS")+
 (items.length?'<div class="card-grid">'+items.map(resourceCard).join("")+'</div>':
 empty("bookmark","No bookmarks here yet","Paste a link into Quick capture (Q), or save one here.","Save a link","resource"))
}
function goalListItem(e){
 var progress=Math.max(0,Math.min(100,Number(e.goalProgress)||0)),status=e.goalStatus||"active";
 return '<div class="life-row"><span class="life-row-icon">'+ic("target",18)+'</span>'+
 '<button class="life-row-main" data-act="open" data-id="'+esc(e.id)+'"><strong>'+esc(objTitle(e))+'</strong>'+
 '<small>'+esc(status==="achieved"?"Achieved":status==="paused"?"On hold":e.targetDate?"Target: "+humanDay(e.targetDate):"In progress")+'</small></button>'+
 '<div class="goal-meter" aria-label="'+progress+' percent complete"><span style="width:'+progress+'%"></span></div>'+
 '<span class="life-row-stat">'+progress+'%</span></div>'
}
function renderGoals(){
 var view=state.ui.view||"active",all=list("goal"),items=all.filter(function(e){
  return view==="all"||view==="active"&&e.goalStatus==="active"||view==="achieved"&&e.goalStatus==="achieved"||view==="paused"&&e.goalStatus==="paused"
 }).sort(byRecent),date=miniDateForTool("goals");
 var name={active:"Active goals",all:"All goals",achieved:"Achieved goals",paused:"On hold"}[view]||"Goals";
 if(date){
  items=items.filter(function(e){return createdDate(e)===date||e.targetDate===date});
  return calendarDateHeader("Goals",date,"Goals created or targeted on this date","")+
    (items.length?'<div class="life-list">'+items.map(goalListItem).join("")+'</div>':empty("target","No goals related to this day","Try another date or clear the selection."))
 }
 var actions='<button class="button primary" data-act="create" data-type="goal">'+ic("plus",15)+' Goal</button>';
 return pageHeader(name,"Know what you are working toward. No setup or framework required.",actions,"GOALS")+
 (items.length?'<div class="life-list">'+items.map(goalListItem).join("")+'</div>':empty("target","No goals yet","A goal can start as just a title.","Add goal","goal"))
}
function habitDone(e,date){
 var log=Array.isArray(e.habitLog)?e.habitLog:[];
 if(e.frequency==="weekly"){
  var d=new Date(date+"T12:00:00"),dow=d.getDay();d.setDate(d.getDate()-dow);
  var start=ndate(d),end=offsetDay(start,6);
  return log.some(function(x){return x>=start&&x<=end})
 }
 return log.includes(date)
}
function habitStreak(e){
 var count=0;
 if(e.frequency==="weekly"){
  var d=new Date(today()+"T12:00:00");d.setDate(d.getDate()-d.getDay());
  for(var k=0;k<52;k++){var key=ndate(d);if(!habitDone(e,key))break;count++;d.setDate(d.getDate()-7)}
 }else{
  for(var j=0;j<365;j++){if(!habitDone(e,offsetDay(today(),-j)))break;count++}
 }
 return count
}
function habitRow(e,date){
 var complete=habitDone(e,date);
 return '<div class="life-row">'+
 '<button class="habit-check'+(complete?" done":"")+'" data-act="habit-toggle" data-id="'+esc(e.id)+'" data-date="'+date+'" title="'+(complete?"Undo check-in":"Mark done")+'" aria-label="'+(complete?"Undo "+objTitle(e):"Complete "+objTitle(e))+'">'+
 (complete?ic("check",18):"")+'</button>'+
 '<button class="life-row-main" data-act="open" data-id="'+esc(e.id)+'"><strong>'+esc(objTitle(e))+'</strong>'+
 '<small>'+esc(e.frequency==="weekly"?"Once a week":"Every day")+'</small></button>'+
 '<span class="life-row-stat">'+(complete?"Done":habitStreak(e)+(e.frequency==="weekly"?" week":" day")+" streak")+'</span></div>'
}
function renderHabits(){
 var v=state.ui.view||"today",date=miniDateForTool("habits")||today(),items=list("habit").sort(byRecent);
 var out=pageHeader(v==="all"?"All habits":date===today()?"Habits · Today":"Habits · "+humanDay(date),
 "Check in with one click; no separate tasks to create.",
 '<button class="button primary" data-act="create" data-type="habit">'+ic("plus",15)+' Habit</button>',"HABITS");
 if(miniDateForTool("habits"))out+='<div class="calendar-context-note">Viewing check-ins for '+esc(humanDay(date))+' · <button data-act="sidebar-mini-clear">Clear date</button></div>';
 return out+(items.length?'<div class="life-list">'+items.map(function(e){return habitRow(e,date)}).join("")+'</div>':
 empty("flame","No habits yet","Add a habit and start checking it off.","Add habit","habit"))
}
function routineRunKey(e,date){
 date=date||today();
 if(e&&e.frequency==="weekly"){
  var d=new Date(date+"T12:00:00");d.setDate(d.getDate()-d.getDay());return ndate(d)
 }
 return date
}
function routineStepsForDate(e,date){
 var key=routineRunKey(e,date);
 return e.routineLog&&Array.isArray(e.routineLog[key])?e.routineLog[key]:[]
}
function routineItemRow(e,date){
 var steps=Array.isArray(e.routineSteps)?e.routineSteps:[],done=routineStepsForDate(e,date).length;
 return '<div class="life-row"><span class="life-row-icon">'+ic("list-checks",18)+'</span>'+
 '<button class="life-row-main" data-act="open" data-id="'+esc(e.id)+'"><strong>'+esc(objTitle(e))+'</strong>'+
 '<small>'+steps.length+' step'+(steps.length===1?"":"s")+' · '+(e.frequency==="weekly"?"Weekly":"Daily")+'</small></button>'+
 '<span class="life-row-stat">'+(steps.length?done+"/"+steps.length+" done":"Add steps")+'</span></div>'
}
function renderRoutines(){
 var v=state.ui.view||"today",date=miniDateForTool("routines")||today(),items=list("routine").sort(byRecent);
 if(miniDateForTool("routines"))return calendarDateHeader("Routines",date,"Routines and checklists for this date","")+
 (items.length?'<div class="life-list">'+items.map(function(e){return routineItemRow(e,date)}).join("")+'</div>':
 empty("list-checks","No routines yet","Add one when you need a repeatable checklist."));
 return pageHeader(v==="all"?"All routines":"Routines · Today",
 "Reusable checklists that reset each day. No need to rebuild your tasks.",
 '<button class="button primary" data-act="create" data-type="routine">'+ic("plus",15)+' Routine</button>',"ROUTINES")+
 (items.length?'<div class="life-list">'+items.map(function(e){return routineItemRow(e,date)}).join("")+'</div>':
 empty("list-checks","No routines yet","A routine can begin with a name; add steps as you use it.","Add routine","routine"))
}

function overviewShortcut(label,icon,tool,view,subtitle){
 return '<button class="overview-shortcut" data-act="navigate" data-tool="'+esc(tool)+'" data-view="'+esc(view)+'">'+
  '<span class="overview-shortcut-icon">'+ic(icon,18)+'</span><span class="overview-shortcut-text"><strong>'+esc(label)+'</strong>'+
  (subtitle?'<small>'+esc(subtitle)+'</small>':"")+'</span>'+ic("chevron-right",15)+'</button>'
}
function overviewItemSection(title,items,action,emptyText){
 return section(title,items.length?'<div class="nav-overview-items">'+items.map(contextRow).join("")+'</div>':
  '<div class="nav-overview-empty">'+esc(emptyText||"Nothing here yet.")+'</div>',items.length)+
  (action||"")
}
function renderOverview(){
 var key=state.ui.view||"todo",date=miniDateForTool("overview"),out="";
 var chosen=key==="todo"?"To Do":key==="life"?"My Life":key==="resources"?"Resources":
  key==="filters"?"Filters":key==="tags"?"Tags":key==="pinned"?"Pinned":"Shelf";
 out+=date?calendarDateHeader(chosen,date,"Items related to this day",""):
  pageHeader(chosen,"Everything in this section, already organized for you.","","SHELF");
 function dated(items){return date?items.filter(function(e){return createdDate(e)===date||e.date===date||e.dueDate===date||e.targetDate===date}):items}
 if(key==="todo"){
  out+='<div class="overview-quick-grid">'+
   overviewShortcut("All tasks","check-circle","todo","all","View tasks from every area")+
   overviewShortcut("Projects","folder-kanban","projects","all","Active work and initiatives")+
   overviewShortcut("Routines","list-checks","routines","today","Repeatable procedures")+
   overviewShortcut("Inbox","inbox","home","inbox","Unprocessed work")+'</div>';
  var tasks=dated(list("task").filter(function(e){return !e.completed})).sort(byDue).slice(0,8),
   projects=dated(list("project").filter(function(e){return e.projectStatus==="active"})).sort(byRecent).slice(0,8);
  out+=overviewItemSection("Tasks",tasks,"","No active tasks here yet.");
  out+=overviewItemSection("Active projects",projects,"","No active projects yet.");
  return out
 }
 if(key==="life"){
  out+='<div class="overview-quick-grid">'+
   overviewShortcut("Journal","book-open","journals","journalbook:"+state.ui.defaultJournalId,"Daily entries and reflection")+
   overviewShortcut("Goals","target","goals","active","What you are working toward")+
   overviewShortcut("Habits","flame","habits","today","Keep up your habits")+
   overviewShortcut("All entries","book-open","journals","all","Your complete journal")+'</div>';
  out+=overviewItemSection("Recent entries",dated(list("journal")).sort(function(a,b){return (b.date||"").localeCompare(a.date||"")}).slice(0,5),"","No entries yet.");
  out+=overviewItemSection("Active goals",dated(list("goal").filter(function(e){return e.goalStatus==="active"})).sort(byRecent).slice(0,5),"","No goals yet.");
  return out
 }
 if(key==="resources"){
  out+='<div class="overview-quick-grid">'+
   overviewShortcut("Notebook","notebook","notes","all","Every note, anywhere")+
   overviewShortcut("Bookmarks","bookmark","bookmarks","all","Saved links")+
   overviewShortcut("Files & documents","file","resources","files","Attached and saved files")+
   overviewShortcut("Collections","folder","resources","all","Your organized resources")+'</div>';
  out+=overviewItemSection("Recent resources",dated(list("resource")).sort(byRecent).slice(0,8),"","Nothing saved yet.");
  return out
 }
 if(key==="filters"){
  var filters=[
   ["Links","link","link"],["Notes","note","note"],["Images","image","image"],
   ["Videos","video","video"],["Documents","document","file"],["Tasks","task","check-circle"],
   ["Events","event","calendar-days"],["Projects","project","folder-kanban"],
   ["Journal entries","journal","book-open"]
  ];
  return out+'<div class="overview-quick-grid">'+filters.map(function(x){
   return overviewShortcut(x[0],x[2],"browse",x[1],"Find every "+x[0].toLowerCase()+" across Shelf")
  }).join("")+'</div>'
 }
 if(key==="tags"){
  var tags=navTags();
  return out+(tags.length?'<div class="overview-tag-grid">'+tags.map(function(t){
   return '<button data-act="navigate" data-tool="tag" data-view="'+esc(t.label)+'">'+ic("hash",14)+' '+esc(t.label)+
    ' <span>'+t.count+'</span></button>'
  }).join("")+'</div>':empty("hash","No tags yet","Tags from any item will appear here automatically."))
 }
 if(key==="pinned"){
  var pins=quickList();
  return out+(pins.length?'<div class="overview-quick-grid">'+pins.map(function(x){
   return '<button class="overview-shortcut" data-act="quick-open" data-key="'+esc(quickKey(x.ref))+'">'+ic(x.item.icon,18)+
    '<span class="overview-shortcut-text"><strong>'+esc(x.item.label)+'</strong><small>'+esc(x.item.desc)+'</small></span>'+
    ic("chevron-right",15)+'</button>'
  }).join("")+'</div>':empty("pin","Nothing pinned yet","Pin any page to access it directly."))
 }
 return out
}
function browseEntities(kind){
 if(kind==="link")return list("resource").filter(function(e){return !!e.url});
 if(kind==="document")return list("resource").filter(function(e){return e.resourceKind==="document"});
 if(kind==="image"||kind==="video")return list("resource").filter(function(e){return e.resourceKind===kind});
 if(["note","task","event","project","journal","habit","goal","routine"].includes(kind))return list(kind);
 return list()
}
function renderBrowseType(){
 var k=state.ui.view||"all",labels={link:"Links",note:"Notes",image:"Images",video:"Videos",
  document:"Documents",task:"Tasks",event:"Events",project:"Projects",journal:"Journal entries",
  goal:"Goals",habit:"Habits",routine:"Routines"};
 var contents=browseEntities(k).sort(byRecent),date=miniDateForTool("browse");
 if(date)contents=contents.filter(function(e){return createdDate(e)===date||e.date===date||e.dueDate===date});
 var out=date?calendarDateHeader(labels[k]||"All items",date,"Matching items on this date",""):
  pageHeader(labels[k]||"All items","Browse by type across the entire Shelf.","","FILTERS");
 return out+(contents.length?'<div class="card-grid">'+contents.map(function(e){return e.type==="resource"?resourceCard(e):entityCard(e)}).join("")+'</div>':
  empty("filter","Nothing found","Things you create anywhere will appear here automatically."))
}
function renderTagResults(){
 var label=state.ui.view||"",key=label.toLowerCase(),items=list().filter(function(e){
  return (e.tags||[]).some(function(t){return String(t).toLowerCase()===key})
 }).sort(byRecent),date=miniDateForTool("tag");
 if(date)items=items.filter(function(e){return createdDate(e)===date||e.date===date||e.dueDate===date});
 return (date?calendarDateHeader("Tag: #"+label,date,"Tagged things from this day",""):
  pageHeader("#"+label,"Every item with this tag, no matter where it was created.","","TAGS"))+
 (items.length?'<div class="card-grid">'+items.map(function(e){return e.type==="resource"?resourceCard(e):entityCard(e)}).join("")+'</div>':
  empty("hash","Nothing with this tag","This view updates automatically when you tag an item."))
}

function renderWorkspace(){
 var inner;
 if(state.ui.detailId){
  var e=get(state.ui.detailId);if(e)inner=renderDetail(e);else{state.ui.detailId=null;inner=renderHome()}
 }else if(state.ui.tool==="home")inner=renderHome();
 else if(state.ui.tool==="journals")inner=renderJournal();
 else if(state.ui.tool==="calendar")inner=renderCalendar();
 else if(state.ui.tool==="todo")inner=renderPlanner();
 else if(state.ui.tool==="notes")inner=renderNotebook();
 else if(state.ui.tool==="resources")inner=renderLibrary();
 else if(state.ui.tool==="projects")inner=renderProjects();
 else if(state.ui.tool==="bookmarks")inner=renderBookmarks();
 else if(state.ui.tool==="goals")inner=renderGoals();
 else if(state.ui.tool==="habits")inner=renderHabits();
 else if(state.ui.tool==="routines")inner=renderRoutines();
 else if(state.ui.tool==="overview")inner=renderOverview();
 else if(state.ui.tool==="browse")inner=renderBrowseType();
 else if(state.ui.tool==="tag")inner=renderTagResults();
 else inner=renderHome();
 mediaUrls.forEach(function(u){URL.revokeObjectURL(u)});mediaUrls=[];
 workspace.innerHTML=topbar()+'<div class="ws-body">'+inner+'</div>';
 fillPreviews()
}
function paint(){renderRail();renderSidebar();renderWorkspace()}
function go(tool,view,stay){
 var oldTool=tool;tool=canonicalTool(tool,view);
 if(oldTool==="planner"&&view==="projects"||oldTool==="library"&&view==="bookmarks")view="all";
 if(state.ui.sidebarDateFilters)delete state.ui.sidebarDateFilters[tool];
 if(!stay&&state.ui.detailId)state.ui.detailId=null;
 state.ui.detailTrail=[];state.ui.tool=tool;
 state.ui.view=view||({
  home:"today",todo:"today",calendar:"month",notes:"all",
  journals:"journalbook:"+state.ui.defaultJournalId,goals:"active",
  habits:"today",routines:"today",projects:"all",bookmarks:"all",resources:"all"
 }[tool]||"all");
 if(tool==="todo"&&state.ui.view.startsWith("area:"))state.ui.expandedAreaId=state.ui.view.slice(5);
 if(tool==="todo"&&state.ui.view.startsWith("category:")){
  var c=get(state.ui.view.slice(9));if(c)state.ui.expandedAreaId=c.areaId
 }
 save();paint();workspace.scrollTop=0
}
function openEntity(id){var e=get(id);if(!e)return;if(e.type==="area"){go("planner","area:"+e.id);return}if(e.type==="category"){go("planner","category:"+e.id);return}if(e.type==="journalbook"){go("journal","journalbook:"+e.id);return}if(state.ui.detailId&&state.ui.detailId!==id){state.ui.detailTrail=(state.ui.detailTrail||[]).concat(state.ui.detailId).slice(-15)}else if(!state.ui.detailId){state.ui.detailTrail=[];state.ui.lastTool=state.ui.tool;state.ui.lastView=state.ui.view}state.ui.detailId=id;addRecent(id);save();paint();workspace.scrollTop=0}
function back(){if(state.ui.detailTrail&&state.ui.detailTrail.length){state.ui.detailId=state.ui.detailTrail.pop();save();paint();workspace.scrollTop=0;return}state.ui.detailId=null;state.ui.tool=state.ui.lastTool||state.ui.tool;state.ui.view=state.ui.lastView||state.ui.view;save();paint();workspace.scrollTop=0}
function journalToday(date,bookId){
 var day=date||today(),active=state.ui.tool==="journals"?journalBookForView():null;
 var journalId=bookId||active||state.ui.defaultJournalId;
 var book=get(journalId);if(!book||book.trashed||book.type!=="journalbook")journalId=state.ui.defaultJournalId;
 var j=list("journal").find(function(e){return e.date===day&&e.journalBookId===journalId});
 if(!j){j=ent("journal","",{date:day,journalBookId:journalId});state.entities.unshift(j);save()}
 openEntity(j.id)
}
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
 if(type==="task")extra.inbox=!context;
 if(context&&context.type==="notebook"&&type==="note")extra.notebookId=id;
 else if(context&&context.type==="folder"&&type==="resource")extra.folderId=id;
 else if(context&&context.type==="area"&&["task","project"].includes(type))extra.areaId=id;
 else if(context&&context.type==="category"&&["task","project"].includes(type)){extra.areaId=context.areaId;extra.categoryId=context.id}
 else if(id)extra.contextIds=[id];
 var x=ent(type,title,extra);
 state.entities.unshift(x);save();return x;
}
function captureSave(contextId){
 var input=contextId?$("context-capture"):$("home-capture");
 if(!input||!input.value.trim())return;
 var actual=contextId||state.ui.focusId||null,created=captureObject(input.value,actual,activeComposer);
 if(created){activeComposer="auto";paint();toast(typeName(created.type)+" saved"+(actual&&get(actual)?" · linked to "+objTitle(get(actual)):"")+". Also in "+(created.type==="task"?"Planner":created.type==="note"?"Notebook":"Library"))}
}
function primaryType(t){return {home:null,todo:"task",calendar:"event",notes:"note",journals:"journal",goals:"goal",habits:"habit",routines:"routine",projects:"project",bookmarks:"resource",resources:"resource"}[t]}
function openCreate(type,contextId,opts){
 opts=opts||{};if(type==="journal"){journalToday();return}
 if(!contextId&&["task","project"].includes(type)&&["todo","projects"].includes(state.ui.tool)&&state.ui.view.startsWith("category:"))contextId=state.ui.view.slice(9);
 if(!contextId&&["task","project"].includes(type)&&["todo","projects"].includes(state.ui.tool)&&state.ui.view.startsWith("area:"))contextId=state.ui.view.slice(5);
 if(!contextId&&type==="note"&&state.ui.tool==="notes"&&state.ui.view.startsWith("book:"))contextId=state.ui.view.slice(5);
 if(!contextId&&type==="resource"&&["resources","bookmarks"].includes(state.ui.tool)&&state.ui.view.startsWith("folder:"))contextId=state.ui.view.slice(7);
 modalState={mode:"create",type:type,contextId:["area","journalbook"].includes(type)?null:(contextId||state.ui.focusId||null),opts:opts};
 var e=get(modalState.contextId),hint=e?"This will be connected to "+objTitle(e)+".":"No setup needed. You can always organize it later.";
 var title="New "+typeName(type).toLowerCase(),field='<div class="field"><label for="new-title">Title</label><input id="new-title" placeholder="'+(type==="event"?"e.g. Dentist, 2 PM":type==="project"?"e.g. Alpine Park HOA":"Give it a name")+'" required></div>';
 if(type==="note")field='<div class="field"><label for="new-title">Title (optional)</label><input id="new-title" placeholder="Start with an idea…"></div>';
 if(type==="resource")field='<div class="field"><label for="new-url">Paste a URL (or upload a file instead)</label><input id="new-url" placeholder="https://example.com"></div><div class="field"><label for="new-title">Title (optional)</label><input id="new-title" placeholder="Recognized automatically if blank"></div><button class="button" data-act="upload" data-context="'+esc(modalState.contextId||"")+'">'+ic("upload",15)+' Choose a file</button>';
 if(type==="event")field+='<div class="field-row"><div class="field"><label for="new-date">Date</label><input id="new-date" type="date" value="'+esc(opts.date||state.ui.selectedDate||today())+'" required></div><div class="field"><label for="new-time">Time</label><input id="new-time" type="time" value="14:00"></div></div><div class="field"><label for="new-location">Location (optional)</label><input id="new-location" placeholder="Add location"></div>';
 if(type==="task")field+='<div class="field"><label for="new-due">Due date (optional)</label><input id="new-due" type="date" value="'+esc(opts.dueDate||"")+'"></div>';
 if(type==="goal")field+='<div class="field"><label for="new-target">Target date (optional)</label><input id="new-target" type="date"></div><div class="field"><label for="new-body">What does success look like? (optional)</label><textarea id="new-body" rows="3" placeholder="You can add details later."></textarea></div>';
 if(type==="habit")field+='<div class="field"><label for="new-frequency">Repeat</label><select id="new-frequency"><option value="daily">Every day</option><option value="weekly">Once a week</option></select></div>';
 if(type==="routine")field+='<div class="field"><label for="new-frequency">Repeat</label><select id="new-frequency"><option value="daily">Daily</option><option value="weekly">Weekly</option></select></div><div class="field"><label for="new-steps">Steps (optional, one per line)</label><textarea id="new-steps" rows="4" placeholder="Add steps now or when you use the routine."></textarea></div>';
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
 if(type==="task"){extra.dueDate=$("new-due").value||"";extra.inbox=!!(modalState.opts&&modalState.opts.inbox&&!context)}
 if(type==="goal"){extra.targetDate=$("new-target").value||"";extra.body=$("new-body").value.trim();extra.goalStatus="active";extra.goalProgress=0}
 if(type==="habit"){extra.frequency=$("new-frequency").value||"daily";extra.habitLog=[]}
 if(type==="routine"){extra.frequency=$("new-frequency").value||"daily";extra.routineLog={};extra.routineSteps=($("new-steps").value||"").split(/\r?\n/).map(function(x){return x.trim()}).filter(Boolean).map(function(x){return {id:uid(),text:x}})}
 if((type==="note"||type==="project")&&$("new-body")){extra.body=$("new-body").value.trim();if(type==="note")extra.html=extra.body?"<p>"+esc(extra.body).replace(/\n/g,"</p><p>")+"</p>":""}
 if(context)extra.sourceId=context.id;
 if(context&&context.type==="notebook"&&type==="note")extra.notebookId=context.id;
 else if(context&&context.type==="folder"&&type==="resource")extra.folderId=context.id;
 else if(context&&context.type==="area"&&["task","project"].includes(type))extra.areaId=context.id;
 else if(context&&context.type==="category"&&["task","project"].includes(type)){extra.areaId=context.areaId;extra.categoryId=context.id}
 else if(context)extra.contextIds=[context.id];
 var e=ent(type,title,extra);state.entities.unshift(e);save();closeModal();openEntity(e.id);toast(typeName(type)+" created"+(context?" · linked to "+objTitle(context):""))
}
function openCreateCategory(areaId){
 var area=get(areaId);if(!area||area.type!=="area"||area.trashed)return;
 modalState={mode:"create-category",areaId:area.id};
 openModal('<div class="modal-header"><h2>New category</h2><button class="icon-button" data-act="modal-close">'+ic("x",19)+'</button></div>'+
 '<div class="modal-scroll"><p class="modal-help">A simple divider inside '+esc(objTitle(area))+'. Categories cannot contain subcategories.</p>'+
 '<form id="create-category-form"><div class="field"><label for="category-name">Category name</label>'+
 '<input id="category-name" maxlength="100" placeholder="e.g. Support tickets" required></div>'+
 '<div class="modal-buttons"><button type="button" class="button" data-act="modal-close">Cancel</button>'+
 '<button type="submit" class="button primary">'+ic("plus",14)+' Create category</button></div></form></div>');
 $("category-name").focus()
}
function submitCreateCategory(){
 if(!modalState||modalState.mode!=="create-category")return;
 var area=get(modalState.areaId),name=$("category-name")?$("category-name").value.trim():"";if(!area||!name)return;
 if(categoriesIn(area).some(function(c){return c.title.toLowerCase()===name.toLowerCase()})){toast("This category already exists in "+objTitle(area));return}
 var c=ent("category",name,{areaId:area.id});
 state.entities.push(c);state.ui.expandedAreaId=area.id;save();closeModal();go("planner","category:"+c.id);toast("Category created in "+objTitle(area))
}
function closeJournalMenu(restoreFocus){
 var menu=document.querySelector(".journal-menu-popover:not([hidden])");
 if(!menu)return false;
 menu.hidden=true;
 var wrap=menu.closest(".journal-page-menu");
 var trigger=wrap&&wrap.querySelector('[data-act="journal-options"]');
 if(trigger){trigger.setAttribute("aria-expanded","false");if(restoreFocus)trigger.focus()}
 return true
}
function journalOptions(id,trigger){
 var book=get(id);
 if(!book||book.type!=="journalbook"||book.trashed||!trigger)return;
 var wrap=trigger.closest(".journal-page-menu");
 var menu=wrap&&wrap.querySelector(".journal-menu-popover");
 if(!menu)return;
 var opening=menu.hidden;
 closeJournalMenu(false);
 if(!opening)return;
 menu.hidden=false;
 trigger.setAttribute("aria-expanded","true");
 var first=menu.querySelector('[role="menuitem"]');
 if(first)first.focus()
}
function openRenameJournal(id){
 var book=get(id);if(!book||book.type!=="journalbook"||book.trashed)return;
 modalState={mode:"rename-journal",id:book.id};
 openModal('<div class="modal-header"><h2>Rename journal</h2><button class="icon-button" data-act="modal-close" aria-label="Close">'+ic("x",19)+'</button></div>'+
 '<div class="modal-scroll"><form id="rename-journal-form"><div class="field"><label for="journal-name">Journal name</label>'+
 '<input id="journal-name" maxlength="100" required value="'+esc(book.title)+'"></div>'+
 '<div class="modal-buttons"><button type="button" class="button" data-act="modal-close">Cancel</button>'+
 '<button type="submit" class="button primary">Save</button></div></form></div>');
 var field=$("journal-name");if(field){field.focus();field.select()}
}
function submitRenameJournal(){
 if(!modalState||modalState.mode!=="rename-journal")return;
 var book=get(modalState.id),field=$("journal-name"),name=field?field.value.trim():"";
 if(!book||book.type!=="journalbook"||book.trashed||!name)return;
 if(list("journalbook").some(function(x){return x.id!==book.id&&x.title.trim().toLowerCase()===name.toLowerCase()})){
  toast("A journal with this name already exists");return
 }
 book.title=name;touched(book);closeModal();paint();toast("Journal renamed")
}
function deleteJournal(id){
 var book=get(id);if(!book||book.type!=="journalbook"||book.trashed)return;
 var children=state.entities.filter(function(e){return e.type==="journal"&&e.journalBookId===book.id&&!e.trashed});
 if(!confirm("Move '"+objTitle(book)+"' and its "+children.length+" entr"+(children.length===1?"y":"ies")+" to Trash? You can restore the journal and its entries from Trash."))return;
 book.trashed=true;book.archived=false;book.journalDefault=false;
 children.forEach(function(e){e.trashedWithJournal=book.id;e.archivedBeforeJournalTrash=!!e.archived;e.archived=false;e.trashed=true;e.updatedAt=now()});
 var available=list("journalbook"),fallback=available.find(function(x){return x.id===state.ui.defaultJournalId})||available[0];
 if(!fallback){fallback=ent("journalbook","Journal",{journalDefault:true});state.entities.push(fallback)}
 fallback.journalDefault=true;state.ui.defaultJournalId=fallback.id;
 if(state.ui.journalDayBookId===book.id)state.ui.journalDayBookId=fallback.id;
 if(state.ui.detailId&&children.some(function(e){return e.id===state.ui.detailId}))state.ui.detailId=null;
 save();closeModal();go("journal","journalbook:"+fallback.id);
 toast("Journal and entries moved to Trash")
}
function openRenameCategory(id){
 var c=get(id);if(!c||c.type!=="category"||c.trashed)return;
 modalState={mode:"rename-category",id:c.id};
 openModal('<div class="modal-header"><h2>Rename category</h2><button class="icon-button" data-act="modal-close">'+ic("x",19)+'</button></div>'+
 '<div class="modal-scroll"><p class="modal-help">Existing tasks and projects stay connected.</p>'+
 '<form id="rename-category-form"><div class="field"><label for="category-name">Category name</label>'+
 '<input id="category-name" maxlength="100" required value="'+esc(c.title)+'"></div>'+
 '<div class="modal-buttons"><button type="button" class="button" data-act="modal-close">Cancel</button>'+
 '<button type="submit" class="button primary">Save</button></div></form></div>');
 $("category-name").focus();$("category-name").select()
}
function submitRenameCategory(){
 if(!modalState||modalState.mode!=="rename-category")return;
 var c=get(modalState.id),name=$("category-name")?$("category-name").value.trim():"";if(!c||!name)return;
 if(categoriesIn(get(c.areaId)).some(function(x){return x.id!==c.id&&x.title.toLowerCase()===name.toLowerCase()})){toast("This category already exists");return}
 c.title=name;touched(c);closeModal();paint();toast("Category renamed")
}
function deleteCategory(id){
 var c=get(id);if(!c||c.type!=="category")return;
 if(!confirm("Remove category '"+objTitle(c)+"'? Tasks and projects will remain in their Area, without this category."))return;
 state.entities.forEach(function(e){if(e.categoryId===c.id)e.categoryId=null});
 c.trashed=true;state.ui.quickAccess=(state.ui.quickAccess||[]).filter(function(q){return !(q.kind==="entity"&&q.id===c.id)});
 save();closeModal();go("planner","area:"+c.areaId);toast("Category removed · tasks and projects kept")
}
function openRenameArea(id){
 var area=get(id);if(!area||area.type!=="area")return;
 modalState={mode:"rename-area",id:area.id};
 openModal('<div class="modal-header"><h2>Rename area</h2><button class="icon-button" data-act="modal-close">'+ic("x",19)+'</button></div>'+
 '<div class="modal-scroll"><p class="modal-help">The name changes everywhere; projects and tasks remain connected.</p>'+
 '<form id="rename-area-form"><div class="field"><label for="area-name">Name</label>'+
 '<input id="area-name" maxlength="100" required value="'+esc(area.title)+'"></div>'+
 '<div class="modal-buttons"><button type="button" class="button" data-act="modal-close">Cancel</button>'+
 '<button type="submit" class="button primary">Save</button></div></form></div>');
 $("area-name").focus();$("area-name").select()
}
function submitRenameArea(){
 if(!modalState||modalState.mode!=="rename-area")return;
 var area=get(modalState.id),name=$("area-name")?$("area-name").value.trim():"";if(!area||!name)return;
 area.title=name;touched(area);closeModal();paint();toast("Area renamed")
}
function openModal(inner){modalRoot.innerHTML='<div class="modal-backdrop" data-act="modal-close"></div><div class="modal-box" role="dialog" aria-modal="true">'+inner+'</div>';modalRoot.classList.add("open");modalRoot.setAttribute("aria-hidden","false")}
function closeModal(){modalRoot.classList.remove("open");modalRoot.setAttribute("aria-hidden","true");modalRoot.innerHTML="";modalState=null;workingSearch=""}
function newMenu(){
 var t=state.ui.tool;
 var types=[{type:"task",title:"Task",help:"Something to do",icon:"check-circle"},{type:"event",title:"Calendar event",help:"Something on your schedule",icon:"calendar"},{type:"note",title:"Note",help:"Something to write or remember",icon:"note"},{type:"resource",title:"Link or file",help:"Something worth keeping",icon:"link"},{type:"project",title:"Project",help:"Something to work on",icon:"folder-kanban"},{type:"goal",title:"Goal",help:"An outcome to work toward",icon:"target"},{type:"habit",title:"Habit",help:"Something to practice",icon:"flame"},{type:"routine",title:"Routine",help:"A repeatable checklist",icon:"list-checks"},{type:"notebook",title:"Notebook",help:"A place for written things",icon:"notebook"}];
 openModal('<div class="modal-header"><h2>Save anything</h2><button class="icon-button" data-act="modal-close">'+ic("x",19)+'</button></div><div class="modal-scroll"><p class="modal-help">Paste a link or jot down a thought. No setup needed.</p><div class="capture-box" style="margin:0 0 15px"><textarea id="global-capture" placeholder="Write, paste a URL, or type “todo: ” for a task…" aria-label="Save anything"></textarea><div class="capture-actions"><span class="capture-tip" style="margin:0 0 0 7px;flex:1">Enter to save · Shift+Enter for a new line</span><button class="button primary" data-act="global-capture-save">'+ic("plus",14)+' Save</button></div></div><div style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#a3adae;margin:15px 0 8px">OR ADD USING A TOOL</div><div class="menu-list">'+types.map(function(x){return '<button class="menu-choice" data-act="create" data-type="'+x.type+'">'+ic(x.icon,20)+'<span><b style="font-size:12.5px">'+x.title+'</b><br><small>'+x.help+'</small></span>'+ic("chevron-right",16)+'</button>'}).join("")+'</div></div>');
 setTimeout(function(){var t=$("global-capture");if(t)t.focus()},10);
}
function saveGlobalCapture(){var el=$("global-capture");if(!el||!el.value.trim())return;var x=captureObject(el.value,state.ui.focusId||null,"auto");if(!x)return;closeModal();paint();toast(typeName(x.type)+" saved"+(x.sourceId&&get(x.sourceId)?" · linked to "+objTitle(get(x.sourceId)):""))}
function openQuickAdd(){
 modalState={mode:"quick-add"};
 openModal('<div class="modal-header"><h2>Add to Quick Access</h2><button class="icon-button" data-act="modal-close" aria-label="Close">'+ic("x",19)+'</button></div>'+
 '<div class="modal-scroll"><p class="modal-help">Put any destination on your Home. These are shortcuts, not copies or folders.</p>'+
 '<div class="quick-search-field">'+ic("search",18)+'<input id="quick-search" placeholder="Find a project, notebook, Area or page…" autocomplete="off" aria-label="Find destination to pin"></div>'+
 '<div id="quick-results" class="search-results quick-search-results"></div></div>');
 updateQuickResults("");
 var input=$("quick-search");if(input)input.focus()
}
function renderQuickCandidate(q,info){
 if(!info||quickHas(q))return "";
 return '<button class="search-result quick-candidate" data-act="quick-pin-choice" data-kind="'+esc(q.kind)+'"'+
 (q.kind==="entity"?' data-id="'+esc(q.id)+'"':' data-tool="'+esc(q.tool)+'" data-view="'+esc(q.view)+'"')+'>'+
 '<span class="row-icon">'+ic(info.icon,17)+'</span><span><strong>'+esc(info.label)+'</strong><small>'+esc(info.desc)+'</small></span>'+
 '<span class="quick-result-add">'+ic("plus",16)+'</span></button>'
}
function updateQuickResults(q){
 var root=$("quick-results");if(!root)return;
 var textQuery=String(q||"").trim().toLowerCase();
 var pages=QUICK_PAGES.filter(function(p){return (p.label+" "+p.tool).toLowerCase().includes(textQuery)}).map(function(p){return {ref:{kind:"view",tool:p.tool,view:p.view},info:{label:p.label,desc:"Page",icon:p.icon}}});
 var entities=list().filter(function(e){return !e.trashed&&!e.archived&&[e.title,e.body,typeName(e.type),contextName(e),areaOf(e)?objTitle(areaOf(e)):"",categoryOf(e)?objTitle(categoryOf(e)):""].join(" ").toLowerCase().includes(textQuery)})
  .sort(byRecent).slice(0,textQuery?35:12).map(function(e){return {ref:{kind:"entity",id:e.id},info:{label:objTitle(e),desc:e.type==="area"?"Area":e.type==="folder"?"Collection":typeName(e.type),icon:e.type==="area"?areaIcon(e):typeIcon(e)}}});
 var routes=pages.filter(function(x){return !quickHas(x.ref)}).slice(0,16),things=entities.filter(function(x){return !quickHas(x.ref)});
 var content="";
 if(routes.length)content+='<div class="quick-results-heading">PAGES & VIEWS</div>'+routes.map(function(x){return renderQuickCandidate(x.ref,x.info)}).join("");
 if(things.length)content+='<div class="quick-results-heading">YOUR THINGS</div>'+things.map(function(x){return renderQuickCandidate(x.ref,x.info)}).join("");
 if(!content)content='<div class="modal-empty">Nothing else to pin. Try another search.</div>';
 root.innerHTML=content
}
function quickToggleEntity(id){
 var e=get(id);if(!e||e.trashed||e.archived)return;
 var ref={kind:"entity",id:e.id},on=quickHas(ref);
 if(on)quickRemove(quickKey(ref));else quickAdd(ref);
 closeModal();paint();toast(on?"Removed from Home (original kept)":"Pinned "+objTitle(e)+" to Home")
}
function quickToggleCurrent(){
 if(state.ui.detailId){quickToggleEntity(state.ui.detailId);return}
 var ref={kind:"view",tool:state.ui.tool,view:state.ui.view},on=quickHas(ref);
 if(on)quickRemove(quickKey(ref));else quickAdd(ref);
 paint();toast(on?"Shortcut removed from Home":"Page pinned to Home")
}

// Universal capture is deliberately independent of the currently open tool and focus.
var UNIVERSAL_TYPES=[
 {type:"note",label:"Note",icon:"note",where:"Notes"},
 {type:"task",label:"Task",icon:"check-circle",where:"To do · Inbox"},
 {type:"event",label:"Event",icon:"calendar",where:"Calendar"},
 {type:"project",label:"Project",icon:"folder-kanban",where:"Projects"},
 {type:"resource",label:"Link",icon:"link",where:"Bookmarks"},
 {type:"journal",label:"Journal entry",icon:"book-open",where:"Journals"},
 {type:"goal",label:"Goal",icon:"target",where:"Goals"},
 {type:"habit",label:"Habit",icon:"flame",where:"Habits"},
 {type:"routine",label:"Routine",icon:"list-checks",where:"Routines"}
];
function normalizeCaptureUrl(value){
 var text=String(value||"").trim();
 if(/^www\./i.test(text))text="https://"+text;
 if(!/^https?:\/\//i.test(text)&&/^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(text))text="https://"+text;
 return safeUrl(text)
}
function captureIntent(raw){
 var text=String(raw||"").trim(),prefix=text.match(/^(todo|task|tarefa|note|nota|event|evento|appointment|meeting|compromisso|project|projeto|link|bookmark|journal|diary|diário|goal|objetivo|habit|hábito|habito|routine|rotina)\s*:\s*/i);
 var names={todo:"task",task:"task",tarefa:"task",note:"note",nota:"note",event:"event",evento:"event",appointment:"event",meeting:"event",compromisso:"event",project:"project",projeto:"project",link:"resource",bookmark:"resource",journal:"journal",diary:"journal","diário":"journal",goal:"goal",objetivo:"goal",habit:"habit","hábito":"habit",habito:"habit",routine:"routine",rotina:"routine"};
 var body=prefix?text.slice(prefix[0].length).trim():text,auto=prefix?names[prefix[1].toLowerCase()]:normalizeCaptureUrl(body)?"resource":"note";
 return {raw:text,body:body,type:auto,url:normalizeCaptureUrl(body)}
}
function universalDateInfo(text){
 var t=String(text||""),date=today(),time="";
 var match=t.match(/\b20\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])\b/);
 if(match){var candidate=match[0],day=new Date(candidate+"T12:00:00");if(!isNaN(day.getTime())&&ndate(day)===candidate){date=candidate;t=t.replace(match[0]," ")}}
 else{var rel=t.match(/\b(tomorrow|amanhã|amanha|today|hoje)\b/i);
  if(rel){date=/tomorrow|amanh/i.test(rel[0])?offsetDay(today(),1):today();t=t.replace(rel[0]," ")}}
 var tm=t.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/)||t.match(/\b([01]?\d|2[0-3])h([0-5]\d)?\b/i);
 if(tm){time=tm[1].padStart(2,"0")+":"+(tm[2]||"00");t=t.replace(tm[0]," ")}
 return {date:date,time:time,title:t.replace(/\s{2,}/g," ").trim().replace(/^[,@:\s-]+|[,@:\s-]+$/g,"")}
}
function universalHtml(text){return "<p>"+esc(String(text||"")).replace(/\r?\n/g,"</p><p>")+"</p>"}
function universalCapture(raw,chosenType){
 var intent=captureIntent(raw),type=chosenType&&chosenType!=="auto"?chosenType:intent.type;
 var body=intent.body;if(!body){toast("Write something to capture");return null}
 var info=UNIVERSAL_TYPES.find(function(x){return x.type===type});if(!info)return null;
 var first=body.split(/\r?\n/)[0].trim(),rest=body.split(/\r?\n/).slice(1).join("\n").trim(),extra={},title=first;
 if(type==="resource"){
  var url=intent.url;
  if(!url&&/^(https?:\/\/|www\.)/i.test(first))url=normalizeCaptureUrl(first);
  if(!url){toast("Paste an http(s) link to save a bookmark");return null}
  title=hostname(url);extra.url=url;extra.resourceKind=classifyUrl(url)
 }else if(type==="task"){
  title=first;extra.inbox=true;if(rest)extra.body=rest
 }else if(type==="note"){
  title=first.slice(0,85);extra.html=universalHtml(body)
 }else if(type==="project"){
  title=first;if(rest)extra.body=rest
 }else if(type==="goal"){title=first;extra.goalStatus="active";extra.goalProgress=0;if(rest)extra.body=rest
 }else if(type==="habit"){title=first;extra.frequency="daily";extra.habitLog=[];if(rest)extra.body=rest
 }else if(type==="routine"){title=first;extra.frequency="daily";extra.routineLog={};extra.routineSteps=rest.split(/\r?\n/).map(function(x){return x.trim()}).filter(Boolean).map(function(x){return {id:uid(),text:x}});extra.body=""
 }else if(type==="event"){
  var event=universalDateInfo(first);
  title=event.title||first;extra.date=event.date;extra.time=event.time;if(rest)extra.body=rest
 }else if(type==="journal"){
  var bookId=state.ui.defaultJournalId,existing=list("journal").find(function(e){return e.date===today()&&e.journalBookId===bookId});
  if(existing){
   existing.html=(existing.html||"")+universalHtml(body);touched(existing);
   return {item:existing,label:"Added to today's Journal",where:"Journal"}
  }
  title="";extra.date=today();extra.journalBookId=bookId;extra.html=universalHtml(body)
 }
 var item=ent(type,title,extra);
 state.entities.unshift(item);save();
 return {item:item,label:info.label+" saved",where:info.where}
}
function commitUniversalCapture(raw,type){
 var result=universalCapture(raw,type);
 if(!result)return false;
 closeModal();paint();toast(result.label+" · "+result.where);return true
}
function universalTypeOption(x,active){
 return '<button class="universal-type'+(active?" active":"")+'" type="button" data-act="universal-type" data-type="'+x.type+'" aria-pressed="'+(active?"true":"false")+'">'+ic(x.icon,15)+' '+esc(x.label)+'</button>'
}
function openUniversalCapture(prefill){
 modalState={mode:"universal",captureType:"auto"};
 openModal('<div class="modal-header"><h2>Quick capture</h2><button class="icon-button" data-act="modal-close" aria-label="Close">'+ic("x",19)+'</button></div>'+
 '<div class="modal-scroll"><div class="universal-capture-box"><textarea id="universal-capture" rows="4" placeholder="A thought, a link, todo: a task, event: an appointment…" aria-label="Capture anything">'+esc(prefill||"")+'</textarea>'+
 '<div class="universal-capture-hint">Automatically organized by type. No area or folder required.</div>'+
 '<div class="universal-types"><button class="universal-type active" type="button" data-act="universal-type" data-type="auto" aria-pressed="true">'+ic("sparkle",15)+' Auto</button>'+
 UNIVERSAL_TYPES.map(function(x){return universalTypeOption(x,false)}).join("")+'</div>'+
 '<div id="universal-prediction" class="universal-prediction"></div>'+
 '<div class="universal-actions"><button class="button" data-act="universal-file">'+ic("attach",15)+' Add file</button>'+
 '<span class="universal-key-tip">Enter to save · Shift+Enter for a new line</span>'+
 '<button class="button primary" id="universal-save-button" data-act="universal-save">'+ic("plus",15)+' Save</button></div></div></div>');
 updateUniversalPreview();var input=$("universal-capture");if(input)input.focus()
}
function updateUniversalPreview(){
 if(!modalState||modalState.mode!=="universal")return;
 var input=$("universal-capture"),raw=input?input.value:"",intent=captureIntent(raw),choice=modalState.captureType||"auto";
 var type=choice==="auto"?intent.type:choice,info=UNIVERSAL_TYPES.find(function(x){return x.type===type})||UNIVERSAL_TYPES[0];
 var canSave=!!intent.body&&(type!=="resource"||!!intent.url);
 var preview=$("universal-prediction"),saveButton=$("universal-save-button");
 if(preview)preview.innerHTML=ic(info.icon,15)+' <strong>'+esc(info.label)+'</strong><span>Saved to '+esc(info.where)+(type==="resource"&&!intent.url?" · Paste a URL":"")+'</span>';
 if(saveButton)saveButton.disabled=!canSave;
 document.querySelectorAll('[data-act="universal-type"]').forEach(function(b){
  var active=b.getAttribute("data-type")===choice;
  b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))
 })
}
function universalCaptureFromModal(){
 if(!modalState||modalState.mode!=="universal")return;
 var input=$("universal-capture");
 if(input)commitUniversalCapture(input.value,modalState.captureType)
}
function universalSearchCreate(type){
 var input=$("global-search");if(input)commitUniversalCapture(input.value,type||"auto")
}
function searchCreateOptions(query){
 var intent=captureIntent(query),info=UNIVERSAL_TYPES.find(function(x){return x.type===intent.type})||UNIVERSAL_TYPES[0];
 return '<div class="omni-create-group"><div class="omni-section-label">CREATE NEW</div>'+
 '<button class="search-result omni-suggested" data-act="search-create" data-type="auto">'+
 '<span class="row-icon">'+ic(info.icon,18)+'</span><span><strong>Save as '+esc(info.label)+'</strong>'+
 '<small>'+esc(trim(intent.body,105))+' · '+esc(info.where)+'</small></span><kbd>Enter</kbd></button>'+
 '<div class="omni-alternates">'+UNIVERSAL_TYPES.filter(function(x){return x.type!==info.type}).map(function(x){
  return '<button data-act="search-create" data-type="'+x.type+'"'+(x.type==="resource"&&!intent.url?' disabled title="Paste a URL to create a link"':"")+'>'+
   ic(x.icon,13)+' '+esc(x.label)+'</button>'
 }).join("")+'</div></div>'
}

function searchModal(){
 modalState={mode:"search"};
 openModal('<div class="modal-header"><h2>Search or create</h2><button class="icon-button" data-act="modal-close" aria-label="Close">'+ic("x",19)+'</button></div>'+
 '<div class="modal-scroll"><input id="global-search" class="search-input" type="search" placeholder="Find something or type what you want to save…" autocomplete="off" aria-label="Search existing items or create a new one">'+
 '<div id="search-results" class="search-results"></div>'+
 '<div class="omni-bottom-bar"><span>Search results below · Enter saves a new item · Q opens Quick capture</span>'+
 '<button class="button" data-act="universal-file">'+ic("attach",14)+' Add file</button></div></div>');
 updateSearchResults("");var input=$("global-search");if(input)input.focus()
}
function updateSearchResults(q){
 var el=$("search-results");if(!el)return;
 var all=getAllSearchable().filter(function(e){return searchMatch(e,q)}).sort(byRecent).slice(0,35);
 var existing=all.length?all.map(function(e){return '<button class="search-result" data-act="open" data-id="'+e.id+'"><span class="row-icon">'+ic(typeIcon(e),16)+'</span><span><strong>'+esc(objTitle(e))+'</strong><small>'+esc(typeName(e.type))+(shortContext(e)?" · "+esc(shortContext(e)):"")+'</small></span>'+ic("chevron-right",15)+'</button>'}).join(""):'<div class="modal-empty">No matching items.</div>';
 el.innerHTML=(String(q||"").trim()?searchCreateOptions(q):'<div class="omni-intro">Type to find an existing item or capture something new. Links and <code>todo:</code> are recognized automatically.</div>')+
  '<div class="omni-section-label omni-existing-heading">EXISTING ITEMS</div>'+existing
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
 '<button class="menu-choice" data-act="quick-toggle-entity" data-id="'+e.id+'">'+ic("pin",19)+'<span>'+(quickHas({kind:"entity",id:e.id})?"Remove from Home Quick Access":"Pin to Home")+'</span></button>'+
 (e.type==="task"?'<button class="menu-choice" data-act="'+(inInbox(e)?"clear-inbox":"mark-inbox")+'" data-id="'+e.id+'">'+ic("inbox",19)+'<span>'+(inInbox(e)?"Remove from Inbox":"Send to Inbox")+'</span></button>':"")+
 '<button class="menu-choice" data-act="focus-context" data-id="'+e.id+'">'+ic("layers",19)+'<span>'+(state.ui.focusId===e.id?"Stop working here":"Work in this context")+'</span></button>'+
 '<button class="menu-choice" data-act="attach-existing" data-context="'+e.id+'">'+ic("link",19)+'<span>Link an existing item</span></button>'+
 '<button class="menu-choice" data-act="archive-item" data-id="'+e.id+'">'+ic("archive",19)+'<span>'+(e.archived?"Restore from archive":"Archive")+'</span></button>'+
 '<button class="menu-choice" data-act="'+(e.trashed?"restore-item":"trash-item")+'" data-id="'+e.id+'" style="color:#b1786f">'+ic("trash",19)+'<span>'+(e.trashed?"Restore from trash":"Move to trash")+'</span></button>'+
 (e.trashed?'<button class="menu-choice" data-act="delete-forever" data-id="'+e.id+'" style="color:#b2564b">'+ic("trash",19)+'<span>Delete permanently</span></button>':"")+
 '</div></div>');
}
function toggleTask(id){var e=get(id);if(!e)return;e.completed=!e.completed;if(e.completed)e.inbox=false;touched(e);paint();toast(e.completed?"Task completed":"Task reopened")}
function clearInbox(id){var e=get(id);if(!e||e.type!=="task")return;e.inbox=false;touched(e);paint();toast("Kept as an independent task · removed from Inbox")}
function markInbox(id){var e=get(id);if(!e||e.type!=="task")return;e.inbox=true;touched(e);paint();toast("Moved to Inbox for review")}
function focusContext(id){state.ui.focusId=state.ui.focusId===id?null:id;save();closeModal();paint();toast(state.ui.focusId?"Working on "+objTitle(get(id)):"Context cleared")}
function unlink(id,parentId){var e=get(id);if(!e)return;e.contextIds=(e.contextIds||[]).filter(function(x){return x!==parentId});if(e.folderId===parentId)e.folderId=null;if(e.notebookId===parentId)e.notebookId=null;touched(e);paint();toast("Link removed; item kept in its own tool")}
function archiveItem(id){var e=get(id);if(!e)return;e.archived=!e.archived;touched(e);closeModal();if(state.ui.detailId===id)back();else paint();toast(e.archived?"Archived":"Restored")}
function trashItem(id){var e=get(id);if(!e)return;e.trashed=true;e.archived=false;touched(e);closeModal();if(state.ui.detailId===id)back();else paint();toast("Moved to Trash")}
function restoreItem(id){
 var e=get(id);if(!e)return;
 e.trashed=false;
 if(e.type==="journalbook"){
  var children=state.entities.filter(function(x){return x.type==="journal"&&x.trashed&&x.trashedWithJournal===e.id});
  children.forEach(function(x){
   x.trashed=false;x.archived=!!x.archivedBeforeJournalTrash;
   delete x.trashedWithJournal;delete x.archivedBeforeJournalTrash
  });
  touched(e);closeModal();paint();toast("Journal and "+children.length+" entr"+(children.length===1?"y":"ies")+" restored");return
 }
 if(e.type==="journal"){
  var book=get(e.journalBookId);
  if(!book||book.trashed)e.journalBookId=state.ui.defaultJournalId;
  delete e.trashedWithJournal;delete e.archivedBeforeJournalTrash
 }
 touched(e);closeModal();paint();toast("Restored")
}
function deleteForever(id){
 var entity=get(id),journal=entity&&entity.type==="journalbook";
 var children=journal?state.entities.filter(function(x){return x.type==="journal"&&x.trashedWithJournal===id&&x.trashed}):[];
 if(!confirm(journal?"Permanently delete this journal and its "+children.length+" trashed entr"+(children.length===1?"y":"ies")+"? This cannot be undone.":"Permanently delete this item? This cannot be undone."))return;
 var childIds=new Set(children.map(function(x){return x.id}));
 state.entities=state.entities.filter(function(x){return x.id!==id&&!childIds.has(x.id)});
 state.entities.forEach(function(x){
  x.contextIds=(x.contextIds||[]).filter(function(y){return y!==id});
  if(x.folderId===id)x.folderId=null;if(x.notebookId===id)x.notebookId=null;
  if(x.areaId===id)x.areaId=null;if(x.categoryId===id)x.categoryId=null;
  if(x.journalBookId===id)x.journalBookId=state.ui.defaultJournalId
 });
 if(journal&&state.ui.defaultJournalId===id)ensureJournals();
 save();closeModal();if(state.ui.detailId===id)back();else paint();toast("Deleted permanently")
}
function resourceDownload(e){if(e.blobId){loadBlob(e.blobId).then(function(blob){if(!blob){toast("File missing from local storage");return}var link=document.createElement("a"),url=URL.createObjectURL(blob);link.href=url;link.download=e.fileName||objTitle(e);link.click();setTimeout(function(){URL.revokeObjectURL(url)},6000)}).catch(function(){toast("Could not load file")})}else if(safeUrl(e.url)){window.open(safeUrl(e.url),"_blank","noopener,noreferrer")}else{toast("This is an illustrative resource, not an attached file")}}
function openDb(){return new Promise(function(resolve,reject){var req=indexedDB.open(DB,1);req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains("files"))req.result.createObjectStore("files")};req.onsuccess=function(){resolve(req.result)};req.onerror=function(){reject(req.error)}})}
async function storeBlob(id,blob){var db=await openDb();try{await new Promise(function(resolve,reject){var t=db.transaction("files","readwrite");t.objectStore("files").put(blob,id);t.oncomplete=resolve;t.onerror=function(){reject(t.error)}})}finally{db.close()}}
async function loadBlob(id){var db=await openDb();try{return await new Promise(function(resolve,reject){var req=db.transaction("files","readonly").objectStore("files").get(id);req.onsuccess=function(){resolve(req.result)};req.onerror=function(){reject(req.error)}})}finally{db.close()}}
async function fillPreviews(){
 var elems=Array.from(workspace.querySelectorAll("[data-preview]"));
 for(var img of elems){try{var blob=await loadBlob(img.getAttribute("data-preview"));if(blob&&img.isConnected){var u=URL.createObjectURL(blob);mediaUrls.push(u);img.src=u}}catch(e){}}
}
async function handleUpload(files){
 files=Array.from(files||[]);if(!files.length)return;var context=universalUpload?null:get(uploadContext||(state.ui.tool==="resources"&&state.ui.view.startsWith("folder:")?state.ui.view.slice(7):null));uploadContext=null;universalUpload=false;var saved=0;
 for(var file of files){try{
  var kind=file.type.startsWith("image/")?"image":file.type.startsWith("video/")?"video":file.type.startsWith("audio/")?"music": "document";
  var e=ent("resource",file.name.replace(/\.[^/.]+$/,""),{resourceKind:kind,fileName:file.name,mime:file.type,fileSize:file.size,blobId:uid()});
  if(context){e.sourceId=context.id;if(context.type==="folder")e.folderId=context.id;else e.contextIds=[context.id]}
  await storeBlob(e.blobId,file);state.entities.unshift(e);saved++;
 }catch(err){toast("Some files could not be stored")}}
 save();closeModal();paint();toast(saved+" file"+(saved===1?"":"s")+" saved"+(context?" · linked to "+objTitle(context):"")+". Also in Library")}
function toB64(b){return new Promise(function(resolve,reject){var reader=new FileReader();reader.onload=function(){resolve(String(reader.result).split(",")[1])};reader.onerror=reject;reader.readAsDataURL(b)})}
function fromB64(data,mime){var raw=atob(data),chunks=[];for(var i=0;i<raw.length;i+=8192){var bit=raw.slice(i,i+8192),a=new Uint8Array(bit.length);for(var j=0;j<bit.length;j++)a[j]=bit.charCodeAt(j);chunks.push(a)}return new Blob(chunks,{type:mime||"application/octet-stream"})}
async function exportAll(){try{var out={format:"shelf-v015",savedAt:new Date().toISOString(),data:state,files:[]};
 var ids=Array.from(new Set(state.entities.map(function(e){return e.blobId}).filter(Boolean)));
 for(var id of ids){var b=await loadBlob(id);if(b)out.files.push({id:id,mime:b.type,data:await toB64(b)})}
 var url=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:"application/json"})),a=document.createElement("a");a.href=url;a.download="shelf-v015-backup-"+today()+".json";a.click();setTimeout(function(){URL.revokeObjectURL(url)},10000);toast("Backup exported")
 }catch(err){toast("Export failed: "+err.message)}}
async function importAll(file){try{var d=JSON.parse(await file.text());if(!d||!["shelf-v015","shelf-v014","shelf-v013","shelf-v012","shelf-v011"].includes(d.format)||!d.data||!Array.isArray(d.data.entities))throw Error("Invalid Shelf backup");if(!confirm("Replace current v0.15 content with this backup?"))return;for(var f of d.files||[]){await storeBlob(f.id,fromB64(f.data,f.mime))}state=d.data;ensureAreas();state.ui=state.ui||seed().ui;ensureV13();ensureCategories();ensureJournals();ensureV14();ensureV15();state.ui.detailId=null;save();paint();toast("Backup restored")}catch(err){toast("Import failed: "+err.message)}}
function assignArea(e,id){
 if(!e||!["task","project"].includes(e.type))return false;
 var next=id?get(id):null;if(id&&(!next||next.type!=="area"||next.trashed))return false;
 var parent=e.type==="task"?projectOf(e):null,via=parent?areaOf(parent):null;
 if(parent&&next&&(!via||via.id!==next.id)){
  if(!confirm("This task belongs to "+objTitle(parent)+". Move it out of that project and into "+objTitle(next)+"?"))return false;
  e.contextIds=(e.contextIds||[]).filter(function(p){return p!==parent.id});
 }
 e.areaId=next?next.id:null;if(e.categoryId&&(!next||!get(e.categoryId)||get(e.categoryId).areaId!==next.id))e.categoryId=null;
 if(next&&e.type==="task")e.inbox=false;touched(e);return true
}
function assignCategory(e,id){
 if(!e||!["task","project"].includes(e.type))return false;
 var category=id?get(id):null;
 if(id&&(!category||category.type!=="category"||category.trashed))return false;
 if(category){
  var currentArea=areaOf(e),parent=e.type==="task"?projectOf(e):null,parentArea=parent?areaOf(parent):null;
  if(parent&&(!parentArea||parentArea.id!==category.areaId)){
   if(!confirm("This task belongs to "+objTitle(parent)+". Move it out of that project and into "+objTitle(category)+"?"))return false;
   e.contextIds=(e.contextIds||[]).filter(function(p){return p!==parent.id})
  }
  if(!currentArea||currentArea.id!==category.areaId||!parent)e.areaId=category.areaId
 }
 e.categoryId=category?category.id:null;
 if(category&&e.type==="task")e.inbox=false;
 touched(e);return true
}
function editField(target){
 var e=get(state.ui.detailId);if(!e)return;var f=target.getAttribute("data-edit");if(!f)return;
 if(f==="areaId"){if(!assignArea(e,target.value))paint();return}
 if(f==="categoryId"){if(!assignCategory(e,target.value))paint();return}
 if(["title","body","date","time","dueDate","location","projectStatus","targetDate","goalStatus","frequency"].includes(f)){
  e[f]=target.value;touched(e);return
 }
 if(f==="goalProgress"){var pct=Math.min(100,Math.max(0,Number(target.value)||0));e.goalProgress=pct;if(pct===100)e.goalStatus="achieved";touched(e)}
}
function applyRichEdit(){var e=get(state.ui.detailId),el=$("rich-content");if(!e||!el)return;e.html=safeRich(el.innerHTML);e.body=stripHtml(e.html);touched(e)}
function formatRich(command){var el=$("rich-content");if(!el)return;el.focus();document.execCommand(command,false,null);applyRichEdit()}
function monthMove(dir){state.ui.month=monthStep(state.ui.month||monthKey(today()),dir);state.ui.selectedDate=state.ui.month+"-01";miniCalendarPreferences("calendar").month=state.ui.month;state.ui.detailId=null;save();paint()}
function toggleHabit(id,date){
 var e=get(id);if(!e||e.type!=="habit")return;
 date=date||today();if(!Array.isArray(e.habitLog))e.habitLog=[];
 if(e.frequency==="weekly"){
  var d=new Date(date+"T12:00:00"),dow=d.getDay();d.setDate(d.getDate()-dow);
  var start=ndate(d),end=offsetDay(start,6);
  var found=e.habitLog.find(function(v){return v>=start&&v<=end});
  if(found)e.habitLog=e.habitLog.filter(function(v){return v!==found});else e.habitLog.push(date)
 }else if(e.habitLog.includes(date))e.habitLog=e.habitLog.filter(function(v){return v!==date});
 else e.habitLog.push(date);
 touched(e);paint();toast(habitDone(e,date)?"Habit checked off":"Check-in undone")
}
function routineStepAdd(id){
 var e=get(id),el=$("routine-new-step");
 if(!e||e.type!=="routine"||!el||!el.value.trim())return;
 if(!Array.isArray(e.routineSteps))e.routineSteps=[];
 e.routineSteps.push({id:uid(),text:el.value.trim().slice(0,300)});
 touched(e);paint();toast("Step added")
}
function routineStepToggle(id,stepId,date){
 var e=get(id);if(!e||e.type!=="routine"||!Array.isArray(e.routineSteps)||!e.routineSteps.some(function(x){return x.id===stepId}))return;
 if(!e.routineLog||typeof e.routineLog!=="object")e.routineLog={};
 date=routineRunKey(e,date);var history=e.routineLog[date]||[];
 e.routineLog[date]=history.includes(stepId)?history.filter(function(v){return v!==stepId}):history.concat(stepId);
 touched(e);paint()
}
function routineStepRemove(id,stepId){
 var e=get(id);if(!e||e.type!=="routine")return;
 e.routineSteps=(e.routineSteps||[]).filter(function(x){return x.id!==stepId});
 Object.keys(e.routineLog||{}).forEach(function(day){e.routineLog[day]=e.routineLog[day].filter(function(x){return x!==stepId})});
 touched(e);paint()
}
function routineReset(id,date){
 var e=get(id);if(!e||e.type!=="routine")return;
 if(e.routineLog)delete e.routineLog[routineRunKey(e,date)];
 touched(e);paint();toast("Routine reset for this day")
}

function closeSectionMenu(focus){
 var popup=document.querySelector(".nav-section-popover:not([hidden])");
 if(!popup)return false;
 popup.hidden=true;
 var trigger=popup.parentElement&&popup.parentElement.querySelector(".nav-section-options");
 if(trigger){trigger.setAttribute("aria-expanded","false");if(focus)trigger.focus()}
 return true
}
function toggleSectionMenu(trigger){
 var row=trigger.closest(".nav-section-row"),popup=row&&row.querySelector(".nav-section-popover");
 if(!popup)return;
 var next=popup.hidden;
 closeSectionMenu(false);
 if(next){
  popup.hidden=false;trigger.setAttribute("aria-expanded","true");
  if(typeof trigger.getBoundingClientRect==="function"){
   var rect=trigger.getBoundingClientRect(),height=typeof window!=="undefined"&&window.innerHeight?window.innerHeight:800;
   popup.style.left=Math.max(8,Math.round(rect.right-185))+"px";
   popup.style.top=Math.max(8,Math.min(Math.round(rect.bottom+5),height-195))+"px"
  }
  var first=popup.querySelector('[role="menuitem"]');
  if(first)first.focus()
 }
}

function onClick(ev){
 var b=ev.target.closest("[data-act]");if(!b)return;
 var act=b.getAttribute("data-act"),id=b.getAttribute("data-id"),type=b.getAttribute("data-type"),ctx=b.getAttribute("data-context"),view=b.getAttribute("data-view"),tool=b.getAttribute("data-tool"),current=get(id);
 if(act==="nav-section-menu"){toggleSectionMenu(b);return}
 if(act==="nav-section-toggle"){var key=b.getAttribute("data-key");navSections()[key]=!navExpanded(key);closeSectionMenu(false);save();renderSidebar();return}
 if(act==="nav-section-open"){var key=b.getAttribute("data-key");navSections()[key]=true;closeSectionMenu(false);navOpenDestination(key);return}
 if(act==="nav-node-toggle"){var key=b.getAttribute("data-key");navNodes()[key]=!navNodes()[key];save();renderSidebar();return}
 if(act==="nav-show-more"){var key=b.getAttribute("data-key"),limit=Number(b.getAttribute("data-next"));state.ui.navMore[key]=Math.min(Math.max(5,limit||15),9999);save();renderSidebar();return}
 if(act==="nav-show-less"){delete state.ui.navMore[b.getAttribute("data-key")];save();renderSidebar();return}
 if(b.closest&&b.closest(".nav-section-popover"))closeSectionMenu(false);
 if(act==="quick-add"){openQuickAdd();return}
 if(act==="quick-open"){quickOpen(b.getAttribute("data-key"));return}
 if(act==="quick-remove"){quickRemove(b.getAttribute("data-key"));paint();toast("Shortcut removed · original item kept");return}
 if(act==="quick-move"){if(quickMove(b.getAttribute("data-key"),Number(b.getAttribute("data-dir")))){paint()}return}
 if(act==="quick-pin-current"){quickToggleCurrent();return}
 if(act==="quick-toggle-entity"){quickToggleEntity(id);return}
 if(act==="quick-pin-choice"){
  var q=b.getAttribute("data-kind")==="entity"?{kind:"entity",id:id}:{kind:"view",tool:tool,view:view};
  if(quickAdd(q)){renderSidebar();renderWorkspace();updateQuickResults($("quick-search")?$("quick-search").value:"");toast("Added to Home Quick Access")}
  return
 }
 if(act==="tool"){go(tool);return}
 if(act==="navigate"){
  var node=b.closest&&b.closest(".nav-node-row");
  if(node){var key=node.getAttribute("data-node-key");if(key)navNodes()[key]=true}
  go(tool||state.ui.tool,view);return
 }
 if(act==="open"){closeModal();openEntity(id);return}
 if(act==="back"){back();return}
 if(act==="new-menu"){newMenu();return}
 if(act==="global-capture-save"){saveGlobalCapture();return}
 if(act==="create-primary"){var t=primaryType(state.ui.tool);if(!t)newMenu();else openCreate(t,null,{inbox:t==="task"&&state.ui.view==="inbox"});return}
 if(act==="create"){var fromInbox=type==="task"&&state.ui.view==="inbox"&&["todo","home"].includes(state.ui.tool);openCreate(type,ctx||null,{date:b.getAttribute("data-date")||null,inbox:fromInbox});return}
 if(act==="area-toggle"){state.ui.expandedAreaId=state.ui.expandedAreaId===id?null:id;save();renderSidebar();return}
 if(act==="area-open"){state.ui.expandedAreaId=id;go("planner","area:"+id);return}
 if(act==="category-open"){var c=get(id);if(c){state.ui.expandedAreaId=c.areaId;go("planner","category:"+id)}return}
 if(act==="create-category"){openCreateCategory(b.getAttribute("data-area"));return}
 if(act==="journal-options"){journalOptions(id,b);return}
 if(act==="journal-rename"){closeJournalMenu(false);openRenameJournal(id);return}
 if(act==="journal-delete"){closeJournalMenu(false);deleteJournal(id);return}
 if(act==="rename-category"){openRenameCategory(id);return}
 if(act==="delete-category"){deleteCategory(id);return}
 if(act==="rename-area"){openRenameArea(id);return}
 if(act==="sidebar-mini-toggle"){var mp=miniCalendarPreferences(state.ui.tool);mp.expanded=!mp.expanded;save();renderSidebar();return}
 if(act==="sidebar-mini-prev"||act==="sidebar-mini-next"){var mp=miniCalendarPreferences(state.ui.tool);mp.month=monthStep(mp.month,act==="sidebar-mini-next"?1:-1);save();renderSidebar();return}
 if(act==="sidebar-mini-date"){selectSidebarDate(b.getAttribute("data-date"));return}
 if(act==="sidebar-mini-clear"){clearSidebarDate();return}
 if(act==="journal-create-date"){journalToday(b.getAttribute("data-date"),b.getAttribute("data-book"));return}
 if(act==="journal-today"){journalToday();return}
 if(act==="search"){searchModal();return}
 if(act==="universal-open"){openUniversalCapture();return}
 if(act==="universal-type"){
  if(modalState&&modalState.mode==="universal"){modalState.captureType=b.getAttribute("data-type")||"auto";updateUniversalPreview()}
  return
 }
 if(act==="universal-save"){universalCaptureFromModal();return}
 if(act==="search-create"){universalSearchCreate(b.getAttribute("data-type"));return}
 if(act==="universal-file"){universalUpload=true;uploadContext=null;$("upload-input").click();return}
 if(act==="date"){state.ui.selectedDate=b.getAttribute("data-date");state.ui.month=monthKey(state.ui.selectedDate);miniCalendarPreferences("calendar").month=state.ui.month;go("calendar","month");return}
 if(act==="month-prev"){monthMove(-1);return}
 if(act==="month-next"){monthMove(1);return}
 if(act==="calendar-today"){state.ui.selectedDate=today();state.ui.month=monthKey(today());miniCalendarPreferences("calendar").month=state.ui.month;go("calendar","month");return}
 if(act==="habit-toggle"){toggleHabit(id,b.getAttribute("data-date")||today());return}
 if(act==="routine-step-add"){routineStepAdd(id);return}
 if(act==="routine-step-toggle"){routineStepToggle(id,b.getAttribute("data-step"),b.getAttribute("data-date")||today());return}
 if(act==="routine-step-remove"){routineStepRemove(id,b.getAttribute("data-step"));return}
 if(act==="routine-reset"){routineReset(id,b.getAttribute("data-date")||today());return}
 if(act==="toggle-task"){toggleTask(id);return}
 if(act==="clear-inbox"){clearInbox(id);return}
 if(act==="mark-inbox"){markInbox(id);return}
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
  else if(target.type==="area"&&["task","project"].includes(current.type)){current.areaId=target.id}
  else{if(!current.contextIds)current.contextIds=[];if(!current.contextIds.includes(target.id))current.contextIds.push(target.id)}
  if(current.type==="task"&&["project","area"].includes(target.type))current.inbox=false;
  touched(current);closeModal();paint();toast("Linked to "+objTitle(target)+" · no duplicate created");return
 }
 if(act==="unlink"){unlink(id,b.getAttribute("data-parent"));return}
 if(act==="format"){formatRich(b.getAttribute("data-command"));return}
 if(act==="capture-mode"){activeComposer=activeComposer===b.getAttribute("data-mode")?"auto":b.getAttribute("data-mode");Array.from(document.querySelectorAll(".capture-chip[data-mode]")).forEach(function(el){el.classList.toggle("active",el.getAttribute("data-mode")===activeComposer)});return}
 if(act==="capture-save"){captureSave(ctx);return}
 if(act==="home-capture"){captureSave(null);return}
 if(act==="category-quick"){
  var category=get(id),inp=$("category-quick");
  if(category&&category.type==="category"&&inp&&inp.value.trim()){
   var task=ent("task",inp.value.trim(),{areaId:category.areaId,categoryId:category.id,sourceId:category.id});
   state.entities.unshift(task);save();paint();toast("Task added to "+objTitle(category));
  }
  return
 }
 if(act==="area-quick"){
  var area=get(id),inp=$("area-quick");
  if(area&&area.type==="area"&&inp&&inp.value.trim()){
   var task=ent("task",inp.value.trim(),{areaId:area.id,sourceId:area.id});
   state.entities.unshift(task);save();paint();toast("Task added to "+objTitle(area));
  }
  return
 }
 if(act==="planner-quick"){
  var inp=$("planner-quick");if(inp&&inp.value.trim()){var task=ent("task",inp.value.trim(),{dueDate:state.ui.view==="today"?today():"",inbox:state.ui.view==="inbox"});var focus=isFocusValid();if(focus){task.contextIds=[focus.id];task.inbox=false}state.entities.unshift(task);save();paint();toast("Task saved in To do")}return
 }
 if(act==="upload"){universalUpload=false;uploadContext=ctx||state.ui.detailId||state.ui.focusId||null;$("upload-input").click();return}
 if(act==="download-resource"){if(current)resourceDownload(current);return}
 if(act==="archive-item"){archiveItem(id);return}
 if(act==="trash-item"){trashItem(id);return}
 if(act==="restore-item"){restoreItem(id);return}
 if(act==="delete-forever"){deleteForever(id);return}
 if(act==="export"){exportAll();return}
 if(act==="import"){$("backup-input").click();return}
}
document.addEventListener("click",onClick);
 document.addEventListener("click",function(ev){
  if(ev.target&&typeof ev.target.closest==="function"&&ev.target.closest(".nav-section-row"))return;
  closeSectionMenu(false)
 });
document.addEventListener("click",function(ev){
 if(ev.target&&typeof ev.target.closest==="function"&&ev.target.closest(".journal-page-menu"))return;
 closeJournalMenu(false)
});
document.addEventListener("submit",function(ev){if(ev.target.id==="create-form"){ev.preventDefault();submitCreate()}else if(ev.target.id==="rename-area-form"){ev.preventDefault();submitRenameArea()}else if(ev.target.id==="create-category-form"){ev.preventDefault();submitCreateCategory()}else if(ev.target.id==="rename-category-form"){ev.preventDefault();submitRenameCategory()}else if(ev.target.id==="rename-journal-form"){ev.preventDefault();submitRenameJournal()}});
document.addEventListener("input",function(ev){
 var el=ev.target;
 if(el.id==="quick-search"){updateQuickResults(el.value);return}
 if(el.id==="global-search"){updateSearchResults(el.value);return}
 if(el.id==="universal-capture"){updateUniversalPreview();return}
 if(el.id==="attach-search"){updateAttachResults(el.value);return}
 if(el.id==="rich-content"){applyRichEdit();return}
 if(el.hasAttribute("data-edit")){if(["areaId","categoryId"].includes(el.getAttribute("data-edit")))return;editField(el);return}
});
document.addEventListener("change",function(ev){if(ev.target.hasAttribute("data-edit")){editField(ev.target);paint()}});
document.addEventListener("keydown",function(ev){
 var target=ev.target||{},tag=String(target.tagName||"").toUpperCase();
 var isTyping=["INPUT","TEXTAREA","SELECT"].includes(tag)||target.isContentEditable||
  (typeof target.closest==="function"&&!!target.closest('[contenteditable="true"],[contenteditable=""],[role="textbox"]'));
 var modalOpen=modalRoot.classList.contains("open");
 if(ev.key==="Escape"){if(modalOpen){ev.preventDefault();closeModal();return}if(closeSectionMenu(true)){ev.preventDefault();return}if(closeJournalMenu(true)){ev.preventDefault();return}if(state.ui.detailId){back();return}}
 if((ev.key==="q"||ev.key==="Q")&&!isTyping&&!modalOpen&&!ev.repeat&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey&&!ev.isComposing){
  ev.preventDefault();openUniversalCapture();return
 }
 if(ev.key==="/"&&!isTyping&&!modalOpen&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey){ev.preventDefault();searchModal();return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="universal-capture"){ev.preventDefault();universalCaptureFromModal();return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="global-search"&&target.value&&target.value.trim()){ev.preventDefault();universalSearchCreate("auto");return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="home-capture"){ev.preventDefault();captureSave(null);return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="global-capture"){ev.preventDefault();saveGlobalCapture();return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="routine-new-step"){
  ev.preventDefault();var current=get(state.ui.detailId);if(current)routineStepAdd(current.id);return
 }
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="category-quick"){ev.preventDefault();var b=document.querySelector('[data-act="category-quick"]');if(b)b.click();return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="area-quick"){ev.preventDefault();var b=document.querySelector('[data-act="area-quick"]');if(b)b.click();return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="planner-quick"){ev.preventDefault();var b=document.querySelector('[data-act="planner-quick"]');if(b)b.click();return}
 if(ev.key==="Enter"&&!ev.shiftKey&&target.id==="context-capture"){ev.preventDefault();captureSave(state.ui.detailId);return}
});
document.addEventListener("paste",function(ev){
 if(ev.target&&ev.target.id==="universal-capture"&&ev.clipboardData&&ev.clipboardData.files&&ev.clipboardData.files.length){
  ev.preventDefault();universalUpload=true;uploadContext=null;handleUpload(ev.clipboardData.files);return
 }
 if(!ev.target||ev.target.id!=="rich-content")return;
 ev.preventDefault();
 var text=ev.clipboardData?ev.clipboardData.getData("text/plain"):"";
 document.execCommand("insertText",false,text)
});
$("upload-input").addEventListener("change",function(){handleUpload(this.files);this.value=""});
$("backup-input").addEventListener("change",function(){if(this.files[0])importAll(this.files[0]);this.value=""});
document.addEventListener("dragstart",function(ev){
 var item=ev.target.closest("[data-quick-drag]");if(!item)return;
 draggingQuickKey=item.getAttribute("data-quick-drag");
 if(ev.dataTransfer){ev.dataTransfer.effectAllowed="move";ev.dataTransfer.setData("text/plain",draggingQuickKey)}
});
document.addEventListener("dragend",function(){draggingQuickKey=null;document.querySelectorAll(".quick-over").forEach(function(x){x.classList.remove("quick-over")})});
document.addEventListener("dragover",function(ev){
 var target=ev.target.closest("[data-quick-drop]");if(!target||!draggingQuickKey)return;
 ev.preventDefault();if(ev.dataTransfer)ev.dataTransfer.dropEffect="move";
 target.classList.add("quick-over")
});
document.addEventListener("dragleave",function(ev){
 var target=ev.target.closest("[data-quick-drop]");
 if(target&&!target.contains(ev.relatedTarget))target.classList.remove("quick-over")
});
document.addEventListener("drop",function(ev){
 var target=ev.target.closest("[data-quick-drop]");if(!target||!draggingQuickKey)return;
 ev.preventDefault();quickReorder(draggingQuickKey,target.getAttribute("data-quick-drop"));
 draggingQuickKey=null;paint()
});
document.addEventListener("dragover",function(ev){
 var target=ev.target.closest("[data-category-drop]");
 if(target&&draggingAreaItem){ev.preventDefault();if(ev.dataTransfer)ev.dataTransfer.dropEffect="move";target.classList.add("category-drop-hover")}
});
document.addEventListener("dragleave",function(ev){
 var target=ev.target.closest("[data-category-drop]");
 if(target&&!target.contains(ev.relatedTarget))target.classList.remove("category-drop-hover")
});
document.addEventListener("drop",function(ev){
 var target=ev.target.closest("[data-category-drop]");
 if(!target||!draggingAreaItem)return;
 ev.preventDefault();ev.stopPropagation();
 var item=get(draggingAreaItem),category=get(target.getAttribute("data-category-drop"));draggingAreaItem=null;
 if(item&&category&&assignCategory(item,category.id)){paint();toast(objTitle(item)+" moved to "+objTitle(category))}
 else paint()
});
document.addEventListener("dragstart",function(ev){
 var item=ev.target.closest("[data-area-drag]");if(!item)return;
 draggingAreaItem=item.getAttribute("data-area-drag");
 if(ev.dataTransfer){ev.dataTransfer.effectAllowed="move";ev.dataTransfer.setData("text/plain",draggingAreaItem)}
});
document.addEventListener("dragend",function(){draggingAreaItem=null;document.querySelectorAll(".area-drop-hover,.category-drop-hover").forEach(function(x){x.classList.remove("area-drop-hover");x.classList.remove("category-drop-hover")})});
document.addEventListener("dragover",function(ev){
 var target=ev.target.closest("[data-area-drop]");
 if(target&&draggingAreaItem){ev.preventDefault();if(ev.dataTransfer)ev.dataTransfer.dropEffect="move";target.classList.add("area-drop-hover")}
 if(ev.dataTransfer&&Array.from(ev.dataTransfer.types||[]).includes("Files"))ev.preventDefault()
});
document.addEventListener("dragleave",function(ev){
 var target=ev.target.closest("[data-area-drop]");
 if(target&&!target.contains(ev.relatedTarget))target.classList.remove("area-drop-hover")
});
document.addEventListener("drop",function(ev){
 var target=ev.target.closest("[data-area-drop]");
 if(!target||!draggingAreaItem)return;
 ev.preventDefault();
 var item=get(draggingAreaItem),area=get(target.getAttribute("data-area-drop"));draggingAreaItem=null;
 if(item&&area&&assignArea(item,area.id)){paint();toast(objTitle(item)+" moved to "+objTitle(area))}
 else paint()
});
document.addEventListener("drop",function(ev){if(ev.dataTransfer&&ev.dataTransfer.files&&ev.dataTransfer.files.length){ev.preventDefault();uploadContext=state.ui.detailId||state.ui.focusId||null;handleUpload(ev.dataTransfer.files)}});
save();paint();
})();
