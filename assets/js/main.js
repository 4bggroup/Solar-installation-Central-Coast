/* SUNWARD V6 — interactive editorial experience. No external JS libraries. */
(()=>{
'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const findInView=()=>{
  if(!('IntersectionObserver' in window)){$$('.reveal').forEach(e=>e.classList.add('in-view'));return;}
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');io.unobserve(entry.target);}}),{threshold:.1,rootMargin:'0px 0px 55px 0px'});
  $$('.reveal').forEach(el=>io.observe(el));
};
findInView();
// Scroll progress: passive listeners and animation frame throttle
let raf=0;const updateScroll=()=>{raf=0;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);$('#scrollLine').style.width=(100*window.scrollY/max)+'%';};
addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(updateScroll)},{passive:true});updateScroll();
// Mobile nav uses actual hidden attribute and keyboard-compatible button semantics.
const menu=$('#mobileMenu'),menuToggle=$('#menuToggle');
const closeMenu=()=>{menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');};
menuToggle.addEventListener('click',()=>{const opening=menu.hidden;menu.hidden=!opening;menuToggle.setAttribute('aria-expanded',String(opening));menuToggle.setAttribute('aria-label',opening?'Close navigation':'Open navigation');});
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeLightbox();}});

const services=[
 {img:'residential.webp',alt:'Residential rooftop solar panels on an Australian house',label:'01 / HOME ENERGY',title:'Solar that fits the way you live.',desc:'A system designed around your roof, household electricity use and future plans—not a one-size-fits-all package.',enquiry:'Residential solar'},
 {img:'commercial.webp',alt:'Solar installation team working on a commercial NSW roof',label:'02 / BUSINESS ENERGY',title:'Turn unused roof space into potential.',desc:'Explore scalable commercial solar designed for operating hours, roof access, energy demand and the needs of your business.',enquiry:'Commercial solar'},
 {img:'battery.webp',alt:'Australian family with solar energy battery storage',label:'03 / ENERGY STORAGE',title:'Your solar energy, available for later.',desc:'Consider a battery setup that may help you use more of your own generation when the sun is no longer shining.',enquiry:'Battery storage'},
 {img:'ev.webp',alt:'Australian household with EV charger and solar power',label:'04 / SMARTER CHARGING',title:'Give your driveway an energy upgrade.',desc:'Bring home charging into the wider energy plan, with equipment selected around your vehicle and electrical system.',enquiry:'EV charging'},
 {img:'inverter.webp',alt:'Technician assessing a solar inverter and electrical panel',label:'05 / SYSTEM UPGRADES',title:'Make a good system better.',desc:'Review inverter condition, system compatibility and practical options before adding or upgrading solar components.',enquiry:'Inverter upgrades'},
 {img:'cleaning.webp',alt:'Professional checking and maintaining installed solar panels',label:'06 / LONG-TERM CARE',title:'Keep the everyday performance in view.',desc:'Inspections, fault investigation, repairs and panel care help you understand how your system is performing over time.',enquiry:'Solar maintenance'}
];
const serviceImage=$('#serviceImg'),serviceLabel=$('#serviceLabel'),serviceTitle=$('#serviceTitle'),serviceDesc=$('#serviceDesc'),serviceCTA=$('#serviceCTA'),servicePanel=$('#service-pane');
let serviceCounter=0;
function selectService(idx){const item=services[idx];if(!item)return;
  serviceCounter++;const key=serviceCounter;
  $$('.service-tab').forEach((tab,i)=>{tab.classList.toggle('active',i===idx);tab.setAttribute('aria-selected',String(i===idx));});
  servicePanel.setAttribute('aria-labelledby',`service-tab-${idx}`);
  serviceImage.classList.add('is-changing');
  const next=new Image();next.src='assets/images/'+item.img;
  const finish=()=>{if(key!==serviceCounter)return;serviceImage.src=next.src;serviceImage.alt=item.alt;serviceLabel.textContent=item.label;serviceTitle.textContent=item.title;serviceDesc.textContent=item.desc;serviceCTA.dataset.enquiry=item.enquiry;requestAnimationFrame(()=>serviceImage.classList.remove('is-changing'));};
  if(next.complete)finish();else{next.addEventListener('load',finish,{once:true});next.addEventListener('error',()=>serviceImage.classList.remove('is-changing'),{once:true});}
}
$$('.service-tab').forEach(b=>b.addEventListener('click',()=>selectService(Number(b.dataset.service))));

