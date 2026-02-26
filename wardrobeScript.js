
 const STORAGE_KEY = 'styleBuddy_final_v6';
const DISABLE_DAYS = 2;
const EXPIRE_DAYS = 14;
const MS_DAY = 24 * 60 * 60 * 1000;
function changeGender() {
  const newGender = prompt("Enter gender (male/female):").toLowerCase();
  if (newGender === "male" || newGender === "female") {
    localStorage.setItem("userGender", newGender);
    location.reload();
  }
}

const clothesData = {
  male: {
    Casual: [
    { name: "T-shirt", image: "images/male/Tshirt.jpg" },
     { name: "Blue Jeans", image: "images/male/Jeans.jpg" },
     { name: "Sweatshirt", image: "images/male/Sweatshirt.jpg" },
     { name: "Cargo pants", image: "images/male/Cargo pants.jpg" },
     { name: "Polo shirt", image: "images/male/Polo shirt.jpg" },
     { name: "Denim jacket", image: "images/male/Denim jacket.jpg" },
     { name: "Shorts", image: "images/male/Shorts.jpg" },
     { name: "Shirt (casual)", image: "images/male/Shirt (casual).jpg" },
     { name: "Joggers", image: "images/male/Joggers.jpg" },
   ],

    Formal: [
    { name: "Blazer", image: "images/male/Blazer.jpg" },
    { name: "Waistcoat", image: "images/male/Waistcoat.jpg" },
    { name: "Suit", image: "images/male/Suit.jpg" },
    { name: "Formal coat", image: "images/male/Formal coat.jpg" },
   ],

       Partywear: [
   
    { name: "Party shirt", image: "images/male/Party shirt.jpg" },
    { name: "Velvet blazer", image: "images/male/Velvet blazer.jpg" },
    { name: "Designer kurta", image: "images/male/Designer kurta.jpg" },
    { name: "Stylish jacket", image: "images/male/Stylish jacket.jpg" },
     { name: "Embroidered shirt", image: "images/male/Embroidered shirt.jpg" },
  ],

     Nightwear: [
     { name: "Nightgown", image: "images/male/Nightgown.jpg" },
    { name: "Sleep shorts", image: "images/male/Sleep shorts.jpg" },
    { name: "Night suit", image: "images/male/Night suit.jpg" },
    { name: "Sleep T-shirt", image: "images/male/Sleep T-shirt.jpg" },
    { name: "Sleep trousers", image: "images/male/Sleep trousers.jpg" },
  ]
  },

  female: {
    Casual: [
      { name: "Crop Top", image: "images/female/crop-top.jpg" },
      { name: "Skirt", image: "images/female/skirt.jpg" },
      { name: "Kurti", image: "images/female/kurti.jpg" },
      { name: "Jeans", image: "images/female/jeans.jpg" },
      { name: "Denim Jacket", image: "images/female/denim-jacket.jpg" }
    ],

    Formal: [
      { name: "Pencil Skirt", image: "images/female/pencil-skirt.jpg" },
      { name: "Formal Dress", image: "images/female/formal-dress.jpg" },
      { name: "Blazer Dress", image: "images/female/blazer-dress.jpg" },
      { name: "Dress Pants", image: "images/female/dress-pants.jpg" }
    ],

    Partywear: [
      { name: "Sequin Dress", image: "images/female/sequin-dress.jpg" },
      { name: "Cocktail Gown", image: "images/female/cocktail-gown.jpg" },
      { name: "Glitter Top", image: "images/female/glitter-top.jpg" },
      { name: "Bodycon Dress", image: "images/female/bodycon-dress.jpg" }
    ],

    Nightwear: [
      { name: "Nightgown", image: "images/female/nightgown.jpg" },
      { name: "Cotton Nightdress", image: "images/female/cotton-nightdress.jpg" },
      { name: "Sleep Shorts", image: "images/female/sleep-shorts.jpg" },
      { name: "Robe", image: "images/female/robe.jpg" }
    ]
  }
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

let userAdded = JSON.parse(localStorage.getItem("userAddedOutfits")) || {
  male: {},
  female: {}
};
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
const userGender = localStorage.getItem("userGender") || "male";
const genderData = clothesData[userGender];
  
    Object.entries(genderData).forEach(([categoryName, items]) => {
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
   const allItems = [
  ...items,
  ...((userAdded[userGender] && userAdded[userGender][categoryName]) || [])
];
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
    deleteOutfit(categoryName, i, true);
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
  const userGender = localStorage.getItem("userGender") || "male";

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";

  document.body.appendChild(input);

  input.addEventListener("change", function () {
    const file = input.files[0];

    if (!file) {
      alert("Please select an image ❗");
      document.body.removeChild(input);
      return;
    }

    const name = prompt("Enter outfit name:");
    if (!name) {
      alert("Outfit name is required ❗");
      document.body.removeChild(input);
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const newItem = {
        name: name,
        image: e.target.result
      };

      if (!userAdded[userGender]) userAdded[userGender] = {};
      if (!userAdded[userGender][category])
        userAdded[userGender][category] = [];

      userAdded[userGender][category].push(newItem);

      localStorage.setItem(
        "userAddedOutfits",
        JSON.stringify(userAdded)
      );

      alert("Outfit Added Successfully ✅");

      document.body.removeChild(input);
      render();
    };

    reader.readAsDataURL(file);
  });

  input.click();
}



function deleteOutfit(category, index) {
  const userGender = localStorage.getItem("userGender") || "male";

  const defaultLength = clothesData[userGender][category].length;

  const userIndex = index - defaultLength;

  if (
    userAdded[userGender] &&
    userAdded[userGender][category] &&
    userAdded[userGender][category][userIndex] !== undefined
  ) {
    if (!confirm("Delete this outfit?")) return;

    userAdded[userGender][category].splice(userIndex, 1);

    localStorage.setItem(
      "userAddedOutfits",
      JSON.stringify(userAdded)
    );

    render();
  }
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
  const userGender = localStorage.getItem("userGender") || "male";
  const genderData = clothesData[userGender];

  const list = Object.entries(store)
    .filter(([_, r]) => r.confirmedAt && daysBetween(r.confirmedAt, now) < EXPIRE_DAYS);

  if (!list.length) {
    laundryList.innerHTML = '<p class="muted" style="text-align:center">No confirmed outfits yet.</p>';
    return;
  }

  list.forEach(([id, r]) => {
    const [prefix, index] = id.split('-');

    
    const category = Object.keys(genderData)
      .find(c => c.toLowerCase() === prefix);

    const defaultItems = genderData[category] || [];
    const allItems = [...defaultItems, ...((userAdded[userGender] && userAdded[userGender][category]) || [])]
     

    const item = allItems[index - 1];

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

