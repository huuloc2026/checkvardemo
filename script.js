let currentPage = 1;
const rowsPerPage = 20; // Số dòng dữ liệu hiển thị trên mỗi trang
let allData = [];
let uniqueDates = []; // Mảng lưu trữ các ngày duy nhất

async function fetchData() {
  const response = await fetch("datatest.json");
  const data = await response.json();
  return data;
}

// Hàm để chuẩn hóa số tiền vào định dạng mà chúng ta muốn so sánh
function normalizeAmount(amount) {
  // Xóa dấu chấm và chuyển đổi thành số
  return parseFloat(amount.replace(/\./g, "").replace(/,/g, ""));
}

function renderTable(data) {
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = ""; // Xóa nội dung cũ

  // Giới hạn dữ liệu cho trang hiện tại
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const limitedData = data.slice(startIndex, endIndex);

  limitedData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="date">${item.d}</td>
            <td>${item.no}</td>
            <td>${item.am}</td>
            <td>${item.c}</td>
        `;
    tableBody.appendChild(row);
  });

  // Cập nhật thông tin trang
  updatePagination(data.length);
}

function updatePagination(totalRows) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  document.getElementById(
    "pageInfo"
  ).textContent = `Trang ${currentPage} / ${totalPages}`;

  // Kích hoạt hoặc vô hiệu hóa nút
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// Hàm để tạo dropdown cho các ngày trong dữ liệu
function populateDateDropdown(data) {
  const dateSelect = document.getElementById("searchDate");
  uniqueDates = [...new Set(data.map((item) => item.d))]; // Lấy các ngày duy nhất
  uniqueDates.forEach((date) => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date; // Hiển thị ngày
    dateSelect.appendChild(option);
  });
}

// Hàm tìm kiếm
document.getElementById("searchButton").addEventListener("click", async () => {
  const dateInput = document.getElementById("searchDate").value; // Lấy giá trị từ dropdown
  const noInput = document.getElementById("searchNo").value.toLowerCase();
  const amountInput = document
    .getElementById("searchAmount")
    .value.toLowerCase();
  const contentInput = document
    .getElementById("searchContent")
    .value.toLowerCase();

  const data = await fetchData();
  allData = data.filter(
    (item) =>
      (dateInput ? item.d === dateInput : true) &&
      (noInput ? item.no.includes(noInput) : true) &&
      (amountInput
        ? normalizeAmount(item.am) ===
          normalizeAmount(amountInput.replace(/\./g, "").replace(/,/g, ""))
        : true) &&
      (contentInput ? item.c.toLowerCase().includes(contentInput) : true)
  );

  currentPage = 1; // Reset trang về 1 sau mỗi lần tìm kiếm
  renderTable(allData);
});

// Xử lý phân trang
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(allData);
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable(allData);
  }
});

// Tải dữ liệu khi trang được mở
fetchData().then((data) => {
  allData = data;
  populateDateDropdown(allData); // Điền vào dropdown với ngày
  renderTable(allData);
});
