// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  console.log(`Data disimpan ke localStorage dengan key: ${key}`);
}

// Fungsi untuk mengambil data dari localStorage atau fetch dari file JSON jika belum ada
async function fetchDataset() {
  console.log("Memulai fetchDataset...");

  const localData = localStorage.getItem('updatedDataset');
  if (localData) {
      console.log("Data ditemukan di localStorage:", JSON.parse(localData));
      return JSON.parse(localData); // Menggunakan data dari localStorage
  } else {
      console.log("Data tidak ditemukan di localStorage, melakukan fetch dari JSON...");
      try {
          const response = await fetch("./data/updatedDataset.json"); // URL JSON aslinya
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          saveToLocalStorage("updatedDataset", data); // Simpan ke localStorage
          return data;
      } catch (error) {
          console.error("Fetch error:", error);
          return [];
      }
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await fetchDataset();

  if (document.getElementById("laptopListAdmin")) {
    const totalItems = laptopsData.length;
    displayLaptopsAdmin();
    createAdminPagination(totalItems);
  }

  initializeDefaultWeights();
  displayWeightsInUI();

  if (document.getElementById("pagination")) {
    displayLaptops();
    createPagination();
  }

});

document.addEventListener("DOMContentLoaded", function () {
  const driver = window.driver.js.driver;
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        popover: {
          title: 'Selamat Datang! 😉',
          description: '<center><dotlottie-player class="animate__animated animate__fadeInRight animate_25ms mb-4" src="https://assets-v2.lottiefiles.com/a/406ea70a-117b-11ee-b032-b7c55ec812d5/x3Sz2IKXxN.lottie" background="transparent" speed="1" style="width: 200px" loop autoplay></dotlottie-player></center><p class="animate__animated animate__fadeInRight animate_25ms">LapFinder adalah aplikasi yang membantu kamu menemukan laptop yang cocok untuk kebutuhan kuliah kamu. Klik next untuk melanjutkan.</p>'
        },
      },
      {
        element: '#budget',
        popover: {
          title: 'Budget kamu 💵',
          description: 'Masukkan budget yang kamu miliki untuk membeli laptop, biar gak kemahalan h3h3',
          side: "left",
          align: 'start'
        }
      },
      {
        element: '#prodi',
        popover: {
          title: 'Program Studi 📚',
          description: 'Pilih program studi kamu, biar kami bisa memberikan rekomendasi laptop yang sesuai dengan kebutuhan kamu',
          side: "right",
          align: 'start'
        }
      },
      {
        element: '#getRecommendationBtn',
        popover: {
          title: 'Cari Laptop 🚀',
          description: 'Klik tombol ini untuk mendapatkan rekomendasi laptop yang sesuai dengan kebutuhan kamu',
          side: "left",
          align: 'start'
        }
      },
      {
        popover: {
          title: 'Selesai! 🎉',
          description: '<center><dotlottie-player class="animate__animated animate__fadeInRight animate_25ms mb-4" src="https://assets-v2.lottiefiles.com/a/6544d232-ae35-11ee-9770-b7be24456b50/qvvTcwZe42.lottie" background="transparent" speed="1" style="width: 200px" loop autoplay></dotlottie-player></center><p class="animate__animated animate__fadeInRight animate_25ms">Terima kasih sudah menggunakan LapFinder, semoga kamu menemukan laptop yang sesuai dengan kebutuhan kamu. Klik Done untuk menutup tutorial.</p>',
          done: true
        }
      }
    ]
  });
  driverObj.drive();
});


//Display Laptop User
const itemsPerPage = 12;
let currentPage = 1;
let laptopsData = [];

function goToPage(pageNumber) {
  currentPage = pageNumber;
  displayLaptops();
  createPagination();
}

