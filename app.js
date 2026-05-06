const products = {
  balenciaga: {
    img: 'https://www.image2url.com/r2/default/images/1777833784812-487608b3-853a-4e01-ab85-2d8c3464bceb.png',
    brand: 'Balenciaga', name: 'Pool Slides', price: 120, tag: 'Hot', tagClass: 'tag-hot',
    desc: 'The Balenciaga Pool Slides are the ultimate fusion of luxury and comfort. Crafted with a thick, contoured footbed that molds to your foot, they deliver cloud-like cushioning with every step. The wide strap sits securely without digging in — perfect for all-day wear. Premium rubber sole provides superior grip and durability, while the iconic branding elevates any fit.',
    colors: [{label:'Black',bg:'#111',border:'#444'},{label:'White',bg:'#f5f5f5',border:'#ccc'},{label:'Sand',bg:'#8B7355',border:'#8B7355'},{label:'Brown',bg:'#5a3e2b',border:'#5a3e2b'}],
    sizes: ['6','7','8','9','10','11','12'],
    oos: ['13']
  },
  essentials: {
    img: 'https://www.image2url.com/r2/default/images/1777833906108-f0e5a0b3-45ec-4fd0-97b3-eca57f3efdeb.png',
    brand: 'Essentials', name: 'Shorts', price: 75, tag: 'New', tagClass: 'tag-new',
    desc: 'Fear of God Essentials Shorts built for effortless style and all-day comfort. Made from a heavyweight cotton blend with a relaxed fit and elastic waistband. The subtle Essentials branding keeps it clean while the quality speaks for itself — a wardrobe staple that pairs with everything.',
    colors: [{label:'Cream',bg:'#e8dcc8',border:'#c9b99a'},{label:'Gray',bg:'#8a8a8a',border:'#666'}],
    sizes: ['XS','S','M','L','XL','XXL'],
    oos: []
  }
};

let cart = [];
let currentProduct = null;
let selectedColor = null;
let selectedSize = null;

// ── DRAWER ──
function openDrawer(id) {
  const p = products[id];
  if (!p) return;
  currentProduct = id;
  selectedColor = p.colors[0].label;
  selectedSize = null;

  document.getElementById('d-img').src = p.img;
  document.getElementById('d-brand').textContent = p.brand;
  document.getElementById('d-name').textContent = p.name;
  document.getElementById('d-price').textContent = '$' + p.price;
  document.getElementById('d-desc').textContent = p.desc;
  document.getElementById('d-tag').textContent = p.tag;
  document.getElementById('d-tag').className = 'd-tag ' + p.tagClass;
  document.getElementById('colorLabel').textContent = p.name + ' — ' + selectedColor;

  const cr = document.getElementById('colorRow');
  cr.innerHTML = '';
  p.colors.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'swatch' + (i === 0 ? ' active' : '');
    el.style.background = c.bg;
    el.style.border = '2px solid ' + c.border;
    el.dataset.color = c.label;
    if (c.img) el.dataset.img = c.img;
    el.title = c.label;
    el.onclick = function() { selectColor(this); };
    cr.appendChild(el);
  });

  const sr = document.getElementById('sizeRow');
  sr.innerHTML = '';
  p.sizes.forEach(s => {
    const el = document.createElement('div');
    el.className = 'sz';
    el.textContent = s;
    el.onclick = function() { selectSize(this); };
    sr.appendChild(el);
  });
  (p.oos || []).forEach(s => {
    const el = document.createElement('div');
    el.className = 'sz oos';
    el.textContent = s;
    el.title = 'Out of stock';
    sr.appendChild(el);
  });

  document.getElementById('drawer').classList.add('on');
  document.getElementById('overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('on');
  document.getElementById('overlay').classList.remove('on');
  document.body.style.overflow = '';
}

