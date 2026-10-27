const $=selector=>document.querySelector(selector);
try{
 const response=await fetch(new URL('../demo/screens.json',import.meta.url));
 if(!response.ok)throw Error('Could not load the screen list. Please reload.');
 const {screens}=await response.json();
 const groups=['All',...new Set(screens.map(screen=>screen.category))];
 let activeGroup='All',activeScreen=screens.find(screen=>screen.number===6)||screens[0];
 const visible=()=>screens.filter(screen=>activeGroup==='All'||screen.category===activeGroup);
 function render(){
  const list=visible(),index=list.indexOf(activeScreen);
  $('#filters').replaceChildren(...groups.map(group=>{
   const button=document.createElement('button');button.textContent=group;button.setAttribute('aria-pressed',String(activeGroup===group));
   button.onclick=()=>{activeGroup=group;if(!visible().includes(activeScreen))activeScreen=visible()[0];render();};return button;
  }));
  $('#screen-list').replaceChildren(...list.map(screen=>{
   const link=document.createElement('a');link.href='#screen='+screen.number;
   if(screen===activeScreen)link.setAttribute('aria-current','page');
   const number=document.createElement('span');number.textContent=String(screen.number).padStart(2,'0');link.append(number,screen.title);
   link.onclick=event=>{event.preventDefault();activeScreen=screen;render();};return link;
  }));
  $('#screen-picker').replaceChildren(...list.map(screen=>{
   const option=document.createElement('option');option.value=screen.number;option.textContent=String(screen.number).padStart(2,'0')+' · '+screen.title;option.selected=screen===activeScreen;return option;
  }));
  $('#position').textContent=String(activeScreen.number).padStart(2,'0')+' / '+screens.length;
  $('#screen-title').textContent=activeScreen.title;$('#counter').textContent=(index+1)+' / '+list.length;
  const url=new URL('../demo/'+activeScreen.file,import.meta.url).href;
  const image=$('#screen-image');image.src=url;image.alt=activeScreen.title+' — Flush Wallet demo';image.width=activeScreen.width;image.height=activeScreen.height;
  $('#full-size').href=url;history.replaceState(null,'','#screen='+activeScreen.number);
  document.title=activeScreen.title+' — Flush Wallet demo';
  const next=new Image();next.src=new URL('../demo/'+list[(index+1)%list.length].file,import.meta.url).href;
 }
 function move(delta){const list=visible(),index=list.indexOf(activeScreen);activeScreen=list[(index+delta+list.length)%list.length];render();}
 $('#previous').onclick=()=>move(-1);$('#next').onclick=()=>move(1);
 $('#screen-picker').onchange=event=>{activeScreen=screens.find(screen=>screen.number===Number(event.target.value));render();};
 document.addEventListener('keydown',event=>{
  if(['SELECT','INPUT','TEXTAREA'].includes(event.target.tagName))return;
  if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
 });
 const requested=Number(new URLSearchParams(location.hash.slice(1)).get('screen'));
 activeScreen=screens.find(screen=>screen.number===requested)||activeScreen;render();
}catch(error){$('#error').textContent=error.message;$('#error').hidden=false;$('#position').textContent='Unavailable';}