function createPagination() {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(laptopsData.length / itemsPerPage);


  if (currentPage > 1) {
    const firstPageBtn = document.createElement("button");
    firstPageBtn.textContent = "First";
    firstPageBtn.classList.add("btn", "btn-secondary", "mx-1");
    firstPageBtn.onclick = () => goToPage(1);
    paginationContainer.appendChild(firstPageBtn);

    const prevPageBtn = document.createElement("button");
    prevPageBtn.textContent = "Previous";
    prevPageBtn.classList.add("btn", "btn-secondary", "mx-1");
    prevPageBtn.onclick = () => goToPage(currentPage - 1);
    paginationContainer.appendChild(prevPageBtn);
  }

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Tambahkan "..." sebelum halaman pertama jika rentang halaman dimulai dari halaman yang lebih besar dari 1
  if (startPage > 1) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = "1";
    pageBtn.classList.add("btn", "btn-primary", "mx-1");
    pageBtn.onclick = () => goToPage(1);
    paginationContainer.appendChild(pageBtn);

    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.classList.add("mx-1");
      paginationContainer.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("btn", "btn-primary", "mx-1");
    if (i === currentPage) pageBtn.classList.add("active");
    pageBtn.onclick = () => goToPage(i);
    paginationContainer.appendChild(pageBtn);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.classList.add("mx-1");
      paginationContainer.appendChild(dots);
    }
    
    const lastPageBtn = document.createElement("button");
    lastPageBtn.textContent = totalPages;
    lastPageBtn.classList.add("btn", "btn-primary", "mx-1");
    lastPageBtn.onclick = () => goToPage(totalPages);
    paginationContainer.appendChild(lastPageBtn);
  }

  if (currentPage < totalPages) {
    const nextPageBtn = document.createElement("button");
    nextPageBtn.textContent = "Next";
    nextPageBtn.classList.add("btn", "btn-secondary", "mx-1");
    nextPageBtn.onclick = () => goToPage(currentPage + 1);
    paginationContainer.appendChild(nextPageBtn);

    const lastPageBtn = document.createElement("button");
    lastPageBtn.textContent = "Last";
    lastPageBtn.classList.add("btn", "btn-secondary", "mx-1");
    lastPageBtn.onclick = () => goToPage(totalPages);
    paginationContainer.appendChild(lastPageBtn);
  }
}

function goToPage(pageNumber) {
  currentPage = pageNumber;
  displayLaptops();
  createPagination();
}

function displayLaptops() {
  const laptopList = document.getElementById("laptopList");
  if (!laptopList) return;

  laptopList.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  laptopsData.slice(start, end).forEach((laptop) => {
    const laptopItem = document.createElement("div");
    laptopItem.classList.add("col");
    laptopItem.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${laptop.img_link || 'https://via.placeholder.com/150'}" class="card-img-top p-3" alt="${laptop.name}" style="height: 150px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${laptop.name}</h5>
          <p class="card-text"><strong>Harga:</strong> Rp${(laptop.price_in_rupiah || 0).toLocaleString("id-ID")}</p>
          <p class="card-text"><strong>CPU Score:</strong> ${laptop.cpu_score || 'N/A'}</p>
          <p class="card-text"><strong>RAM:</strong> ${laptop.ram || 'N/A'} GB</p>
          <p class="card-text"><strong>Storage:</strong> ${laptop.storage || 'N/A'}</p>
        </div>
      </div>
    `;
    laptopList.appendChild(laptopItem);
  });
}

//Display Laptop Section Admin
let adminCurrentPage = 1; 
const adminItemsPerPage = 12;

function displayLaptopsAdmin() {
  const laptopListAdmin = document.getElementById("laptopListAdmin");
  if (!laptopListAdmin) return;

  laptopListAdmin.innerHTML = "";

  const laptops = JSON.parse(localStorage.getItem('updatedDataset')) || [];
  const start = (adminCurrentPage - 1) * adminItemsPerPage;
  const end = start + adminItemsPerPage;

  laptops.slice(start, end).forEach((laptop, index) => {
    const ramValue = parseRamValue(laptop.ram);
    const laptopItem = document.createElement("div");
    laptopItem.classList.add("col");
    laptopItem.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${laptop.img_link || 'https://via.placeholder.com/150'}" class="card-img-top p-3" alt="${laptop.name}" style="height: 150px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${laptop.name}</h5>
          <p class="card-text"><strong>Harga:</strong> Rp${(laptop.price_in_rupiah || 0).toLocaleString("id-ID")}</p>
          <p class="card-text"><strong>CPU Score:</strong> ${laptop.cpu_score || 'N/A'}</p>
          <p class="card-text"><strong>RAM:</strong> ${ramValue || 'N/A'} GB</p>
          <p class="card-text"><strong>Storage:</strong> ${laptop.storage || 'N/A'}</p>
          <button onclick="editLaptop(${start + index})" class="btn btn-warning">Edit</button>
          <button onclick="deleteLaptop(${start + index})" class="btn btn-danger">Hapus</button>
        </div>
      </div>
    `;
    laptopListAdmin.appendChild(laptopItem);
  });

  createAdminPagination(laptops.length);
}

