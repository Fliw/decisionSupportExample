document.getElementsByClassName("multisteps_form_panel")[0].style.display = "block";

fetch("./data/prodiDataset.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
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