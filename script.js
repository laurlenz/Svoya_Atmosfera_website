const products=[
{id:'c1',cat:'candles',name:'Хвойный лес',latin:'Pinus sylvestris',size:'180 г',price:1690,desc:'Хвоя, смола и влажный мох. Тихий древесный аромат леса.'},
{id:'c2',cat:'candles',name:'Облепиха',latin:'Hippophae rhamnoides',size:'180 г',price:1690,desc:'Кислая ягода, зелёные листья и сухая древесина.'},
{id:'c3',cat:'candles',name:'Лайм & базилик',latin:'Ocimum × Citrus',size:'180 г',price:1690,desc:'Свежий лайм и зелёный базилик с прохладным травяным оттенком.'},
{id:'c4',cat:'candles',name:'Сандал',latin:'Santalum album',size:'180 г',price:1690,desc:'Мягкая сухая древесина, специи и тёплая смолистость.'},
{id:'c5',cat:'candles',name:'Полынь',latin:'Artemisia absinthium',size:'180 г',price:1690,desc:'Сухая горькая зелень, травы и древесные ноты.'},
{id:'d1',cat:'diffusers',name:'Облепиха',latin:'Hippophae rhamnoides',size:'100 мл',price:1790,desc:'Кислая ягода, зелёные листья и сухая древесина.'},
{id:'d2',cat:'diffusers',name:'Лайм & базилик',latin:'Ocimum × Citrus',size:'100 мл',price:1790,desc:'Свежий лайм и зелёный базилик.'},
{id:'d3',cat:'diffusers',name:'Сандал',latin:'Santalum album',size:'100 мл',price:1790,desc:'Мягкая сухая древесина и специи.'},
{id:'d4',cat:'diffusers',name:'Хвойный лес',latin:'Pinus sylvestris',size:'100 мл',price:1790,desc:'Хвоя, смола и влажный мох.'},
{id:'a1',cat:'car',name:'Облепиха',latin:'Hippophae rhamnoides',size:'8 мл',price:1290,desc:'Стеклянный флакон-куб с деревянной крышкой.'},
{id:'a2',cat:'car',name:'Лайм & базилик',latin:'Ocimum × Citrus',size:'8 мл',price:1290,desc:'Стеклянный флакон-куб с деревянной крышкой.'},
{id:'a3',cat:'car',name:'Сандал',latin:'Santalum album',size:'8 мл',price:1290,desc:'Стеклянный флакон-куб с деревянной крышкой.'},
{id:'a4',cat:'car',name:'Хвойный лес',latin:'Pinus sylvestris',size:'8 мл',price:1290,desc:'Стеклянный флакон-куб с деревянной крышкой.'},
{id:'s1',cat:'sachets',name:'Лаванда',latin:'Lavandula angustifolia',size:'30 г',price:990,desc:'Восковое саше с сухоцветами.'},
{id:'s2',cat:'sachets',name:'Розмарин',latin:'Rosmarinus officinalis',size:'30 г',price:990,desc:'Восковое саше с ботаническими нотами.'},
{id:'s3',cat:'sachets',name:'Жасмин',latin:'Jasminum officinale',size:'30 г',price:990,desc:'Цветочный аромат в восковой форме.'},
{id:'s4',cat:'sachets',name:'Сандал',latin:'Santalum album',size:'30 г',price:990,desc:'Тёплая древесная композиция.'},
{id:'s5',cat:'sachets',name:'Полынь',latin:'Artemisia absinthium',size:'30 г',price:990,desc:'Сухая зелень и травянистая горечь.'}
];
const typeNames={candles:'Свеча',diffusers:'Диффузор',car:'Автопарфюм',sachets:'Восковое саше'};
let cart=JSON.parse(localStorage.getItem('svoyaCart')||'[]');
let carouselIndex=0;
let currentProductId=null;
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const $=id=>document.getElementById(id);
const productType=p=>typeNames[p.cat]||'Товар';
const productTitle=p=>`${productType(p)} · ${p.name}`;

function quickAddHtml(p){
  const item=cart.find(x=>x.id===p.id);
  if(item)return `<div class="qa-stepper"><button data-minus="${p.id}" aria-label="Уменьшить количество">−</button><span>${item.qty}</span><button data-plus="${p.id}" aria-label="Увеличить количество">+</button></div>`;
  return `<button class="qa-add" data-plus="${p.id}" aria-label="Добавить в корзину">+</button>`;
}
function renderGrid(cat,id){
  $(id).innerHTML=products.filter(p=>p.cat===cat).map(p=>`<article class="product-card" data-id="${p.id}"><div class="product-photo no-photo"></div><div class="product-name">${p.name}</div><div class="product-latin">${p.latin}</div><div class="product-meta"><span>${p.size}</span><strong class="product-price">${money(p.price)}</strong></div><div class="product-actions"><button type="button" class="product-more" data-more="${p.id}">Подробнее</button><div class="quick-add-slot" data-qa="${p.id}">${quickAddHtml(p)}</div></div></article>`).join('');
}
renderGrid('candles','candlesGrid');
renderGrid('diffusers','diffusersGrid');
renderGrid('car','carGrid');
renderGrid('sachets','sachetsGrid');