// ── CART ──
function openCart() {
  document.getElementById('drawer').classList.remove('on');
  document.getElementById('cartPanel').classList.add('on');
  document.getElementById('overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartPanel').classList.remove('on');
  document.getElementById('overlay').classList.remove('on');
  document.body.style.overflow = '';
}

function closeAll() { closeDrawer(); closeCart(); }

function selectColor(el) {
  document.querySelectorAll('#colorRow .swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  selectedColor = el.dataset.color;
  const p = products[currentProduct];
  document.getElementById('colorLabel').textContent = p.name + ' — ' + selectedColor;
  if (el.dataset.img) {
    const dimg = document.getElementById('d-img');
    dimg.style.opacity = '0';
    dimg.style.transition = 'opacity 0.3s';
    setTimeout(() => { dimg.src = el.dataset.img; dimg.style.opacity = '1'; }, 300);
  }
}

function selectSize(el) {
  if (el.classList.contains('oos')) return;
  document.querySelectorAll('#sizeRow .sz').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  selectedSize = el.textContent;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('on'), 2800);
}

function addToCart() {
  if (!selectedSize) { showToast('Please select a size'); return; }
  const p = products[currentProduct];
  cart.push({ id: currentProduct, name: p.name, brand: p.brand, price: p.price, img: p.img, size: selectedSize, color: selectedColor });
  updateCart();
  closeDrawer();
  showToast('Added to cart — ' + p.name + ' / Size ' + selectedSize);
}

function removeFromCart(i) {
  const body = document.getElementById('cpBody');
  const items = body.querySelectorAll('.cp-item');
  const el = items[i];
  if (!el) { cart.splice(i, 1); updateCart(); return; }
  dustExplode(el, () => { cart.splice(i, 1); updateCart(); });
}

function updateCart() {
  const count = cart.length;
  document.getElementById('cartBadge').textContent = count;
  document.getElementById('cpCount').textContent = count;
  const body = document.getElementById('cpBody');
  body.querySelectorAll('.cp-item').forEach(e => e.remove());
  const empty = document.getElementById('cpEmpty');
  if (count === 0) {
    empty.style.display = 'block';
    document.getElementById('cpCheckout').disabled = true;
  } else {
    empty.style.display = 'none';
    document.getElementById('cpCheckout').disabled = false;
    cart.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'cp-item';
      div.innerHTML = `<img class="cp-item-img" src="${item.img}" alt="${item.name}">
        <div class="cp-item-info">
          <div class="cp-item-brand">${item.brand}</div>
          <div class="cp-item-name">${item.name}</div>
          <div class="cp-item-meta">Size ${item.size} · ${item.color}</div>
          <div class="cp-item-price">$${item.price}</div>
        </div>
        <div class="cp-remove" onclick="removeFromCart(${i})">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>`;
      body.appendChild(div);
    });
  }
  const total = cart.reduce((s, i) => s + i.price, 0);
  document.getElementById('cpTotal').textContent = '$' + total.toFixed(2);
}