// Six-stage illustrated process explorer.
const stages=[
 {img:'consult.webp',tag:'PHASE 01 / DISCOVERY',title:'It starts with a good conversation.',text:'We understand the property, discuss electricity needs and explore what you want the system to do in the years ahead.',alt:'Solar specialist speaking with homeowner at a property'},
 {img:'roof.webp',tag:'PHASE 02 / SITE WORK',title:'Getting the details right, up top.',text:'Roof shape, usable area, access, orientation and shading all influence the layout and equipment recommendations.',alt:'Solar worker measuring an Australian metal roof'},
 {img:'design.webp',tag:'PHASE 03 / DESIGN',title:'An energy system, thoughtfully mapped.',text:'The proposed layout considers your usage, panel placement, inverter requirements and any future battery or EV plans.',alt:'Australian solar design engineers planning a rooftop installation on screen'},
 {img:'install.webp',tag:'PHASE 04 / INSTALLATION',title:'Where a good plan becomes real.',text:'Installation moves from mountings and modules to cable routes and associated electrical work, under the required safety processes.',alt:'Qualified rooftop solar installers fitting photovoltaic panels'},
 {img:'inverter.webp',tag:'PHASE 05 / COMMISSIONING',title:'Checked before it is handed over.',text:'Appropriate testing, commissioning and system checks matter before a new installation begins operating.',alt:'Electrical worker testing inverter and electrical components'},
 {img:'handover.webp',tag:'PHASE 06 / HANDOVER',title:'Confidence from day one.',text:'Customers should understand how to read system information, whom to contact and how to care for the installation.',alt:'Solar advisor explaining next steps to homeowners'}
];
let activeStage=0, stageChangeId=0;
function setStage(nextIndex){const idx=(nextIndex+stages.length)%stages.length;activeStage=idx;stageChangeId++;const job=stageChangeId;
  $$('.journey-step').forEach((tab,i)=>{tab.classList.toggle('active',i===idx);tab.setAttribute('aria-selected',String(i===idx));});
  $('#journey-panel').setAttribute('aria-labelledby','journey-tab-'+idx);
  const data=stages[idx],pic=$('#journeyImage');pic.classList.add('is-changing');
  const preloader=new Image();preloader.src='assets/images/'+data.img;
  const render=()=>{if(job!==stageChangeId)return;pic.src=preloader.src;pic.alt=data.alt;$('#journeyTag').textContent=data.tag;$('#journeyTitle').textContent=data.title;$('#journeyText').textContent=data.text;$('#journeyCounter').textContent=String(idx+1).padStart(2,'0')+' / 06';$('#journeyProgress').style.width=((idx+1)/6*100)+'%';requestAnimationFrame(()=>pic.classList.remove('is-changing'));};
  if(preloader.complete)render();else{preloader.addEventListener('load',render,{once:true});preloader.addEventListener('error',()=>pic.classList.remove('is-changing'),{once:true});}
}
$$('.journey-step').forEach(btn=>btn.addEventListener('click',()=>setStage(Number(btn.dataset.step))));
$('#journeyNext').addEventListener('click',()=>setStage(activeStage+1));$('#journeyPrev').addEventListener('click',()=>setStage(activeStage-1));

const energyExplanations={
 solar:'Start with solar generation designed around the available roof space and your energy use.',
 battery:'Add storage to explore how some daytime generation could be used later. Suitability and value depend on your usage patterns and system design.',
 ev:'Consider EV charging as part of the broader electricity plan. Charging times and equipment compatibility will shape what makes sense.'
};
$$('.energy-option').forEach(btn=>btn.addEventListener('click',()=>{
 $$('.energy-option').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
 $('#energyDescription').textContent=energyExplanations[btn.dataset.energy];
 $('.energy-vis').dataset.focus=btn.dataset.energy;
}));

// Gallery lightbox: keyboard/escape/close via backdrop.
const lightbox=$('#lightbox'),bigImage=$('#lightboxImage'),lightCaption=$('#lightboxCaption'),lightClose=$('#lightboxClose');let lastFocus=null;
function openLightbox(image,caption,alt){lastFocus=document.activeElement;bigImage.src=image;bigImage.alt=alt;lightCaption.textContent=caption;lightbox.hidden=false;document.body.style.overflow='hidden';lightClose.focus();}
function closeLightbox(){if(lightbox.hidden)return;lightbox.hidden=true;bigImage.removeAttribute('src');document.body.style.overflow='';lastFocus?.focus();}
$$('.gallery-card').forEach(button=>button.addEventListener('click',()=>openLightbox(button.dataset.img,button.dataset.caption,$('img',button)?.alt||'')));
lightClose.addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});

const properties=$$('.chip[data-property]'),goals=$$('.goal[data-goal]');let property='home',goal='new';
const recommendation={
 home:{new:['Residential solar design','Explore a suitably sized system for your available roof space, household use and long-term plans.','Residential solar'],battery:['Home battery consultation','Review your usage pattern, tariff and existing or planned solar system before selecting battery storage.','Battery storage'],care:['Residential solar health check','Start with an inspection or performance review before adding panels or changing hardware.','Solar maintenance']},
 business:{new:['Commercial solar assessment','Review business load, roof size, operating hours and financial parameters before proposing a system.','Commercial solar'],battery:['Business storage discussion','Assess peak demand, tariffs and business load patterns to determine whether storage makes sense.','Battery storage'],care:['Commercial system review','Arrange an appropriate inspection of existing equipment, inverter performance and maintenance requirements.','Solar maintenance']},
 regional:{new:['Regional solar feasibility','Start with usable roof or ground space, distance to the grid and the property’s daily electricity needs.','Residential solar'],battery:['Regional energy resilience','Explore whether battery storage complements your power arrangements, including any backup expectations.','Battery storage'],care:['Off-grid / existing system check','Discuss system condition, off-grid equipment compatibility and options for safer long-term operation.','Off-grid solar']}
};
function updateRecommendation(){const data=recommendation[property][goal];$('#recommendTitle').textContent=data[0];$('#recommendText').textContent=data[1];$('#recommendCTA').dataset.enquiry=data[2];}
properties.forEach(b=>b.addEventListener('click',()=>{property=b.dataset.property;properties.forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});updateRecommendation();}));
goals.forEach(b=>b.addEventListener('click',()=>{goal=b.dataset.goal;goals.forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});updateRecommendation();}));

// Prefill form service from exploration links.
$$('[data-enquiry]').forEach(anchor=>anchor.addEventListener('click',()=>{
  const option=anchor.dataset.enquiry;
  const select=$('#serviceSelect');if([...select.options].some(x=>x.value===option))select.value=option;
}));
const form=$('#leadForm'),status=$('#formStatus');
form.addEventListener('submit',e=>{
 e.preventDefault();
 if(!form.reportValidity())return;
 status.textContent='Demo ready: your details are valid. No enquiry has been sent. Connect an email service or form backend before making this website live.';
 status.style.color='#315d42';
});
if(prefersReduced){$$('.reveal').forEach(e=>e.classList.add('in-view'));}
})();