function save(){
  localStorage.setItem('svoyaCart',JSON.stringify(cart));
  updateCart();
  refreshQuickAdd();
  if(currentProductId && $('productModal').classList.contains('open'))renderModalCartControl(currentProductId);
}
function refreshQuickAdd(){
  document.querySelectorAll('.quick-add-slot').forEach(slot=>{
    const p=products.find(p=>p.id===slot.dataset.qa);
    if(p)slot.innerHTML=quickAddHtml(p);
  });
}
function renderModalCartControl(id){
  const item=cart.find(x=>x.id===id);
  const el=$('modalCartControl');
  if(item){
    el.innerHTML=`<div class="in-cart-control"><span class="in-cart-label">✓ В корзине</span><div class="qty"><button data-minus="${id}" aria-label="Уменьшить количество">−</button><span>${item.qty}</span><button data-plus="${id}" aria-label="Увеличить количество">+</button></div></div>`;
  }else{
    el.innerHTML=`<button class="primary" id="modalAdd" data-id="${id}">Добавить в корзину</button>`;
  }
}
function updateCart(){
  const count=cart.reduce((a,x)=>a+x.qty,0);
  $('cartCount').textContent=count;
  $('cartCountHeader').textContent=count;
  $('cartItems').innerHTML=cart.length?cart.map(x=>{
    const p=products.find(p=>p.id===x.id);
    return `<div class="cart-row"><div class="cart-thumb"></div><div><strong>${productTitle(p)}</strong><small>${p.desc}</small><small>${p.size} · ${money(p.price)}</small><div class="qty"><button data-minus="${p.id}" aria-label="Уменьшить количество">−</button><span>${x.qty}</span><button data-plus="${p.id}" aria-label="Увеличить количество">+</button></div></div><button class="remove" data-remove="${p.id}">Удалить</button></div>`
  }).join(''):'<p class="empty">Корзина пока пуста.</p>';
  $('cartTotal').textContent=money(cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.qty,0));
}
function add(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save()}
function updateBodyScrollLock(){
  const locked=document.querySelector('.modal.open')||$('cartDrawer').classList.contains('open');
  document.body.classList.toggle('modal-open',!!locked);
}
function openDrawer(){$('cartDrawer').classList.add('open');$('cartDrawer').setAttribute('aria-hidden','false');$('backdrop').classList.add('open');updateBodyScrollLock()}
function closeDrawer(){$('cartDrawer').classList.remove('open');$('cartDrawer').setAttribute('aria-hidden','true');$('backdrop').classList.remove('open');updateBodyScrollLock()}
function openModal(id){$(id).classList.add('open');$(id).setAttribute('aria-hidden','false');updateBodyScrollLock()}
function closeModal(id){$(id).classList.remove('open');$(id).setAttribute('aria-hidden','true');updateBodyScrollLock()}
function setCarousel(index){
  carouselIndex=(index+2)%2;
  document.querySelectorAll('.carousel-slide').forEach((el,i)=>el.classList.toggle('active',i===carouselIndex));
  document.querySelectorAll('.carousel-dot').forEach((el,i)=>el.classList.toggle('active',i===carouselIndex));
}
function cartSummaryHtml(){
  return cart.map(x=>{
    const p=products.find(p=>p.id===x.id);
    return `<div class="summary-line"><span>${productTitle(p)} × ${x.qty}</span><strong>${money(p.price*x.qty)}</strong></div>`
  }).join('')+`<div class="summary-line summary-total"><strong>Итого</strong><strong>${$('cartTotal').textContent}</strong></div>`;
}
function orderLines(){
  return cart.map(x=>{
    const p=products.find(p=>p.id===x.id);
    return `${productTitle(p)} — ${p.desc} — ${p.size} × ${x.qty} — ${money(p.price*x.qty)}`;
  }).join('\n');
}

updateCart();
$('openCart').onclick=openDrawer;
$('openCartHeader').onclick=openDrawer;
$('closeCart').onclick=closeDrawer;
$('backdrop').onclick=closeDrawer;

$('successClose').onclick=()=>closeModal('successModal');

document.querySelector('.carousel-prev').onclick=()=>setCarousel(carouselIndex-1);
document.querySelector('.carousel-next').onclick=()=>setCarousel(carouselIndex+1);
document.querySelectorAll('.carousel-dot').forEach(dot=>dot.onclick=()=>setCarousel(Number(dot.dataset.slideTo)));

