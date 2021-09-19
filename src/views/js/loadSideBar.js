function loadSideBar(students) {
    const pillsTab = document.getElementById("pills-tab");
    const pillsTabContent = document.getElementById("pills-tabContent");
    if (!pillsTab || !pillsTabContent) return;
    const stages = students.map(elem => {
        return { name: elem.StageName, id: elem.StageId, grades: elem.Grades };
    });
    stages.forEach((stage,i) => {
        const stageLi = document.createElement("li");
        stageLi.classList.add("nav-item");
        stageLi.setAttribute("role", "presentation");
        const stageButton = document.createElement("button");
        stageButton.classList.add("nav-link");
        let stageButtonId = "pills-" + stage.id + "-tab";
        stageButton.setAttribute("id", stageButtonId);
        stageButton.setAttribute("data-bs-toggle", "pill");
        let stageDataBsTarget = "stage-pills-" + stage.id;
        stageButton.setAttribute("data-bs-target", "#" + stageDataBsTarget);
        stageButton.setAttribute("type", "button");
        stageButton.setAttribute("role", "tab");
        stageButton.setAttribute("aria-controls", stageDataBsTarget);
        if(i === 0) {
            stageButton.setAttribute("aria-selected", "true");
            stageButton.classList.add("active");
        }else {
            stageButton.setAttribute("aria-selected", "true");
        }
        stageButton.innerText = stage.name;
        stageLi.appendChild(stageButton);
        pillsTab.appendChild(stageLi);
        const stageDiv = document.createElement("div");
        if(i === 0) {
            stageDiv.classList.add("tab-pane", "fade","show", "active" ,"text-warning");
        }else {
            stageDiv.classList.add("tab-pane", "fade", "text-warning");
        }
        stageDiv.setAttribute("id", stageDataBsTarget);
        stageDiv.setAttribute("role", "tabpanel");
        stageDiv.setAttribute("aria-labelledby", stageButtonId);
        let grades = stage.grades;
        grades.forEach(grade => {
            //create grade accordion
            const gradeAccordion = document.createElement("div");
            gradeAccordion.classList.add("accordion", "accordion-flush");
            const gradeAccordionItem = document.createElement("div");
            gradeAccordionItem.classList.add("accordion-item");
            const gradeAccordionItemHeader = document.createElement("h2");
            gradeAccordionItemHeader.classList.add("accordion-header");
            let gradeAccordionItemHeaderId = "accordion-header-" + grade.GradeId;
            const gradeAccordionItemHeaderButton = document.createElement("button");
            gradeAccordionItemHeaderButton.classList.add("accordion-button", "collapsed");
            let gradeDataBsTarget = "grade-button-" + grade.GradeId;
            gradeAccordionItemHeaderButton.setAttribute("type", "button");
            gradeAccordionItemHeaderButton.setAttribute("data-bs-target", "#" + gradeDataBsTarget);
            gradeAccordionItemHeaderButton.setAttribute("data-bs-toggle", "collapse");
            gradeAccordionItemHeaderButton.setAttribute("aria-expanded", "false");
            gradeAccordionItemHeaderButton.setAttribute("aria-controls", gradeAccordionItemHeaderId);
            gradeAccordionItemHeaderButton.innerText = grade.GradeName;
            const gradeAccordionItemContent = document.createElement("div");
            gradeAccordionItemContent.classList.add("collapse", "accordion-collapse");
            gradeAccordionItemContent.setAttribute("id", gradeDataBsTarget);
            gradeAccordionItemContent.setAttribute("aria-labelledby", gradeAccordionItemHeaderId);
            const gradeAccordionItemInnerContent = document.createElement("div");
            gradeAccordionItemInnerContent.classList.add("accordion-body", "text-center");
            grade.Classes.forEach(clas => {
                const classAccordion = document.createElement("div");
                classAccordion.classList.add("accordion", "accordion-flush");
                const classAccordionItem = document.createElement("div");
                classAccordionItem.classList.add("accordion-item");
                const classAccordionItemHeader = document.createElement("h2");
                classAccordionItemHeader.classList.add("accordion-header");
                let classAccordionItemHeaderId = "accordion-header-class-" + clas.ClassId;
                const classAccordionItemHeaderButton = document.createElement("button");
                classAccordionItemHeaderButton.classList.add("accordion-button", "collapsed");
                let classDataBsTarget = "class-button-" + clas.ClassId;
                classAccordionItemHeaderButton.setAttribute("type", "button");
                classAccordionItemHeaderButton.setAttribute("data-bs-target", "#" + classDataBsTarget);
                classAccordionItemHeaderButton.setAttribute("data-bs-toggle", "collapse");
                classAccordionItemHeaderButton.setAttribute("aria-expanded", "false");
                classAccordionItemHeaderButton.setAttribute("aria-controls", classAccordionItemHeaderId);
                classAccordionItemHeaderButton.innerText = "class " + clas.ClassId;
                const classAccordionItemContent = document.createElement("div");
                classAccordionItemContent.classList.add("collapse", "accordion-collapse");
                classAccordionItemContent.setAttribute("id", classDataBsTarget);
                classAccordionItemContent.setAttribute("aria-labelledby", classAccordionItemHeaderId);
                const classAccordionItemInnerContent = document.createElement("div");
                classAccordionItemInnerContent.classList.add("accordion-body", "text-center");
                // create list of students
                clas.StudentClasses.forEach(student => {
                    const studentsUl = document.createElement("ul");
                    studentsUl.classList.add("list-group");
                    const studentLi = document.createElement("li");
                    studentLi.classList.add("list-group-item");
                    const studentLiLink = document.createElement("a");
                    studentLiLink.classList.add("text-decoration-none");
                    studentLiLink.setAttribute("href", "#");
                    studentLiLink.setAttribute("onclick", "window.api.send(\"sendStudentIdToMain\", " + student.StudentId + ");");
                    studentLiLink.innerText = student.Student.StudentName;
                    studentLi.appendChild(studentLiLink);
                    studentsUl.appendChild(studentLi);
                    classAccordionItemInnerContent.appendChild(studentsUl);
                });
                classAccordionItemContent.appendChild(classAccordionItemInnerContent);
                classAccordionItem.appendChild(classAccordionItemContent);
                classAccordionItemHeader.appendChild(classAccordionItemHeaderButton);
                classAccordionItem.appendChild(classAccordionItemHeader);
                classAccordion.appendChild(classAccordionItem);
                gradeAccordionItemInnerContent.appendChild(classAccordion);
            });
            gradeAccordionItemContent.appendChild(gradeAccordionItemInnerContent);
            gradeAccordionItem.appendChild(gradeAccordionItemContent);
            gradeAccordionItemHeader.appendChild(gradeAccordionItemHeaderButton);
            gradeAccordionItem.appendChild(gradeAccordionItemHeader);
            gradeAccordion.appendChild(gradeAccordionItem);
            stageDiv.appendChild(gradeAccordion);
        });
        pillsTabContent.appendChild(stageDiv);
        // <div class="tab-pane fade show active text-warning" id="prim" role="tabpanel" aria-labelledby="pills-home-tab">
    });
};