function parseRamValue(ramString) {
  const ramValue = parseInt(ramString);
  return isNaN(ramValue) ? null : ramValue;
}

function createAdminPagination(totalItems) {
  const paginationContainer = document.getElementById("adminPagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalItems / adminItemsPerPage);
  const maxVisiblePages = 5;
  let startPage = Math.max(1, adminCurrentPage - 2);
  let endPage = Math.min(totalPages, adminCurrentPage + 2);

  if (adminCurrentPage > 1) {
    const firstPageBtn = document.createElement("button");
    firstPageBtn.textContent = "First";
    firstPageBtn.classList.add("btn", "btn-secondary", "mx-1");
    firstPageBtn.onclick = () => goToAdminPage(1);
    paginationContainer.appendChild(firstPageBtn);

    const prevPageBtn = document.createElement("button");
    prevPageBtn.textContent = "Previous";
    prevPageBtn.classList.add("btn", "btn-secondary", "mx-1");
    prevPageBtn.onclick = () => goToAdminPage(adminCurrentPage - 1);
    paginationContainer.appendChild(prevPageBtn);
  }

  if (startPage > 1) {
    const firstPageBtn = document.createElement("button");
    firstPageBtn.textContent = "1";
    firstPageBtn.classList.add("btn", "btn-primary", "mx-1");
    firstPageBtn.onclick = () => goToAdminPage(1);
    paginationContainer.appendChild(firstPageBtn);

    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.classList.add("mx-1");
      paginationContainer.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("btn", "btn-primary", "mx-1");
    if (i === adminCurrentPage) pageBtn.classList.add("active");
    pageBtn.onclick = () => goToAdminPage(i);
    paginationContainer.appendChild(pageBtn);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.classList.add("mx-1");
      paginationContainer.appendChild(dots);
    }
    
    const lastPageBtn = document.createElement("button");
    lastPageBtn.textContent = totalPages;
    lastPageBtn.classList.add("btn", "btn-primary", "mx-1");
    lastPageBtn.onclick = () => goToAdminPage(totalPages);
    paginationContainer.appendChild(lastPageBtn);
  }

  if (adminCurrentPage < totalPages) {
    const nextPageBtn = document.createElement("button");
    nextPageBtn.textContent = "Next";
    nextPageBtn.classList.add("btn", "btn-secondary", "mx-1");
    nextPageBtn.onclick = () => goToAdminPage(adminCurrentPage + 1);
    paginationContainer.appendChild(nextPageBtn);

    const lastPageBtn = document.createElement("button");
    lastPageBtn.textContent = "Last";
    lastPageBtn.classList.add("btn", "btn-secondary", "mx-1");
    lastPageBtn.onclick = () => goToAdminPage(totalPages);
    paginationContainer.appendChild(lastPageBtn);
  }
}

