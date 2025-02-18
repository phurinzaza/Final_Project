const BASE_URL = "https://67b360fb392f4aa94fa6f65b.mockapi.io";

window.onload = async () => {
  await loadData();
};

 
const loadData = async (searchTerm = "") => {
  const response = await axios.get(`${BASE_URL}/valo`);
  let valo = response.data;

  if (searchTerm) {
    valo = valo.filter(
      (valo) =>
        String(valo.name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(valo.style)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }

  let valoHTMLData = `<div class="flex flex-wrap gap-8 justify-center">`;

  for (let i = 0; i < valo.length; i++) {
    valoHTMLData += `
      <a href="#" class="max-w-xs w-80 bg-white shadow-lg rounded-3xl transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl overflow-hidden flex flex-col">
          <!-- Image -->
          <div class="w-full h-48 bg-gray-300 overflow-hidden rounded-t-3xl">
              <img src="${valo[i].image}" class="w-full h-full object-cover" alt="Image">
          </div>

          <!-- Info -->
          <div class="p-6 flex flex-col items-center">
              <h4 class="text-xl font-bold text-gray-800 text-center"> ${valo[i].name}</h4>
              <p class="mt-2 text-gray-600 text-center text-sm">สกิล:${valo[i].skill}</p>
              <p class="mt-2 text-gray-600 text-center text-sm">สไตล์:${valo[i].style}</p>
              <div class="mt-5 flex gap-3">
                  <button class="px-5 py-2 text-white bg-green-500 rounded-lg shadow-md transform hover:scale-105 transition duration-200" onclick="editUser(${valo[i].id})">
                      Edit <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button class="px-5 py-2 text-white bg-red-500 rounded-lg shadow-md transform hover:scale-105 transition duration-200" data-id='${valo[i].id}'>
                      Delete <i class="fa-solid fa-eraser"></i>
                  </button>
              </div>
          </div>
      </a>
    `;
  }

  valoHTMLData += `</div>`;

  let valoDOM = document.getElementById("search-results");
  valoDOM.innerHTML = valoHTMLData;

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
          await axios.delete(`${BASE_URL}/valo/${id}`);
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
  
  const response = await axios.get(`${BASE_URL}/valo/${id}`);
  const valoData = response.data;

  // Show popup to edit data
  const { value: formValues } = await Swal.fire({
    title: "แก้ไขข้อมูลเมนู",
    html: `
      <div>
        <label for="valoName">ชื่อเอเจนท์</label>
        <input id="valoName" class="swal2-input" value="${valoData.name}">
      </div>
      <div>
        <label for="valoskill">สกิลเอเจนท์</label>
        <input id="valoskill" class="swal2-input" value="${valoData.skill}">
      </div>
      <div>
        <label for="valostyle">สกิลเอเจนท์</label>
        <input id="valostyle" class="swal2-input" value="${valoData.style}">
      </div>
      <div>
        <label for="valoimg">รูปภาพ URL</label>
        <input id="valoimg" class="swal2-input" value="${valoData.image}">
      </div>
    `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        name: document.getElementById('valoName').value,
        skill: document.getElementById('valoskill').value,
        style: document.getElementById('valostyle').value,
        image: document.getElementById('valoimg').value
      };
    }
  });

  if (formValues) {
    const updatedvalo = {
        name: formValues.name,
        skill: formValues.skill,
        style: formValues.style,
        image: formValues.image
    };

    try {
      
      await axios.put(`${BASE_URL}/valo/${id}`, updatedvalo);
      Swal.fire("สำเร็จ!", "ข้อมูลเมนูได้ถูกแก้ไขแล้ว", "success");
      loadData(); // Reload data after update
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถแก้ไขข้อมูลได้", "error");
    }
  }
};

 
const addNewvalo = async () => {
    const { value: formValues } = await Swal.fire({
      title: "เพิ่มข้อมูลเมนูใหม่",
      html: `
        <div>
          <label for="valoName">ชื่อเอเจนท์</label>
          <input id="valoName" class="swal2-input" placeholder="ชื่อเอเจนท์">
        </div>
        <div>
          <label for="valoskill">สกิลเอเจนท์</label>
          <input id="valoskill" class="swal2-input" placeholder="สกิลเอเจนท์">
        </div>
        <div>
          <label for="valostyle">สไตล์เอเจนท์</label>
          <input id="valostyle" class="swal2-input" placeholder="สไตล์เอเจนท์">
        </div>
        <div>
          <label for="valoimg">รูปภาพ URL</label>
          <input id="valoimg" class="swal2-input" placeholder="URL ของรูปภาพ">
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById('valoName').value,
          skill: document.getElementById('valoskill').value,
          style: document.getElementById('valostyle').value,
          image: document.getElementById('valoimg').value
        };
      }
    });
  
    if (formValues) {
      const newvalo = {
        name: formValues.name,
        skill: formValues.skill,
        style: formValues.style,
        image: formValues.image
      };
  
      try {
        await axios.post(`${BASE_URL}/valo`, newvalo);
        Swal.fire("สำเร็จ!", "เมนูใหม่ถูกเพิ่มแล้ว", "success");
        loadData(); // รีเฟรชข้อมูลหลังจากเพิ่มใหม่
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

 
document.getElementById("addvaloButton").addEventListener("click", addNewvalo);
