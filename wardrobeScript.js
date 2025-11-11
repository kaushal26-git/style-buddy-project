
const STORAGE_KEY = 'styleBuddy_final_v6';
const DISABLE_DAYS = 2;
const EXPIRE_DAYS = 14;
const MS_DAY = 24 * 60 * 60 * 1000;

const clothesData = {
  Casual: [
    { name: "T-shirt", image: "images/Tshirt.jpg" },
     { name: "Blue Jeans", image: "images/Jeans.jpg" },
     { name: "Sweatshirt", image: "images/Sweatshirt.jpg" },
     { name: "Cargo pants", image: "images/Cargo pants.jpg" },
     { name: "Polo shirt", image: "images/Polo shirt.jpg" },
     { name: "Denim jacket", image: "images/Denim jacket.jpg" },
     { name: "Shorts", image: "images/Shorts.jpg" },
     { name: "Shirt (casual)", image: "images/Shirt (casual).jpg" },
     { name: "Joggers", image: "images/Joggers.jpg" },
   ],
   Formal: [
    { name: "Blazer", image: "images/Blazer.jpg" },
    { name: "Trousers", image: "images/Trousers.jpg" },
    { name: "Waistcoat", image: "images/Waistcoat.jpg" },
    { name: "Suit", image: "images/Suit.jpg" },
    { name: "Formal coat", image: "images/Formal coat.jpg" },
    { name: "Pencil skirt", image: "images/Pencil skirt.jpg" },
     { name: "Formal dress", image: "images/Formal dress.jpg" },
     { name: "Dress pants", image: "images/Dress pants.jpg" },
   ],
   Partywear: [
    { name: "Sequin dress", image: "images/Sequin dress.jpg" },
    { name: "Cocktail gown", image: "images/Cocktail gown.jpg" },
    { name: "Party shirt", image: "images/Party shirt.jpg" },
    { name: "Velvet blazer", image: "images/Velvet blazer.jpg" },
    { name: "Designer kurta", image: "images/Designer kurta.jpg" },
     { name: "Skater dress", image: "images/Skater dress.jpg" },
    { name: "Glitter top", image: "images/Glitter top.jpg" },
    { name: "Bodycon dress", image: "images/Bodycon dress.jpg" },
    { name: "Stylish jacket", image: "images/Stylish jacket.jpg" },
     { name: "Embroidered shirt", image: "images/Embroidered shirt.jpg" },
  ],
  Nightwear: [
    { name: "Pajama set", image: "images/Pajama set.jpg" },
     { name: "Nightgown", image: "images/Nightgown.jpg" },
    { name: "Sleep shorts", image: "images/Sleep shorts.jpg" },
    { name: "Night suit", image: "images/Night suit.jpg" },
    { name: "Sleep T-shirt", image: "images/Sleep T-shirt.jpg" },
    { name: "Cotton nightdress", image: "images/Cotton nightdress.jpg" },
    { name: "Sleep trousers", image: "images/Sleep trousers.jpg" },
    { name: "Robe", image: "images/Robe.jpg" },
  ]
};

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function save(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
function todayStr() { return new Date().toISOString().split('T')[0]; }
function daysBetween(a, b) {
  const A = new Date(a), B = new Date(b);
  return Math.floor((B - A) / MS_DAY);
}

let store = load();
let userAdded = JSON.parse(localStorage.getItem("userAddedOutfits") || "{}");

function clean() {
  let changed = false;
  const now = new Date();
  for (const id in store) {
    const r = store[id];
    if (!r || !r.confirmedAt || daysBetween(r.confirmedAt, now) >= EXPIRE_DAYS) {
      delete store[id];
      changed = true;
    }
  }
  if (changed) save(store);
}

const app = document.getElementById('app');
const laundryList = document.getElementById('laundryList');

function render() {
  clean();
  app.innerHTML = '';

  Object.entries(clothesData).forEach(([categoryName, items]) => {
    const prefix = categoryName.toLowerCase();
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="cat-header">
        <div class="cat-title">${categoryName}</div>
        <div class="arrow">▼</div>
      </div>
      <div class="cat-body"><div class="outfit-grid"></div></div>
    `;

    const grid = card.querySelector('.outfit-grid');
    const allItems = [...items, ...(userAdded[categoryName] || [])];

    allItems.forEach((item, i) => {
      const id = `${prefix}-${i + 1}`;
      const rec = store[id] || { lastWore: null, times: 0, confirmedAt: null };
      const disabled = rec.confirmedAt && daysBetween(rec.confirmedAt, new Date()) < DISABLE_DAYS;

      const box = document.createElement('div');
      box.className = 'outfit';
      box.dataset.id = id;
      box.innerHTML = `
        <input type="checkbox" ${disabled ? 'disabled checked' : ''}>
        <img src="${item.image}" alt="${item.name}" onerror="this.style.opacity=.4">
        <p>${item.name}</p>
        <div class="muted">Worn: <strong>${rec.times || 0}</strong></div>
      `;

      
      if (i >= items.length) {
        const del = document.createElement('button');
        del.textContent = '❌';
        del.className = 'delete-btn';
        del.addEventListener('click', e => {
          e.stopPropagation();
          deleteOutfit(categoryName, i - items.length);
        });
        box.appendChild(del);
      }

      box.addEventListener('click', e => {
        const cb = box.querySelector('input');
        if (e.target === cb || cb.disabled) return;
        cb.checked = !cb.checked;
      });
      grid.appendChild(box);
    });

    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.textContent = '+ Add Outfit';
    addBtn.addEventListener('click', () => addOutfit(categoryName));
    grid.appendChild(addBtn);

    const btn = document.createElement('button');
    btn.className = 'select-btn';
    btn.textContent = 'Selected';
    btn.addEventListener('click', () => confirmSelection(prefix, allItems));
    card.querySelector('.cat-body').appendChild(btn);

    const head = card.querySelector('.cat-header');
    const body = card.querySelector('.cat-body');
    const arrow = card.querySelector('.arrow');
    head.addEventListener('click', () => {
      const open = body.classList.toggle('open');
      arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    app.appendChild(card);
  });

  renderLaundry();
}

function addOutfit(category) {
  const name = prompt("Enter outfit name:");
  if (!name) return;

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newItem = { name, image: reader.result };

      if (!userAdded[category]) userAdded[category] = [];
      userAdded[category].push(newItem);
      localStorage.setItem("userAddedOutfits", JSON.stringify(userAdded));

      render();
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
}

function deleteOutfit(category, index) {
  if (!confirm("Are you sure you want to delete this outfit?")) return;
  userAdded[category].splice(index, 1);
  localStorage.setItem("userAddedOutfits", JSON.stringify(userAdded));
  render();
}

function confirmSelection(prefix, items) {
  const checkedBoxes = [...document.querySelectorAll(`.outfit[data-id^="${prefix}-"] input:checked`)]
    .filter(cb => !cb.disabled);

  if (!checkedBoxes.length) {
    alert('Select some clothes first!');
    return;
  }

  const today = todayStr();
  checkedBoxes.forEach(cb => {
    const id = cb.closest('.outfit').dataset.id;
    const old = store[id] || { times: 0 };
    store[id] = { lastWore: today, times: (old.times || 0) + 1, confirmedAt: today };
    cb.checked = true;
    cb.disabled = true;
  });

  save(store);
  renderLaundry();
  setTimeout(render, 100);
}

function renderLaundry() {
  laundryList.innerHTML = '';
  const now = new Date();
  const list = Object.entries(store)
    .filter(([_, r]) => r.confirmedAt && daysBetween(r.confirmedAt, now) < EXPIRE_DAYS);

  if (!list.length) {
    laundryList.innerHTML = '<p class="muted" style="text-align:center">No confirmed outfits yet.</p>';
    return;
  }

  list.forEach(([id, r]) => {
    const [prefix, index] = id.split('-');
    const category = Object.keys(clothesData).find(c => c.toLowerCase() === prefix);
    const item = clothesData[category]?.[index - 1] || userAdded[category]?.[index - 1];
    const name = item?.name || id;
    const img = item?.image || '';
    const last = r.lastWore || '—';
    const times = r.times || 0;
    const d = r.lastWore ? daysBetween(r.lastWore, now) : 99;
    const avail = d <= DISABLE_DAYS ? 'No' : 'Yes';

    const div = document.createElement('div');
    div.className = 'laundry-item';
    div.innerHTML = `
      <img src="${img}" alt="${name}">
      <div class="laundry-details">
        <strong>${name}</strong>
        <p class="muted">Last Wore: ${last}</p>
        <p class="muted">No. of times wore: ${times}</p>
        <p>Availability: ${
          avail === 'Yes'
            ? '<span class="badge-yes">Yes</span>'
            : '<span class="badge-no">No</span>'
        }</p>
      </div>
    `;
    laundryList.appendChild(div);
  });
}

render();