function goToAdminPage(pageNumber) {
  adminCurrentPage = pageNumber;
  displayLaptopsAdmin();
}

document.getElementById("addLaptopForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const laptops = JSON.parse(localStorage.getItem("updatedDataset")) || [];
  const editIndex = this.dataset.editIndex;

  const newLaptop = {
      name: document.getElementById("name").value,
      price_in_rupiah: parseInt(document.getElementById("price").value.replace(/\D/g, ""), 10), // Strip non-numeric characters
      cpu_score: parseInt(document.getElementById("cpu_score").value, 10),
      ram: parseInt(document.getElementById("ram").value, 10),
      storage: document.getElementById("storage").value,
      img_link: document.getElementById("img_link").value
  };

  if (editIndex !== undefined) {
      laptops[editIndex] = newLaptop;
      delete this.dataset.editIndex;
  } else {
      laptops.push(newLaptop);
  }

  localStorage.setItem("updatedDataset", JSON.stringify(laptops)); // Save to localStorage
  displayLaptopsAdmin();
  this.reset();
  alert("Laptop berhasil disimpan!");
});

function editLaptop(index) {
  const laptops = JSON.parse(localStorage.getItem("updatedDataset")) || [];
  const laptop = laptops[index];

  document.getElementById("name").value = laptop.name;
  document.getElementById("price").value = laptop.price_in_rupiah;
  document.getElementById("cpu_score").value = laptop.cpu_score;
  document.getElementById("ram").value = parseRamValue(laptop.ram);
  document.getElementById("storage").value = laptop.storage;
  document.getElementById("img_link").value = laptop.img_link;

  document.getElementById("addLaptopForm").dataset.editIndex = index;
}

function deleteLaptop(index) {
  const laptops = JSON.parse(localStorage.getItem("updatedDataset")) || [];
  laptops.splice(index, 1);
  localStorage.setItem("updatedDataset", JSON.stringify(laptops));
  displayLaptopsAdmin(); 
  alert("Laptop berhasil dihapus!");
}

function saveWeighting(weights) {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  if (totalWeight > 1) {
      alert("Total bobot kriteria tidak boleh lebih dari 1.");
      return;
  }
  localStorage.setItem("weights", JSON.stringify(weights));
}

function getWeighting() {
  return JSON.parse(localStorage.getItem("weights")) || {};
}

function saveWeightsToLocalStorage(weights) {
  console.log("Saving weights:", weights);
  localStorage.setItem("weights", JSON.stringify(weights));
  console.log("Weights after saving:", JSON.parse(localStorage.getItem("weights")));
}

function getWeightsFromLocalStorage() {
  const weights = JSON.parse(localStorage.getItem("weights")) || {};
  console.log("Retrieved weights:", weights);
  return weights;
}

function initializeDefaultWeights() {
  if (localStorage.getItem("weight_price_in_rupiah") === null) {
      localStorage.setItem("weight_price_in_rupiah", "0.4");
  }
  if (localStorage.getItem("weight_cpu_score") === null) {
      localStorage.setItem("weight_cpu_score", "0.3");
  }
  if (localStorage.getItem("weight_ram") === null) {
      localStorage.setItem("weight_ram", "0.2");
  }
  if (localStorage.getItem("weight_storage") === null) {
      localStorage.setItem("weight_storage", "0.1");
  }
}

function displayWeightsInUI() {
  const priceElement = document.getElementById("weight_price_in_rupiah");
  const cpuElement = document.getElementById("weight_cpu_score");
  const ramElement = document.getElementById("weight_ram");
  const storageElement = document.getElementById("weight_storage");

  if (priceElement) {
      priceElement.textContent = localStorage.getItem("weight_price_in_rupiah") || "0.4";
  }
  if (cpuElement) {
      cpuElement.textContent = localStorage.getItem("weight_cpu_score") || "0.3";
  }
  if (ramElement) {
      ramElement.textContent = localStorage.getItem("weight_ram") || "0.2";
  }
  if (storageElement) {
      storageElement.textContent = localStorage.getItem("weight_storage") || "0.1";
  }
}


