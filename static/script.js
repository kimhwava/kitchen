function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

function confirmAdd(type) {
  return confirm(`คุณต้องการเพิ่ม${type}นี้หรือไม่?`);
}

function confirmDelete(type) {
  return confirm(`คุณแน่ใจว่าต้องการลบ${type}นี้?`);
}

function filterMenu() {
  const searchText = document.getElementById("searchMenu").value.toLowerCase();
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

  document.querySelectorAll("#menuList .menu-item").forEach(item => {
    const name = item.querySelector(".menu-name").textContent.toLowerCase();
    const price = parseFloat(item.getAttribute("data-price"));
    item.style.display = (name.includes(searchText) && price >= minPrice && price <= maxPrice) ? "block" : "none";
  });
}

function filterIngredient() {
  const searchText = document.getElementById("searchIngredient").value.toLowerCase();
  document.querySelectorAll("#ingredientList .ingredient-item").forEach(item => {
    const name = item.querySelector(".ingredient-name").textContent.toLowerCase();
    item.style.display = name.includes(searchText) ? "block" : "none";
  });
}

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("show");
}

// ปิดเมนูเมื่อคลิกนอกเมนู
document.addEventListener("click", function(event) {
  const menu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");
  if (!menu.contains(event.target) && !hamburger.contains(event.target) && menu.classList.contains("show")) {
    menu.classList.remove("show");
  }
});

function toggleMenuList() {
  const items = document.querySelectorAll("#menuList .menu-item");
  const btn = document.getElementById("toggleMenuBtn");
  const isExpanded = btn.dataset.expanded === "true";

  items.forEach(item => {
    item.classList.toggle("visible", !isExpanded);
  });

  const total = items.length;
  btn.textContent = isExpanded ? `ดูเพิ่มเติม (มีทั้งหมด ${total} รายการ)` : `ซ่อนรายการทั้งหมด`;
  btn.dataset.expanded = isExpanded ? "false" : "true";
}

function toggleIngredientList() {
  const items = document.querySelectorAll("#ingredientList .ingredient-item");
  const btn = document.getElementById("toggleIngredientBtn");
  const isExpanded = btn.dataset.expanded === "true";

  items.forEach(item => {
    item.classList.toggle("visible", !isExpanded);
  });

  const total = items.length;
  btn.textContent = isExpanded ? `ดูเพิ่มเติม (มีทั้งหมด ${total} รายการ)` : `ซ่อนรายการทั้งหมด`;
  btn.dataset.expanded = isExpanded ? "false" : "true";
}

document.addEventListener("DOMContentLoaded", () => {
  // 🌙 โหลดธีม
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }

  // Select2
  if (typeof $ !== "undefined" && $.fn.select2) {
    $('#menuSelect').select2({ placeholder: "เลือกเมนู", allowClear: true, width: '100%' });
    $('#ingredientSelect').select2({ placeholder: "เลือกวัตถุดิบ", allowClear: true, width: '100%' });
    $('#unitSelect').select2({ placeholder: "เลือกหน่วย", allowClear: true, width: '100%' });
  }

  // แสดง 3 รายการแรก
  document.querySelectorAll("#menuList .menu-item").forEach((item, index) => {
    if (index < 3) item.classList.add("visible");
  });
  document.querySelectorAll("#ingredientList .ingredient-item").forEach((item, index) => {
    if (index < 3) item.classList.add("visible");
  });

  // ปุ่มและค่าเริ่มต้น
  const menuTotal = document.querySelectorAll("#menuList .menu-item").length;
  const ingTotal = document.querySelectorAll("#ingredientList .ingredient-item").length;
  const menuBtn = document.getElementById("toggleMenuBtn");
  const ingBtn = document.getElementById("toggleIngredientBtn");

  if (menuBtn) {
    menuBtn.textContent = `ดูเพิ่มเติม (มีทั้งหมด ${menuTotal} รายการ)`;
    menuBtn.dataset.expanded = "false";
  }
  if (ingBtn) {
    ingBtn.textContent = `ดูเพิ่มเติม (มีทั้งหมด ${ingTotal} รายการ)`;
    ingBtn.dataset.expanded = "false";
  }

  // ปิดเมนูเมื่อกดลิงก์ในเมนู
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', function() {
      document.getElementById("mobileMenu").classList.remove("show");
    });
  });

  // ✅ โหลดเมนูที่เลือกไว้ล่าสุด (ถ้ามี)
  const lastMenu = localStorage.getItem("lastSelectedMenu");
  if (lastMenu) {
    document.getElementById("menuSelect").value = lastMenu;
    if (typeof $ !== "undefined" && $.fn.select2) {
      $('#menuSelect').trigger('change'); // อัปเดต UI ของ select2
    }
  }

  // ✅ โหลดตำแหน่ง scroll ล่าสุด (ถ้ามี)
  const scrollPos = localStorage.getItem("scrollPosition");
  if (scrollPos) {
    window.scrollTo(0, parseInt(scrollPos));
    localStorage.removeItem("scrollPosition");
  }
});

// ✅ เก็บเมนูที่เลือกไว้ก่อนส่งฟอร์มผูกวัตถุดิบ
document.getElementById("assignIngredientForm")?.addEventListener("submit", function() {
  const selectedMenu = document.getElementById("menuSelect").value;
  localStorage.setItem("lastSelectedMenu", selectedMenu);
});

// ✅ เก็บตำแหน่ง scroll ก่อนส่งฟอร์มใด ๆ
document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", () => {
    localStorage.setItem("scrollPosition", window.scrollY);
  });
});

// แสดง/ซ่อนปุ่ม Go to Top เมื่อเลื่อนลง
window.addEventListener("scroll", () => {
  const goTopBtn = document.getElementById("goTopBtn");
  if (goTopBtn) {
    goTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  }
});

// ฟังก์ชันเลื่อนขึ้นบนสุด
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.log("Service Worker registration failed:", err));
}