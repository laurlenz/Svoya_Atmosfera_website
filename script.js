const imageMap = {};
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
let cart=JSON.parse(localStorage.getItem('svoyaCart')||'[]');
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const $=id=>document.getElementById(id);
function renderGrid(cat,id){
  $(id).innerHTML=products.filter(p=>p.cat===cat).map(p=>`<article class="product-card" data-id="${p.id}"><div class="product-photo no-photo"></div><div class="product-name">${p.name}</div><div class="product-latin">${p.latin}</div><div class="product-meta"><span>${p.size}</span><strong class="product-price">${money(p.price)}</strong></div></article>`).join('');
}
renderGrid('candles','candlesGrid');renderGrid('diffusers','diffusersGrid');renderGrid('car','carGrid');renderGrid('sachets','sachetsGrid');
function save(){localStorage.setItem('svoyaCart',JSON.stringify(cart));updateCart()}
function updateCart(){
 $('cartCount').textContent=cart.reduce((a,x)=>a+x.qty,0);
 $('cartItems').innerHTML=cart.length?cart.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="cart-row"><div class="cart-thumb"></div><div><strong>${p.name}</strong><small>${p.size} · ${money(p.price)}</small><div class="qty"><button data-minus="${p.id}">−</button><span>${x.qty}</span><button data-plus="${p.id}">+</button></div></div><button class="remove" data-remove="${p.id}">Удалить</button></div>`}).join(''):'<p class="empty">Корзина пока пуста.</p>';
 $('cartTotal').textContent=money(cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.qty,0));
}
function add(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save()}
function openDrawer(){$('cartDrawer').classList.add('open');$('backdrop').classList.add('open')}
function closeDrawer(){$('cartDrawer').classList.remove('open');$('backdrop').classList.remove('open')}
updateCart();
$('openCart').onclick=openDrawer;$('closeCart').onclick=closeDrawer;$('backdrop').onclick=closeDrawer;
document.addEventListener('click',e=>{
 const card=e.target.closest('.product-card');
 if(card){const p=products.find(p=>p.id===card.dataset.id);$('modalImage').style.display='none';$('modalLatin').textContent=p.latin;$('modalName').textContent=p.name;$('modalDesc').textContent=p.desc;$('modalSize').textContent=p.size;$('modalPrice').textContent=money(p.price);$('modalAdd').dataset.id=p.id;$('productModal').classList.add('open');return}
 if(e.target.dataset.plus){add(e.target.dataset.plus);return}
 if(e.target.dataset.minus){const item=cart.find(x=>x.id===e.target.dataset.minus);if(item){item.qty--;if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);save()}return}
 if(e.target.dataset.remove){cart=cart.filter(x=>x.id!==e.target.dataset.remove);save();return}
 if(e.target.dataset.close){$(e.target.dataset.close).classList.remove('open');}
});
$('modalAdd').onclick=()=>{add($('modalAdd').dataset.id);$('productModal').classList.remove('open');openDrawer()};
$('checkoutBtn').onclick=()=>{
 if(!cart.length){alert('Добавьте товар в корзину.');return}
 $('checkoutSummary').innerHTML=cart.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="summary-line"><span>${p.name} × ${x.qty}</span><strong>${money(p.price*x.qty)}</strong></div>`}).join('')+`<div class="summary-line"><strong>Итого</strong><strong>${$('cartTotal').textContent}</strong></div>`;
 $('checkoutModal').classList.add('open');closeDrawer();
};
$('orderForm').onsubmit=async e=>{
 e.preventDefault();const fd=new FormData(e.target);
 const lines=cart.map(x=>{const p=products.find(p=>p.id===x.id);return `${p.name} — ${p.size} × ${x.qty} — ${money(p.price*x.qty)}`}).join('\n');
 const order=`ЗАКАЗ «СВОЯ АТМОСФЕРА»\n\n${lines}\n\nИтого: ${$('cartTotal').textContent}\n\nИмя: ${fd.get('name')}\nКонтакт: ${fd.get('contact')}\nКомментарий: ${fd.get('comment')||'—'}`;
 const button=e.target.querySelector('button[type="submit"]');button.disabled=true;button.textContent='Отправляем…';
 try{
  const response=await fetch('https://formsubmit.co/ajax/svoya.atmosfera.candle@yandex.ru',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name:fd.get('name'),contact:fd.get('contact'),comment:fd.get('comment')||'—',order,_subject:'Новый заказ — Своя атмосфера',_template:'table'})});
  const data=await response.json();if(!response.ok||data.success===false)throw new Error();
  $('orderResult').hidden=false;$('orderResult').innerHTML='<strong>Заказ отправлен.</strong><br>Спасибо! Мы свяжемся с вами для подтверждения заказа и доставки.';e.target.reset();cart=[];save();
 }catch(err){$('orderResult').hidden=false;$('orderResult').innerHTML='<strong>Не удалось отправить заказ.</strong><br>Попробуйте ещё раз или напишите нам на <a href="mailto:svoya.atmosfera.candle@yandex.ru">svoya.atmosfera.candle@yandex.ru</a>.'}
 finally{button.disabled=false;button.textContent='Отправить заказ'}
};