document.getElementById("addLaptopForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const laptops = JSON.parse(localStorage.getItem("updatedDataset")) || [];
  const editIndex = this.dataset.editIndex;

  const newLaptop = {
      name: document.getElementById("name").value,
      price_in_rupiah: parseInt(document.getElementById("price").value, 10),
      cpu_score: parseInt(document.getElementById("cpu_score").value, 10),
      ram: parseInt(document.getElementById("ram").value, 10),
      storage: document.getElementById("storage").value,
      img_link: document.getElementById("img_link").value
  };

  if (editIndex !== undefined) {
      laptops[editIndex] = newLaptop;
      delete this.dataset.editIndex;
  } else {
      laptops.push(newLaptop);
  }

  localStorage.setItem("updatedDataset", JSON.stringify(laptops));
  alert("Laptop berhasil ditambahkan!");
  displayLaptopsAdmin();
  this.reset();
});

//fungsi CRUD untuk pembobotan
function getSelectedCriteria() {
  const criteriaElements = document.querySelectorAll('input[name="criteria"]:checked');
  return Array.from(criteriaElements).map(el => el.value);
}

function addWeighting(criteria, weight) {
  const weights = getWeighting();
  weights[criteria] = weight;
  saveWeighting(weights);
}

function deleteWeighting(criteria) {
  const weights = getWeighting();
  delete weights[criteria];
  saveWeighting(weights);
}

document.getElementById("weightingForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const criteria = document.getElementById("criteriaSelect").value;
  const weight = parseFloat(document.getElementById("weight").value);

  console.log("Criteria:", criteria);
  console.log("Weight:", weight);

  localStorage.setItem(`weight_${criteria}`, weight);

  const savedWeight = localStorage.getItem(`weight_${criteria}`);
  console.log(`Saved weight for ${criteria}:`, savedWeight);

  displayWeightsInUI();
  alert("Bobot berhasil disimpan!");
  this.reset();
});

const formPanel = document.getElementsByClassName("multisteps_form_panel")[0];
if (formPanel) {
    formPanel.style.display = "block";
}

const budgetInput = document.getElementById("budget");
if (budgetInput) {
    budgetInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/[^0-9]/g, "");
        if (value) {
            e.target.value = "Rp" + new Intl.NumberFormat("id-ID").format(value);
        } else {
            e.target.value = "";
        }
    });
}

const priceInput = document.getElementById("price");
if (priceInput) {
    priceInput.addEventListener("input", function (e) {
        // Remove non-numeric characters, but keep the value for formatting
        let value = e.target.value.replace(/[^0-9]/g, "");

        if (value) {
            // Format the value as currency with "Rp" and thousands separators
            e.target.value = "Rp" + new Intl.NumberFormat("id-ID").format(value);
        } else {
            // Clear the field if there’s no numeric input
            e.target.value = "";
        }
    });
}

const prodiElement = document.getElementById("prodi");

if (prodiElement) {
    fetch("./data/prodiDataset.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data.program_studi)) {
                prodiDataset = data.program_studi;
                prodiDataset.forEach(element => {
                    var option = document.createElement("option");
                    option.value = element.skor_minimal;
                    option.text = element.nama;
                    prodiElement.add(option); // Gunakan `prodiElement` di sini
                });
            } else {
                console.error("Data fetched is not an array");
            }
        })
        .catch(error => {
            console.error("Fetch error: ", error);
        });
}

