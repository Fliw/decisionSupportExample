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

function WP(bareMinimum, budget, datasetLaptop) {
  // Importing the datasets
const updatedDataset = require('../data/updatedDataset.json');
const prodiDataset = require('../data/prodiDataset.json');

// Function to calculate the Weighted Product (WP) score
function calculateWPScores(dataset, weights) {
  return dataset.map((item) => {
    let score = 1;
    weights.forEach((weight, index) => {
      score *= Math.pow(item.criteria[index], weight);
    });
    return {
      ...item,
      wpScore: score,
    };
  });
}

// Function to normalize weights
function normalizeWeights(weights) {
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
  return weights.map((weight) => weight / totalWeight);
}

// Main function to calculate WP for updatedDataset.json
function calculateWP() {
  // Define weights for each criterion (you can modify these values as needed)
  const weights = [0.3, 0.2, 0.4, 0.1];
  const normalizedWeights = normalizeWeights(weights);

  // Calculate WP scores
  const wpScores = calculateWPScores(updatedDataset, normalizedWeights);

  // Sort results based on WP scores in descending order
  const sortedResults = wpScores.sort((a, b) => b.wpScore - a.wpScore);

  // Print the sorted results
  console.log('Weighted Product Scores:', sortedResults);
}

// Function to match program studies with minimum scores
function matchProdiWithScores(wpScores) {
  return wpScores.map((item) => {
    const suitablePrograms = prodiDataset.program_studi.filter((prodi) => {
      return item.wpScore >= prodi.skor_minimal;
    });
    return {
      ...item,
      suitablePrograms: suitablePrograms.map((prodi) => prodi.nama),
    };
  });
}

// Execute the WP calculation and match with program studies
function executeDecisionSupport() {
  calculateWP();
  const wpScores = calculateWPScores(updatedDataset, normalizeWeights([0.3, 0.2, 0.4, 0.1]));
  const results = matchProdiWithScores(wpScores);

  // Print the results with suitable programs
  console.log('Matching Programs:', results);
}

// Run the decision support system
executeDecisionSupport();
}

