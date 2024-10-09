document.getElementsByClassName("multisteps_form_panel")[0].style.display = "block";

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

  topsis(bareMinimum, budget, datasetLaptop);
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

function topsis(bareMinimum, budget, datasetLaptop) {}