async function getRecommendation() {
  if (checkValue() === false) return;

  const bareMinimum = document.getElementById("prodi").value;
  const budget = parseInt(document.getElementById("budget").value.replace(/[^0-9]/g, ""), 10);

  const datasetLaptop = await fetchDataset(); // Memastikan data terbaru dari localStorage digunakan
  if (!datasetLaptop || !Array.isArray(datasetLaptop) || datasetLaptop.length === 0) {
     console.error("Dataset tidak ditemukan atau kosong.");
     alert("Dataset tidak tersedia. Silakan periksa kembali sumber data Anda.");
     return;
  }

  const selectedCriteria = getSelectedCriteria(); 
  const selectedMethod = document.querySelector(".nav-link.active")?.id;
  
  if (!selectedMethod) {
     alert("Pastikan metode sudah dipilih.");
     return;
  }

  let sortedLaptops;
  if (selectedMethod === 'nav-topsis-btn') {
     sortedLaptops = Topsis(bareMinimum, budget, datasetLaptop, selectedCriteria);
     populateTable(sortedLaptops, "recomendedLaptopTopsis");
  } else if (selectedMethod === 'nav-wp-btn') {
     sortedLaptops = WP(bareMinimum, budget, datasetLaptop, selectedCriteria);
     populateTable(sortedLaptops, "recomendedLaptopWP");
  } else if (selectedMethod === 'nav-saw-btn') {
     sortedLaptops = SAW(bareMinimum, budget, datasetLaptop, selectedCriteria);
     populateTable(sortedLaptops, "recomendedLaptopSAW");
  } else {
     console.warn("Metode yang dipilih tidak valid.");
  }

  document.getElementById("lottieAnim").style.display = "none";
}

function populateTable(sortedLaptops, tableId) {
  const tableBody = document.querySelector("#"+tableId+" tbody");
  tableBody.innerHTML = "";
  sortedLaptops.forEach((laptop, index) => {
    const row = document.createElement("tr");
    const indexCell = document.createElement("th");
    indexCell.scope = "row";
    indexCell.textContent = index + 1;
    row.appendChild(indexCell);
    const photoCell = document.createElement("td");
    const img = document.createElement("img");
    img.width = 50;
    img.src = laptop.img_link || "https://via.placeholder.com/50";
    img.alt = laptop.name;
    photoCell.appendChild(img);
    row.appendChild(photoCell);
    const nameCell = document.createElement("td");
    const nameHeading = document.createElement("h6");
    nameHeading.textContent = laptop.name;
    const priceParagraph = document.createElement("p");
    priceParagraph.textContent = `Harga : Rp${laptop.price_in_rupiah.toLocaleString("id-ID")}`;
    nameCell.appendChild(nameHeading);
    nameCell.appendChild(priceParagraph);
    row.appendChild(nameCell);
    const processorCell = document.createElement("td");
    processorCell.textContent = laptop.processor;
    row.appendChild(processorCell);
    const ramCell = document.createElement("td");
    ramCell.textContent = `${laptop.ram} GB`;
    row.appendChild(ramCell);
    const storageCell = document.createElement("td");
    storageCell.textContent = `${laptop.storage}`;
    row.appendChild(storageCell);
    tableBody.appendChild(row);
  });
}

// Fungsi untuk mengambil data dari localStorage atau JSON
async function fetchDataset() {
  console.log("Memulai fetchDataset...");
  const localData = localStorage.getItem('updatedDataset');
  if (localData) {
     laptopsData = JSON.parse(localData);
     console.log("Data ditemukan di localStorage:", laptopsData);
     return laptopsData;
  } else {
     try {
        const response = await fetch("./data/updatedDataset.json");
        if (!response.ok) throw new Error(`Fetch failed with status: ${response.status}`);
        const data = await response.json();
        localStorage.setItem("updatedDataset", JSON.stringify(data));
        laptopsData = data;
        console.log("Data berhasil diambil dari JSON:", laptopsData);
        return laptopsData;
     } catch (error) {
        console.error("Fetch error:", error.message);
        alert("Gagal mengambil dataset dari server.");
        return []; // Mengembalikan array kosong jika terjadi error
     }
  }
  
  displayLaptops();
  createPagination();
}

