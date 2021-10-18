// eslint-disable-next-line
const ExpansesReportsNav = (data) => {
  console.log(data);
  const FullyPaidList = document.querySelector("#FullyPaidCategory");
  let stages = data.stagesData;
  let fullyPaidDropDown = "";
  for (let stage of stages) {
    fullyPaidDropDown += "<li>";
    fullyPaidDropDown += `
          <a class="dropdown-item" href="#"> ${stage.StageName} &raquo; </a>
          <ul class="dropdown-menu dropdown-submenu">
          `;
    for (let grade of stage.Grades) {
      fullyPaidDropDown += `
                      <li class='pb-2 border-1 border-dark'>
                        <div class="dropdown-item pb-2 border-1 border-dark">${grade.GradeName}</div>
                        <div class='row mx-2'>
                        `;
      for (let category of grade.Categories) {
        fullyPaidDropDown += `
                        <input type="checkbox" class="dropdown-item ${category.GradeId}" id="${category.GradeId}-${category.CategoryName}" name="${category.CategoryName}" value="${category.CategoryName}">
                        <label for="${category.GradeId}-${category.CategoryName}">${category.CategoryName}</label><br>
            `;
      }
      fullyPaidDropDown += `
                  </div>
                  <div class='row mx-2'>
                    <a href="#" class="btn btn-warning rounded-pill"
                      onclick='getSelectedCategories(${grade.GradeId})'>
                      الذهاب للتقرير
                    </a>
                    </div>
      `;
    }
    fullyPaidDropDown += `
                    </ul>
                </li>
      `;
  }
  FullyPaidList.innerHTML = fullyPaidDropDown;
};

// eslint-disable-next-line
const getSelectedCategories = (gradeId) => {
  const categories = document.getElementsByClassName(gradeId);
  const filtredCategories = [];
  for (let category of categories) {
    console.log(category.value);
    if (category.checked) {
      filtredCategories.push(category.value);
    }
  }
  window.api.send("sendExpansesReportData", [
    "FullyPaidCategory",
    [gradeId, filtredCategories],
  ]);
};
