// eslint-disable-next-line
const ReportsNav = (data) => {
  const seatsList = document.querySelector("#SeatsId");
  const capacitiesList = document.querySelector("#Capacities");
  let stages = data.stagesData;
  let seatsDropDown = "";
  let CapacitiesDropDown = "";
  for (let stage of stages) {
    seatsDropDown += "<li>";
    seatsDropDown += `
          <a class="dropdown-item" href="#"> ${stage.StageName} &raquo; </a>
          <ul class="dropdown-menu dropdown-submenu">
          `;
    for (let grade of stage.Grades) {
      seatsDropDown += `
                      <li>
                        <a class="dropdown-item btn" href="#" onclick='window.api.send("sendAffairsReportData", ["Seats", [${grade.GradeId}]])'>
                          ${grade.GradeName}
                        </a>
                      </li>
            `;
    }
    seatsDropDown += `</ul>
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
  }
  seatsList.innerHTML = seatsDropDown;
  capacitiesList.innerHTML = CapacitiesDropDown;
};
