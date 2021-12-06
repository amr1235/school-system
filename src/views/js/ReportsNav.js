// eslint-disable-next-line
const ReportsNav = (data) => {
  const seatsList = document.querySelector("#SeatsId");
  const capacitiesList = document.querySelector("#Capacities");
  const agesList = document.querySelector("#Ages");
  const motherList = document.querySelector("#MotherData");
  const classList = document.querySelector("#ClassList");
  let stages = data.stagesData;
  let agesDropDown = "";
  let classListDropDown = "";
  let seatsDropDown = "";
  let CapacitiesDropDown = "";
  for (let stage of stages) {
    seatsDropDown += "<li>";
    seatsDropDown += `
          <a class="dropdown-item" href="#"> ${stage.StageName} &raquo; </a>
          <ul class="dropdown-menu dropdown-submenu">
          `;
    classListDropDown += "<li>";
    classListDropDown += `
          <a class="dropdown-item" href="#"> ${stage.StageName} &raquo; </a>
          <ul class="submenu dropdown-menu">
          `;
    for (let grade of stage.Grades) {
      seatsDropDown += `
                      <li>
                        <a class="dropdown-item btn" href="#" onclick='window.api.send("sendAffairsReportData", ["Seats", [${grade.GradeId}]])'>
                          ${grade.GradeName}
                        </a>
                      </li>
            `;
      classListDropDown += `
                      <li>
                        <a class="dropdown-item" href="#"> ${grade.GradeName} &raquo; </a>
                        <ul class="submenu dropdown-menu">
            `;
      for(let clas of grade.Classes) {
        classListDropDown += `
                      <li>
                        <a class="dropdown-item" href="#" onclick='window.api.send("sendAffairsReportData", ["classList", [${stage.StageId}, ${grade.GradeId},${clas.ClassId}]])'>
                          ${clas.ClassName}
                        </a>
                      </li>
            `;
      }
      classListDropDown += "</ul></li>";
    }
    seatsDropDown += `</ul>
          </li>`;
    classListDropDown += `</ul>
          </li>`;
    CapacitiesDropDown += "<li>";
    CapacitiesDropDown += `
    <a class="dropdown-item" href="#"> ${stage.StageName} &raquo; </a>
    <ul class="dropdown-menu dropdown-submenu">
    `;
    for (let grade of stage.Grades) {
      CapacitiesDropDown += `
                      <li>
                        <a class="dropdown-item btn" href="#" onclick='window.api.send("sendAffairsReportData", ["GradeCapacity", [${grade.GradeId}]])'>
                          ${grade.GradeName}
                        </a>
                      </li>
            `;
    }
    CapacitiesDropDown += `</ul>
          </li>`;
    agesDropDown += "<li>";
    agesDropDown += `
    <a class="dropdown-item" href="#"> ${stage.StageName} &raquo; </a>
    <ul class="dropdown-menu dropdown-submenu">
    `;
    for (let grade of stage.Grades) {
      agesDropDown += `
                      <li>
                        <a class="dropdown-item btn" href="#" onclick='window.api.send("sendAffairsReportData", ["StudentsAges", [${grade.GradeId}]])'>
                          ${grade.GradeName}
                        </a>
                      </li>
            `;
    }
    agesDropDown += `</ul>
          </li>`;
  }


  agesList.innerHTML = agesDropDown;
  motherList.innerHTML = agesDropDown.replaceAll("StudentsAges", "motherData");
  seatsList.innerHTML = seatsDropDown;
  classList.innerHTML = classListDropDown;
  capacitiesList.innerHTML = CapacitiesDropDown;
};
