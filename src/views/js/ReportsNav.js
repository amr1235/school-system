// eslint-disable-next-line
const ReportsNav = (data) => {
  const seatsList = document.querySelector("#SeatsId");
  let stages = data.stagesData;
  let dropdown = "";
  for (let stage of stages) {
    dropdown += "<li>";
    dropdown += `
          <a class="dropdown-item" href="#"> ${stage.StageName} &raquo; </a>
          <ul class="dropdown-menu dropdown-submenu">
          `;
    for (let grade of stage.Grades) {
      dropdown += `
                      <li>
                        <a class="dropdown-item btn" href="#" onclick='window.api.send("sendAffairsReportData", ["Seats", [${grade.GradeId}]])'>
                          ${grade.GradeName}
                        </a>
                      </li>
            `;
    }
    dropdown += `</ul>
          </li>`;
  }
  seatsList.innerHTML = dropdown;
};