function checkValue() {
  const budget = document.getElementById("budget").value;
  const selectedProdi = document.getElementById("prodi").options[document.getElementById("prodi").selectedIndex].value;
  if (budget == "") {
    swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'kamu belum memasukkan budget',
    });
    return false;
  }
  if (selectedProdi == "0") {
    swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'kamu belum memilih prodi',
    });
    return false;
  }
}

function Topsis(bareMinimum, budget, datasetLaptop, selectedCriteria) {
  datasetLaptop = datasetLaptop.filter(laptop => laptop.price_in_rupiah <= budget);
  datasetLaptop = datasetLaptop.filter(laptop => laptop.cpu_score >= bareMinimum);
  console.log(datasetLaptop);

const weight = {
  price_in_rupiah: parseFloat(localStorage.getItem("weight_price_in_rupiah")) || 0.4,
  cpu_score: parseFloat(localStorage.getItem("weight_cpu_score")) || 0.3,
  ram: parseFloat(localStorage.getItem("weight_ram")) || 0.2,
  storage: parseFloat(localStorage.getItem("weight_storage")) || 0.1
};

const criteriaKeys = Object.keys(weight).filter(criteria => selectedCriteria.includes(criteria));

  const normalizedDataset = datasetLaptop.map(laptop => {
  const normalizedLaptop = {};
  criteriaKeys.forEach(criteria => {
    const normFactor = Math.sqrt(
      datasetLaptop.reduce((sum, item) => sum + Math.pow(item[criteria], 2), 0)
      );
          normalizedLaptop[criteria] = laptop[criteria] / normFactor;
      });
      return normalizedLaptop;
  });

  // Hitung dataset berbobot
  const weightedDataset = normalizedDataset.map(laptop => {
      const weightedLaptop = {};
      criteriaKeys.forEach(criteria => {
          weightedLaptop[criteria] = laptop[criteria] * weight[criteria];
      });
      return weightedLaptop;
  });

  // Tentukan solusi ideal positif dan negatif
  const idealPositive = {};
  const idealNegative = {};
  criteriaKeys.forEach(criteria => {
      idealPositive[criteria] = Math.max(...weightedDataset.map(laptop => laptop[criteria]));
      idealNegative[criteria] = Math.min(...weightedDataset.map(laptop => laptop[criteria]));
  });

  // Hitung jarak ke solusi ideal positif dan negatif
  const distances = weightedDataset.map((laptop, index) => {
      const positiveDistance = Math.sqrt(
          criteriaKeys.reduce((sum, criteria) => sum + Math.pow(laptop[criteria] - idealPositive[criteria], 2), 0)
      );
      const negativeDistance = Math.sqrt(
          criteriaKeys.reduce((sum, criteria) => sum + Math.pow(laptop[criteria] - idealNegative[criteria], 2), 0)
      );
      return { index, positiveDistance, negativeDistance };
  });

  // Hitung skor Topsis
  const scores = distances.map(({ index, positiveDistance, negativeDistance }) => {
      return {
          index,
          score: negativeDistance / (positiveDistance + negativeDistance)
      };
  });

  // Urutkan laptop berdasarkan skor dari tertinggi ke terendah
  const sortedLaptops = scores
      .sort((a, b) => b.score - a.score)
      .map(({ index, score }) => ({
          ...datasetLaptop[index],
          topsis_score: score
      }));
  return sortedLaptops;
}

