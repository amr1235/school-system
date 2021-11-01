// eslint-disable-next-line
const ExpansesReportsNav = (data) => {
  console.log(data);
  const FullyPaidList = document.querySelector("#fullyPaidCategories");
  let stages = data.stagesData;
  let fullyPaidDropDown = "";
  for (let stage of stages) {
    fullyPaidDropDown += "<li>";
    fullyPaidDropDown += `
          <a class="dropdown-item" href="#">${stage.StageName} &raquo; </a>
          <ul class="submenu dropdown-menu">
          `;
    for (let grade of stage.Grades) {
      fullyPaidDropDown += `
                      <li> <a class="dropdown-item" href="#">${grade.GradeName} &raquo; </a>
                      <ul class="submenu dropdown-menu">
                        `;
      for (let category of grade.Categories) {
        fullyPaidDropDown += `
                          <li>
                              <div class="row">
                                <div class="col-6 mt-1">
                                  <input type="checkbox" class="dropdown-item d-inline-block ${category.GradeId}" id="${category.GradeId}-${category.CategoryName}" name="${category.CategoryName}" value="${category.CategoryName}">
                                </div>
                                <div class="col-6">
                                  <label class="dropdown-item d-inline-block" for="${category.GradeId}-${category.CategoryName}">${category.CategoryName}</label>
                                </div>
                              </div>
                          </li>
            `;
      }
      fullyPaidDropDown += `
                            <li class="d-flex flex-row justify-content-center my-3">
                              <a href="#" class="btn btn-warning rounded-pill text-black" onclick='getSelectedCategories(${grade.GradeId})'>
                                الذهاب للتقرير
                              </a>
                            </li>
                        </ul>
                      </li>
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
    "getFullyPaidSelectedCategories",
    [gradeId, filtredCategories],
  ]);
};
