const BASE_URL = "https://67b360fb392f4aa94fa6f65b.mockapi.io";

window.onload = async () => {
  await loadData();
};

// Function to load and display menu items as cards
const loadData = async (searchTerm = "") => {
  const response = await axios.get(`${BASE_URL}/menu`);
  let menu = response.data;

  if (searchTerm) {
    menu = menu.filter(
      (menu) =>
        String(menu.menu)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(menu.price)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }

  let menuHTMLData = `<div class="flex flex-wrap gap-8 justify-center">`;

  for (let i = 0; i < menu.length; i++) {
    menuHTMLData += `
      <a href="#" class="max-w-xs w-80 bg-white shadow-lg rounded-3xl transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl overflow-hidden flex flex-col">
          <!-- Image -->
          <div class="w-full h-48 bg-gray-300 overflow-hidden rounded-t-3xl">
              <img src="${menu[i].image}" class="w-full h-full object-cover" alt="Image">
          </div>

          <!-- Info -->
          <div class="p-6 flex flex-col items-center">
              <h4 class="text-xl font-bold text-gray-800 text-center">${menu[i].price}$</h4>
              <p class="mt-2 text-gray-600 text-center text-sm">อาหาร:${menu[i].menu}</p>
              <div class="mt-5 flex gap-3">
                  <button class="px-5 py-2 text-white bg-green-500 rounded-lg shadow-md transform hover:scale-105 transition duration-200" onclick="editUser(${menu[i].id})">
                      Edit <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button class="px-5 py-2 text-white bg-red-500 rounded-lg shadow-md transform hover:scale-105 transition duration-200" data-id='${menu[i].id}'>
                      Delete <i class="fa-solid fa-eraser"></i>
                  </button>
              </div>
          </div>
      </a>
    `;
  }

  menuHTMLData += `</div>`;

  let menuDOM = document.getElementById("search-results");
  menuDOM.innerHTML = menuHTMLData;

  let deleteDOMs = document.querySelectorAll("[data-id]");

  deleteDOMs.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const id = event.currentTarget.dataset.id;
      const result = await Swal.fire({
        title: "คุณต้องการลบรายการนี้หรือไม่?",
        text: "หากคุณลบแล้วข้อมูลจะหายไปทันที!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก"
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/menu/${id}`);
          loadData();
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
        }
      }
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("edited")) {
    await loadData();
  }
};

// Function to edit user
const editUser = async (id) => {
  // Fetch menu data from API
  const response = await axios.get(`${BASE_URL}/menu/${id}`);
  const menuData = response.data;

  // Show popup to edit data
  const { value: formValues } = await Swal.fire({
    title: "แก้ไขข้อมูลเมนู",
    html: `
      <div>
        <label for="menuName">ชื่อเมนู</label>
        <input id="menuName" class="swal2-input" value="${menuData.menu}">
      </div>
      <div>
        <label for="menuPrice">ราคา</label>
        <input id="menuPrice" class="swal2-input" value="${menuData.price}">
      </div>
      <div>
        <label for="menuImage">รูปภาพ URL</label>
        <input id="menuImage" class="swal2-input" value="${menuData.image}">
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        menu: document.getElementById('menuName').value,
        price: document.getElementById('menuPrice').value,
        image: document.getElementById('menuImage').value
      };
    }
  });

  if (formValues) {
    const updatedMenu = {
      menu: formValues.menu,
      price: formValues.price,
      image: formValues.image
    };

    try {
      // Update menu data in the API
      await axios.put(`${BASE_URL}/menu/${id}`, updatedMenu);
      Swal.fire("สำเร็จ!", "ข้อมูลเมนูได้ถูกแก้ไขแล้ว", "success");
      loadData(); // Reload data after update
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถแก้ไขข้อมูลได้", "error");
    }
  }
};

// Function to add new menu item
const addNewMenu = async () => {
  const { value: formValues } = await Swal.fire({
    title: "เพิ่มข้อมูลเมนูใหม่",
    html: `
      <div>
        <label for="newMenuName">ชื่อเมนู</label>
        <input id="newMenuName" class="swal2-input" placeholder="ชื่อเมนู">
      </div>
      <div>
        <label for="newMenuPrice">ราคา</label>
        <input id="newMenuPrice" class="swal2-input" placeholder="ราคา">
      </div>
      <div>
        <label for="newMenuImage">รูปภาพ URL</label>
        <input id="newMenuImage" class="swal2-input" placeholder="URL รูปภาพ">
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        menu: document.getElementById('newMenuName').value,
        price: document.getElementById('newMenuPrice').value,
        image: document.getElementById('newMenuImage').value
      };
    }
  });

  if (formValues) {
    const newMenu = {
      menu: formValues.menu,
      price: formValues.price,
      image: formValues.image
    };

    try {
      // Add new menu item via the API
      await axios.post(`${BASE_URL}/menu`, newMenu);
      Swal.fire("สำเร็จ!", "เมนูใหม่ถูกเพิ่มแล้ว", "success");
      loadData(); // Reload data after adding new item
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มเมนูใหม่:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มเมนูใหม่ได้", "error");
    }
  }
};

// Real-time search function
const searchInput = document.getElementById("search-bar");
searchInput.addEventListener("input", async (event) => {
  const searchTerm = event.target.value;
  await loadData(searchTerm);
});

// Add event listener for the 'Add New Menu' button
document.getElementById("addMenuButton").addEventListener("click", addNewMenu);