function SAW(bareMinimum, budget, datasetLaptop, selectedCriteria) {
    datasetLaptop = datasetLaptop.filter(laptop => laptop.price_in_rupiah <= budget);
    datasetLaptop = datasetLaptop.filter(laptop => laptop.cpu_score >= bareMinimum);
    console.log(datasetLaptop);

    const weight = {
      price_in_rupiah: parseFloat(localStorage.getItem("weight_price_in_rupiah")) || 0.4,
      cpu_score: parseFloat(localStorage.getItem("weight_cpu_score")) || 0.3,
      ram: parseFloat(localStorage.getItem("weight_ram")) || 0.2,
      storage: parseFloat(localStorage.getItem("weight_storage")) || 0.1
    };

    const criteriaKeys = Object.keys(weight).filter(criteria => selectedCriteria.includes(criteria));

    // Menormalisasi nilai setiap kriteria untuk setiap laptop
    const normalizedDataset = datasetLaptop.map(laptop => {
    const normalizedLaptop = {};
    criteriaKeys.forEach(criteria => {
      if (criteria === 'price_in_rupiah') {
        // Normalisasi harga (karena harga lebih rendah lebih baik)
        const maxPrice = Math.max(...datasetLaptop.map(item => item[criteria]));
        normalizedLaptop[criteria] = maxPrice / laptop[criteria];
      } else {
        // Normalisasi kriteria lainnya (semakin tinggi semakin baik)
        const maxValue = Math.max(...datasetLaptop.map(item => item[criteria]));
        normalizedLaptop[criteria] = laptop[criteria] / maxValue;
      }
    });
    return {
      ...laptop,
      normalized: normalizedLaptop
    };
  });

    // Menghitung skor SAW untuk setiap laptop
    const sawScores = normalizedDataset.map(laptop => {
      let score = 0;
      criteriaKeys.forEach(criteria => {
        score += laptop.normalized[criteria] * weight[criteria];
      });
      return {
        ...laptop,
        saw_score: score
      };
    });

  // Mengurutkan laptop berdasarkan skor SAW dari tertinggi ke terendah
  const sortedLaptops = sawScores.sort((a, b) => b.saw_score - a.saw_score);

  return sortedLaptops;
}

function WP(bareMinimum, budget, datasetLaptop, selectedCriteria) { 
  // Filter data laptop berdasarkan budget dan skor minimal
  datasetLaptop = datasetLaptop.filter(laptop => laptop.price_in_rupiah <= budget);
  datasetLaptop = datasetLaptop.filter(laptop => laptop.cpu_score >= bareMinimum);
  console.log(datasetLaptop);

  // Ambil bobot dari localStorage atau gunakan nilai default jika tidak ada
  const weight = {
    price_in_rupiah: parseFloat(localStorage.getItem("weight_price_in_rupiah")) || 0.4,
    cpu_score: parseFloat(localStorage.getItem("weight_cpu_score")) || 0.3,
    ram: parseFloat(localStorage.getItem("weight_ram")) || 0.2,
    storage: parseFloat(localStorage.getItem("weight_storage")) || 0.1
  };

// Gunakan hanya kriteria yang dipilih
const criteriaKeys = Object.keys(weight).filter(criteria => selectedCriteria.includes(criteria));

// Log untuk memastikan semua bobot diambil dengan benar
console.log("Bobot yang digunakan:", weight);

  // Normalisasi bobot dengan membagi setiap bobot dengan total bobot
  const totalWeight = Object.values(weight).reduce((sum, w) => sum + w, 0);
  const normalizedWeights = {};
  criteriaKeys.forEach(criteria => {
    normalizedWeights[criteria] = weight[criteria] / totalWeight;
  });

  // Menghitung skor WP untuk setiap laptop
  const wpScores = datasetLaptop.map(laptop => {
    let score = 1;
    criteriaKeys.forEach(criteria => {
      score *= Math.pow(laptop[criteria], normalizedWeights[criteria]);
    });
    return {
      ...laptop,
      wp_score: score
    };
  });

  // Mengurutkan laptop berdasarkan skor WP dari tertinggi ke terendah
  const sortedLaptops = wpScores.sort((a, b) => b.wp_score - a.wp_score);

  return sortedLaptops;
}