const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const inputLabel = document.getElementById("label");
const inputNilai = document.getElementById("value");
const add = document.getElementById("add");

let daftarLabel = ["Januari", "Februari", "Maret", "April", "Mei"];
let daftarNilai = [10, 20, 15, 25, 30];

const margin = 60;
const lebarGrafik = canvas.width - 2 * margin;
const tinggiGrafik = canvas.height - 2 * margin;

let progressAnimasi = 1;
let IDAnimasi;

function prosesTambahData() {
  let labelBaru = inputLabel.value.trim();
  let nilaiBaru = parseInt(inputNilai.value);

  if (labelBaru && !isNaN(nilaiBaru)) {
    daftarLabel.push(labelBaru);
    daftarNilai.push(nilaiBaru);
    inputLabel.value = "";
    inputNilai.value = "";

    mulaiAnimasiTerakhir();
    inputLabel.focus();
  }
}

add.addEventListener("click", prosesTambahData);

inputLabel.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    prosesTambahData();
  }
});

inputNilai.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    prosesTambahData();
  }
});

function cariNilaiTertinggi() {
  let maks = Math.max(...daftarNilai);
  return maks <= 0 ? 10 : Math.ceil(maks / 10) * 10;
}

function mulaiAnimasiTerakhir() {
  progressAnimasi = 0;
  cancelAnimationFrame(IDAnimasi);
  jalankanAnimasi();
}

function jalankanAnimasi() {
  progressAnimasi += 0.05;
  if (progressAnimasi > 1) progressAnimasi = 1;

  gambarUlang();

  if (progressAnimasi < 1) {
    IDAnimasi = requestAnimationFrame(jalankanAnimasi);
  }
}

function gambarUlang() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gambarGrid();
  gambarGaris();
  gambarLabelX();
  gambarLabelY();
  gambarGrafik();
}

function gambarGrid() {
  let maksY = cariNilaiTertinggi();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;

  for (let i = 10; i <= maksY; i += 10) {
    let y = canvas.height - margin - (i / maksY) * tinggiGrafik;
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(canvas.width - margin, y);
    ctx.stroke();
  }
}

function gambarGaris() {
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, canvas.height - margin);
  ctx.lineTo(canvas.width - margin, canvas.height - margin);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function gambarLabelX() {
  ctx.font = "12px 'Segoe UI', sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "center";

  for (let i = 0; i < daftarLabel.length; i++) {
    let x = margin + i * (lebarGrafik / (daftarLabel.length - 1 || 1));
    ctx.fillText(daftarLabel[i], x, canvas.height - margin + 25);
  }
}

function gambarLabelY() {
  ctx.font = "12px 'Segoe UI', sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "right";
  let maksY = cariNilaiTertinggi();

  for (let i = 0; i <= maksY; i += 10) {
    let y = canvas.height - margin - (i / maksY) * tinggiGrafik;
    ctx.fillText(i, margin - 15, y + 4);
  }
}

function gambarGrafik() {
  if (daftarNilai.length === 0) return;

  let maksY = cariNilaiTertinggi();
  let totalTitik = daftarNilai.length;

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  for (let i = 0; i < totalTitik; i++) {
    let x = margin + i * (lebarGrafik / (daftarLabel.length - 1 || 1));
    let y = canvas.height - margin - (daftarNilai[i] / maksY) * tinggiGrafik;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else if (i < totalTitik - 1) {
      ctx.lineTo(x, y);
    } else {
      let xSebelum =
        margin + (i - 1) * (lebarGrafik / (daftarLabel.length - 1 || 1));
      let ySebelum =
        canvas.height - margin - (daftarNilai[i - 1] / maksY) * tinggiGrafik;

      let xAnimasi = xSebelum + (x - xSebelum) * progressAnimasi;
      let yAnimasi = ySebelum + (y - ySebelum) * progressAnimasi;

      ctx.lineTo(xAnimasi, yAnimasi);
    }
  }
  ctx.stroke();

  for (let i = 0; i < totalTitik; i++) {
    let x = margin + i * (lebarGrafik / (daftarLabel.length - 1 || 1));
    let y = canvas.height - margin - (daftarNilai[i] / maksY) * tinggiGrafik;

    if (i === totalTitik - 1 && progressAnimasi < 1) {
      let xSebelum =
        margin + (i - 1) * (lebarGrafik / (daftarLabel.length - 1 || 1));
      let ySebelum =
        canvas.height - margin - (daftarNilai[i - 1] / maksY) * tinggiGrafik;

      x = xSebelum + (x - xSebelum) * progressAnimasi;
      y = ySebelum + (y - ySebelum) * progressAnimasi;
    }

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

gambarUlang();
