document.getElementsByClassName("multisteps_form_panel")[0].style.display = "block";

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
        prodi.add(option);
      });
    } else {
      console.error("Data fetched is not an array");
    }
  })
  .catch(error => {
    console.error("Fetch error: ", error);
  }
  );

function getRecommendation() {
  if (checkValue() == false) {
    return;
  }
  const bareMinimum = document.getElementById("prodi").options[document.getElementById("prodi").selectedIndex].value;
  const budget = document.getElementById("budget").value;
  const datasetLaptop = fetchDataset();

  Topsis(bareMinimum, budget, datasetLaptop);
  SAW(bareMinimum, budget, datasetLaptop);
  WP(bareMinimum, budget, datasetLaptop);
}

function fetchDataset() {
  fetch("./data/updatedDataset.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error("Fetch error: ", error);
    }
    );
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

function Topsis(bareMinimum, budget, datasetLaptop) { }

function SAW(bareMinimum, budget, datasetLaptop) { }

function WP(bareMinimum, budget, datasetLaptop) { }