(function(){
  const carousel=$('productCarousel');
  let startX=null,startY=null;
  carousel.addEventListener('touchstart',e=>{
    const t=e.changedTouches[0];
    startX=t.clientX;startY=t.clientY;
  },{passive:true});
  carousel.addEventListener('touchend',e=>{
    if(startX===null)return;
    const t=e.changedTouches[0];
    const dx=t.clientX-startX,dy=t.clientY-startY;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))setCarousel(carouselIndex+(dx<0?1:-1));
    startX=null;startY=null;
  },{passive:true});
})();

document.querySelectorAll('.modal').forEach(modal=>{
  modal.addEventListener('click',e=>{
    if(e.target===modal)closeModal(modal.id);
  });
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeModal('productModal');
    closeModal('checkoutModal');
    closeModal('successModal');
    closeDrawer();
  }
});

function openProduct(id){
  const p=products.find(p=>p.id===id);
  if(!p)return;
  $('modalLatin').textContent=p.latin;
  $('modalName').textContent=productTitle(p);
  $('modalDesc').textContent=p.desc;
  $('modalSize').textContent=p.size;
  $('modalPrice').textContent=money(p.price);
  currentProductId=p.id;
  renderModalCartControl(p.id);
  setCarousel(0);
  openModal('productModal');
}

document.addEventListener('click',e=>{
  const more=e.target.closest('[data-more]');
  if(more){openProduct(more.dataset.more);return;}
  const card=e.target.closest('.product-card');
  if(card && !e.target.closest('.quick-add-slot')){
    openProduct(card.dataset.id);
    return;
  }
  const addBtn=e.target.closest('#modalAdd');
  if(addBtn){add(addBtn.dataset.id);return}
  if(e.target.dataset.plus){add(e.target.dataset.plus);return}
  if(e.target.dataset.minus){
    const item=cart.find(x=>x.id===e.target.dataset.minus);
    if(item){item.qty--;if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);save()}
    return;
  }
  if(e.target.dataset.remove){cart=cart.filter(x=>x.id!==e.target.dataset.remove);save();return}
  if(e.target.dataset.close){closeModal(e.target.dataset.close)}
});

$('checkoutBtn').onclick=()=>{
  if(!cart.length){alert('Добавьте товар в корзину.');return}
  $('checkoutSummary').innerHTML=cartSummaryHtml();
  $('orderError').hidden=true;
  openModal('checkoutModal');
  closeDrawer();
};

$('orderForm').onsubmit=async e=>{
  e.preventDefault();
  const fd=new FormData(e.target);
  const sentCart=cart.map(x=>({...x}));
  const sentTotal=$('cartTotal').textContent;
  const lines=sentCart.map(x=>{
    const p=products.find(p=>p.id===x.id);
    return `${productTitle(p)} — ${p.desc} — ${p.size} × ${x.qty} — ${money(p.price*x.qty)}`;
  }).join('\n');
  const order=`ЗАКАЗ «СВОЯ АТМОСФЕРА»\n\n${lines}\n\nИтого: ${sentTotal}\n\nИмя: ${fd.get('name')}\nКонтакт: ${fd.get('contact')}\nКомментарий: ${fd.get('comment')||'—'}`;
  const button=e.target.querySelector('button[type="submit"]');
  button.disabled=true;
  button.textContent='Отправляем…';
  $('orderError').hidden=true;
  try{
    const response=await fetch('https://formsubmit.co/ajax/svoya.atmosfera.candle@yandex.ru',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({name:fd.get('name'),contact:fd.get('contact'),comment:fd.get('comment')||'—',order,_subject:'Новый заказ — Своя атмосфера',_template:'table'})
    });
    const data=await response.json();
    if(!response.ok||data.success===false)throw new Error();

    $('successSummary').innerHTML=sentCart.map(x=>{
      const p=products.find(p=>p.id===x.id);
      return `<div class="summary-line"><span>${productTitle(p)} × ${x.qty}</span><strong>${money(p.price*x.qty)}</strong></div>`;
    }).join('')+`<div class="summary-line summary-total"><strong>Итого</strong><strong>${sentTotal}</strong></div>`;

    e.target.reset();
    cart=[];
    save();
    closeModal('checkoutModal');
    openModal('successModal');
  }catch(err){
    $('orderError').hidden=false;
    $('orderError').innerHTML='<strong>Не удалось отправить заказ.</strong><br>Попробуйте ещё раз или напишите нам на <a href="mailto:svoya.atmosfera.candle@yandex.ru">svoya.atmosfera.candle@yandex.ru</a>.';
  }finally{
    button.disabled=false;
    button.textContent='Отправить заказ';
  }
};