function checkout() {
  if (cart.length === 0) return;
  document.getElementById('warningOverlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}

// ── BUY NOW / TICKET FLOW ──
function buyNow() {
  if (!selectedSize) { showToast('Please select a size'); return; }
  const p = products[currentProduct];
  const already = cart.find(i => i.id === currentProduct && i.size === selectedSize && i.color === selectedColor);
  if (!already) {
    cart.push({ id: currentProduct, name: p.name, brand: p.brand, price: p.price, img: p.img, size: selectedSize, color: selectedColor });
    updateCart();
  }
  closeDrawer();
  document.getElementById('warningOverlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function agreeWarning() {
  document.getElementById('warningOverlay').classList.remove('on');
  document.getElementById('nameOverlay').classList.add('on');
  document.getElementById('buyerName').value = '';
  document.getElementById('buyerName').classList.remove('error');
  setTimeout(() => document.getElementById('buyerName').focus(), 100);
}

function declineWarning() {
  document.getElementById('warningOverlay').classList.remove('on');
  document.body.style.overflow = '';
}

function closeNameModal() {
  document.getElementById('nameOverlay').classList.remove('on');
  document.getElementById('warningOverlay').classList.add('on');
}

function finalizeTicket() {
  const name = document.getElementById('buyerName').value.trim();
  if (!name) {
    document.getElementById('buyerName').classList.add('error');
    setTimeout(() => document.getElementById('buyerName').classList.remove('error'), 1200);
    return;
  }
  document.getElementById('nameOverlay').classList.remove('on');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const ticketId = 'SB-' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '-' + Math.floor(Math.random() * 9000 + 1000);

  document.getElementById('ticketId').textContent = ticketId;
  document.getElementById('ticketDate').textContent = dateStr + ' at ' + timeStr;
  document.getElementById('ticketName').textContent = name;

  const itemsEl = document.getElementById('ticketItems');
  itemsEl.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'ticket-item';
    div.innerHTML = `
      <img class="ticket-item-img" src="${item.img}" alt="${item.name}">
      <div class="ticket-item-info">
        <div class="ticket-item-brand">${item.brand}</div>
        <div class="ticket-item-name">${item.name}</div>
        <div class="ticket-item-meta">Size ${item.size} · ${item.color}</div>
      </div>
      <div class="ticket-item-price">$${item.price}</div>`;
    itemsEl.appendChild(div);
  });

  const total = cart.reduce((s, i) => s + i.price, 0);
  document.getElementById('ticketTotal').textContent = '$' + total.toFixed(2);
  document.getElementById('ticketOverlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeTicket() {
  document.getElementById('ticketOverlay').classList.remove('on');
  document.body.style.overflow = '';
}

// ── SETTINGS ──
function toggleSettings() {
  document.getElementById('sPopup').classList.toggle('on');
  document.getElementById('sOverlay').classList.toggle('on');
}

// ── DUST ──
const dustCanvas = document.getElementById('dustCanvas');
const dctx = dustCanvas.getContext('2d');
let dustParticles = [];
let dustRAF = null;

function resizeDust() { dustCanvas.width = window.innerWidth; dustCanvas.height = window.innerHeight; }
resizeDust();
window.addEventListener('resize', resizeDust);

function dustExplode(el, onDone) {
  const rect = el.getBoundingClientRect();
  el.style.transition = 'opacity 0.15s';
  el.style.opacity = '0';
  for (let k = 0; k < 120; k++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 3.5;
    const size = 1.5 + Math.random() * 3;
    const life = 0.6 + Math.random() * 0.6;
    const grey = Math.floor(180 + Math.random() * 75);
    dustParticles.push({
      x: rect.left + Math.random() * rect.width,
      y: rect.top + Math.random() * rect.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 1.5,
      size, life, maxLife: life,
      color: `rgb(${grey},${grey},${grey})`
    });
  }
  if (!dustRAF) animateDust();
  setTimeout(() => { if (onDone) onDone(); }, 500);
}

function animateDust() {
  dctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
  dustParticles = dustParticles.filter(p => p.life > 0);
  dustParticles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.vx *= 0.97; p.life -= 0.018;
    const alpha = Math.max(0, p.life / p.maxLife);
    dctx.globalAlpha = alpha;
    dctx.fillStyle = p.color;
    dctx.beginPath();
    dctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    dctx.fill();
  });
  dctx.globalAlpha = 1;
  dustRAF = dustParticles.length > 0 ? requestAnimationFrame(animateDust) : null;
}

// ── VIDEO ──
const vbg = document.getElementById('vbg');
vbg.addEventListener('timeupdate', () => { if (vbg.currentTime >= 16.36) vbg.currentTime = 0; });
setInterval(() => {
  const hueShift = Math.sin(Date.now() / 4000) * 8;
  const brightness = 0.85 + Math.sin(Date.now() / 3000) * 0.06;
  vbg.style.filter = `saturate(1.3) brightness(${brightness}) hue-rotate(${hueShift}deg)`;
}, 50);
