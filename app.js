
// Data produk terlaris (maks 5)
const products = [
  {id:'h1', name:'Hijab Satin', price:69000, img:'assets/svg/hijab1.svg', desc:'Lembut, glossy, jatuh elegan.'},
  {id:'h2', name:'Hijab Voal', price:59000, img:'assets/svg/hijab2.svg', desc:'Ringan, mudah dibentuk, adem.'},
  {id:'h3', name:'Hijab Paris', price:45000, img:'assets/svg/hijab3.svg', desc:'Casual harian, anti ribet.'},
  {id:'h4', name:'Hijab Motif', price:78000, img:'assets/svg/hijab4.svg', desc:'Motif eksklusif, cetak tajam.'},
  {id:'h5', name:'Hijab Square', price:52000, img:'assets/svg/hijab5.svg', desc:'Serbaguna untuk semua gaya.'},
];

const slidesEl = document.getElementById('slides');
const dotsWrap = document.getElementById('dots');
let current = 0, timer = null;

function renderSlides() {
  slidesEl.innerHTML = '';
  dotsWrap.innerHTML = '';
  products.slice(0,5).forEach((p,i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
      <div class="img-wrap"><img src="${p.img}" alt="${p.name}"></div>
      <div class="info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">Rp${p.price.toLocaleString()}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn outline" onclick="addToCart('${p.id}')">Tambahkan ke Keranjang</button>
          <a href="#checkout" class="btn primary">Checkout</a>
        </div>
      </div>
    `;
    slidesEl.appendChild(slide);

    const dot = document.createElement('button');
    if (i===current) dot.classList.add('active');
    dot.addEventListener('click', ()=> goTo(i));
    dotsWrap.appendChild(dot);
  });
  updateTransform();
}
function updateTransform(){ slidesEl.style.transform = `translateX(-${current*100}%)`; dotsWrap.querySelectorAll('button').forEach((b,i)=> b.classList.toggle('active', i===current)); }
function goTo(i){ current=(i+products.length)%products.length; updateTransform(); restartAuto(); }
function next(){ goTo(current+1) } function prev(){ goTo(current-1) }
document.getElementById('next').addEventListener('click', next);
document.getElementById('prev').addEventListener('click', prev);
document.getElementById('slider').addEventListener('mouseenter', ()=>clearInterval(timer));
document.getElementById('slider').addEventListener('mouseleave', startAuto);
function startAuto(){ timer = setInterval(next, 4500) }
function stopAuto(){ clearInterval(timer) }
function restartAuto(){ stopAuto(); startAuto(); }

const KEY='scraftology_cart_v1';
function getCart(){ return JSON.parse(localStorage.getItem(KEY)||'[]'); }
function saveCart(c){ localStorage.setItem(KEY, JSON.stringify(c)); updateCart(); renderCheckout(); }
function addToCart(id){ const p=products.find(x=>x.id===id); if(!p) return; const cart=getCart(); const exist=cart.find(i=>i.id===id); if(exist) exist.qty+=1; else cart.push({id:p.id,name:p.name,price:p.price,img:p.img,qty:1}); saveCart(cart); toast(p.name+' ditambahkan'); openCart(); }
function removeFromCart(id){ saveCart(getCart().filter(i=>i.id!==id)); }
function changeCartQty(id,delta){ const c=getCart().map(i=> i.id===id ? {...i, qty: Math.max(1,i.qty+delta)} : i); saveCart(c); }
function updateCart(){ const cart=getCart(); const count=cart.reduce((a,b)=>a+b.qty,0); document.getElementById('cartCount').textContent=count;
  const wrap=document.getElementById('cartItems'); wrap.innerHTML=''; let total=0;
  cart.forEach(it=>{ total+=it.price*it.qty; const row=document.createElement('div'); row.className='cart-item'; row.innerHTML=`
      <img src="${it.img}" alt="${it.name}">
      <div style="flex:1">
        <strong>${it.name}</strong>
        <div class="muted">Rp${it.price.toLocaleString()} × ${it.qty}</div>
        <div style="display:flex;gap:6px;margin-top:6px">
          <button class="btn ghost" onclick="changeCartQty('${it.id}',-1)">−</button>
          <button class="btn ghost" onclick="changeCartQty('${it.id}',1)">+</button>
          <button class="btn outline" onclick="removeFromCart('${it.id}')">Hapus</button>
        </div>
      </div>
      <div style="font-weight:800">Rp${(it.price*it.qty).toLocaleString()}</div>
    `; wrap.appendChild(row); });
  document.getElementById('cartTotal').textContent='Rp'+total.toLocaleString();
}
document.getElementById('openCart').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('clearCart').addEventListener('click', ()=> saveCart([]));
document.getElementById('gotoCheckout').addEventListener('click', ()=> location.hash='checkout');

function openCart(){ document.getElementById('cartDrawer').classList.add('open'); document.getElementById('overlay').hidden=false; }
function closeCart(){ document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('overlay').hidden=true; }

function renderCheckout(){ const checkoutItems=document.getElementById('checkoutItems'); const cart=getCart(); checkoutItems.innerHTML=''; let subtotal=0;
  cart.forEach(i=>{ subtotal+=i.price*i.qty; const row=document.createElement('div'); row.className='checkout-item'; row.innerHTML=`
      <img src="${i.img}" alt="${i.name}">
      <div><div>${i.name}</div><div class="muted">Rp${i.price.toLocaleString()} × ${i.qty}</div></div>
      <div style="font-weight:800">Rp${(i.price*i.qty).toLocaleString()}</div>
    `; checkoutItems.appendChild(row); });
  const tax=Math.round(subtotal*0.1);
  document.getElementById('subtotal').textContent='Rp'+subtotal.toLocaleString();
  document.getElementById('tax').textContent='Rp'+tax.toLocaleString();
  document.getElementById('grandTotal').textContent='Rp'+(subtotal+tax).toLocaleString();
}
document.getElementById('cartCheckout').addEventListener('click', ()=> location.hash='checkout');
document.getElementById('checkoutForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const f=e.currentTarget; if(!f.reportValidity()) return;
  toast('Pesanan dibuat! Tim kami akan menghubungi kamu.');
  saveCart([]); f.reset(); window.scrollTo({top:0,behavior:'smooth'});
});

const TESTI_KEY='scraftology_testi_v1';
function getTesti(){ return JSON.parse(localStorage.getItem(TESTI_KEY)||'[]'); }
function saveTesti(list){ localStorage.setItem(TESTI_KEY, JSON.stringify(list)); renderTesti(); }
function renderTesti(){ const list=getTesti(); const wrap=document.getElementById('testiList'); wrap.innerHTML='';
  const seed = list.length===0 ? [{name:'Naya',rating:5,message:'Bahannya adem dan mudah dibentuk.'},{name:'Rina',rating:5,message:'Motifnya cantik banget, pengiriman cepat!'}] : list;
  seed.forEach(t=>{ const el=document.createElement('div'); el.className='testi'; el.innerHTML=`
    <div class="name">${t.name}</div>
    <div class="rating">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div>
    <p>${t.message}</p>`; wrap.appendChild(el); });
}
document.getElementById('testiForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const f=e.currentTarget; if(!f.reportValidity()) return;
  const data = {name:f.name.value.trim()||'Anonim', rating: parseInt(f.rating.value,10)||5, message:f.message.value.trim()};
  if(!data.message) return;
  saveTesti([...getTesti(), data]);
  toast('Terima kasih untuk testimoninya!'); f.reset();
});

document.getElementById('feedbackForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const f=e.currentTarget; if(!f.reportValidity()) return;
  toast('Terima kasih atas masukannya!'); f.reset();
});

function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600); }
document.getElementById('year').textContent = new Date().getFullYear();

renderSlides(); startAuto(); updateCart(); renderCheckout(); renderTesti();

function startAuto(){ timer = setInterval(next, 4500) }
function next(){ goTo(current+1) }
function goTo(i){ current=(i+products.length)%products.length; updateTransform(); restartAuto(); }
function updateTransform(){ slidesEl.style.transform = `translateX(-${current*100}%)`; dotsWrap.querySelectorAll('button').forEach((b,i)=> b.classList.toggle('active', i===current)); }
function restartAuto(){ clearInterval(timer); startAuto(); }
