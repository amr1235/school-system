/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

function addSibling (){
  let object_to = document.getElementById("goto");
  let New_div = document.createElement("div");
  New_div.setAttribute("class","row my-3");
  New_div.setAttribute("id","delete");
  New_div.setAttribute("dir","rtl");
  New_div.innerHTML = "<div class=\"col-md-3 col-12\"><div class=\"input-group input-group mb-2 col-md-6 col-12\"><span class=\"input-group-text\" id=\"inputGroup-sizing\">الاسم :</span><input type=\"text\" class=\"form-control\" aria-label=\"Sizing example input\" aria-describedby=\"inputGroup-sizing-sm\"></div></div><div class=\"col-md-3 col-12\"><div class=\"input-group input-group mb-2 col-md-6 col-12\"><span class=\"input-group-text\" id=\"inputGroup-sizing\">مدرسه الاخ  :</span><input type=\"text\" class=\"form-control\" aria-label=\"Sizing example input\" aria-describedby=\"inputGroup-sizing-sm\"></div></div><div class=\"col-md-3 col-6 text-center\"><button  class=\"btn btn-primary w-auto\" onclick=\"addSibling()\">اضافه اخ اخر </button></div><div class=\"col-md-3 col-6 text-center\"><button class=\"btn btn-danger w-auto\" onclick=\"removeSibling()\"><i class=\"bi bi-x-lg\"></i></button></div> ";
  object_to.appendChild(New_div);
}

function removeSibling(){
  document.getElementById("delete").remove();
}

function addPhone(){
  let dadphone = document.getElementById("dadphone");
  let New_div = document.createElement("div");
  New_div.setAttribute("class","row my-3");
  New_div.setAttribute("id","delete1");
  New_div.setAttribute("dir","rtl");
  New_div.innerHTML = "<div class=\"col-md-8 col-12\"><div class=\"input-group input-group mb-2 col-md-6 col-12\"><span class=\"input-group-text\" id=\"inputGroup-sizing\">رقم الهاتف  :</span><input type=\"number\" class=\"form-control\" aria-label=\"Sizing example input\" aria-describedby=\"inputGroup-sizing-sm\"></div></div><div class=\"col-md-2 col-6\"><button  class=\"btn btn-primary\" onclick=\"addPhone()\">اضافه رقم اخر</button></div><div class=\"col-md-2 col-6\"><button class=\"btn btn-danger w-auto\" onclick=\"remove_Dad_Phone()\"><i class=\"bi bi-x-lg\"></i></button></div>";
  dadphone.appendChild(New_div);
}

function remove_Dad_Phone(){
  document.getElementById("delete1").remove();
}

function add_mum_Phone(){
  let mumphone = document.getElementById("mum-phone");
  let New_div = document.createElement("div");
  New_div.setAttribute("class","row my-3");
  New_div.setAttribute("id","delete-mum");
  New_div.setAttribute("dir","rtl");
  New_div.innerHTML = "<div class=\"col-md-8 col-12\"><div class=\"input-group input-group mb-2 col-md-6 col-12\"><span class=\"input-group-text\" id=\"inputGroup-sizing\">رقم الهاتف  :</span><input type=\"number\" class=\"form-control\" aria-label=\"Sizing example input\" aria-describedby=\"inputGroup-sizing-sm\"></div></div><div class=\"col-md-2 col-6\"><button  class=\"btn btn-primary\" onclick=\"add_mum_Phone()\">اضافه رقم اخر</button></div><div class=\"col-md-2 col-6\"><button class=\"btn btn btn-danger\" onclick=\"remove_Mum_Phone()\"><i class=\"bi bi-x-lg\"></i></button></div>";
  mumphone.appendChild(New_div);
}

function remove_Mum_Phone(){
  document.getElementById("delete-mum").remove();
}

function addExpenses(){
  let newExpenses = document.getElementById("newExpenses1");
  let New_div = document.createElement("div");
  New_div.setAttribute("class","row my-3");
  New_div.setAttribute("id","delete-Expenses1");
  New_div.setAttribute("dir","rtl");
  New_div.innerHTML = "<div class=\"col-md-4 col-12\"><div class=\"input-group mb-3\"><select class=\"form-select rounded-pill\" aria-label=\"Default select example\"><option selected>نوع المصاريف</option><option value=\"1\">رعايه</option><option value=\"2\">ملازم</option><option value=\"3\">مصاريف عاديه</option><option value=\"4\">ثمن ملف </option><option value=\"5\">اعفاءات </option><option value=\"6\">السيارة</option><option value=\"7\">ايصالات ملغيه</option><option value=\"8\">مبالغ مسترده</option><option value=\"9\">مصاريف تاسيس (للمحولين)</option></select></div></div><div class=\"col-md-4 col-12\"><div class=\"input-group mb-3\"><span class=\"input-group-text rounded-3\" id=\"inputGroup-sizing-default-1\">المبلغ المدفوع</span><input type=\"number\" class=\"form-control mx-1 rounded-pill\" aria-label=\"Sizing example input\" aria-describedby=\"inputGroup-sizing-default\"></div></div><div class=\"col-md-4 col-12\"><div class=\"input-group mb-3 justify-content-around justify-content-md-start\"><button class=\"btn btn-primary mx-3 rounded-pill\" onclick=\"addExpenses()\">اضافه مصاريف</button><button class=\"btn btn-danger rounded-circle\" onclick=\"removeExpenses()\"><i class=\"bi bi-trash\"></i></button></div></div>";
  newExpenses.appendChild(New_div);
}
function removeExpenses(){
  document.getElementById("delete-Expenses1").remove();
}
function addExpensesI(){
  let newExpenses = document.getElementById("newExpenses2");
  let New_div = document.createElement("div");
  New_div.setAttribute("class","row my-3");
  New_div.setAttribute("id","delete-Expenses2");
  New_div.setAttribute("dir","rtl");
  New_div.innerHTML = "<div class=\"col-md-4 col-12\"><div class=\"input-group mb-3\"><select class=\"form-select rounded-pill\" aria-label=\"Default select example\"><option selected>نوع المصاريف</option><option value=\"1\">رعايه</option><option value=\"2\">ملازم</option><option value=\"3\">مصاريف عاديه</option><option value=\"4\">ثمن ملف </option><option value=\"5\">اعفاءات </option><option value=\"6\">السيارة</option><option value=\"7\">ايصالات ملغيه</option><option value=\"8\">مبالغ مسترده</option><option value=\"9\">مصاريف تاسيس (للمحولين)</option> </select></div></div><div class=\"col-md-4 col-12\"><div class=\"input-group mb-3\"><span class=\"input-group-text rounded-3\" id=\"inputGroup-sizing-default-1\">المبلغ المدفوع</span><input type=\"number\" class=\"form-control mx-1 rounded-pill\" aria-label=\"Sizing example input\" aria-describedby=\"inputGroup-sizing-default\"></div></div><div class=\"col-md-4 col-12\"><div class=\"input-group mb-3 justify-content-around justify-content-md-start\"><button class=\"btn btn-primary mx-3 rounded-pill\" onclick=\"addExpensesI()\">اضافه مصاريف</button><button class=\"btn btn-danger rounded-circle\" onclick=\"removeExpensesI()\"><i class=\"bi bi-trash\"></i></button></div></div>";
  newExpenses.appendChild(New_div);
}
function removeExpensesI(){
  document.getElementById("delete-Expenses2").remove();
}
function addInstallment(){
  let newExpenses = document.getElementById("newInstallment");
  let New_div = document.createElement("div");
  New_div.setAttribute("class","row my-3");
  New_div.setAttribute("id","delete-Installment");
  New_div.setAttribute("dir","rtl");
  New_div.innerHTML = "<div class=\"col-12 col-md-4\"><div class=\"input-group mb-3\"><span class=\"input-group-text rounded-3\" id=\"inputGroup-sizing-default-1\">المبلغ المدفوع</span>                  <input type=\"number\" class=\"form-control rounded-pill mx-1\" aria-label=\"Sizing example input\" aria-describedby=\"inputGroup-sizing-default\"></div></div><div class=\"col-12 col-md-4\"><div class=\"input-group mb-3 col-12 col-md-6\"><span class=\"input-group-text rounded-3\" id=\"inputGroup-sizing-default-1\"> تاريخ السداد </span><input type=\"date\" class=\"form-control rounded-pill mx-1\" aria-label=\"Sizing example input\" aria-describedby=\"inputGroup-sizing-default\"></div></div><div class=\"co-12 col-md-4\"><div class=\"input-group mb-3 justify-content-around justify-content-md-start\"><button class=\"btn btn-primary mx-3 rounded-pill\" onclick=\"addInstallment()\">اضافه مصاريف</button><button class=\"btn btn-danger rounded-circle\" onclick=\"removeInstallment()\"><i class=\"bi bi-trash\"></i></button></div></div>";
  newExpenses.appendChild(New_div);
}
function removeInstallment(){
  document.getElementById("delete-Installment").remove();
}
function addDiscount(){
  let newExpenses = document.getElementById("newDisc");
  let New_div = document.createElement("div");
  New_div.setAttribute("class","row my-3");
  New_div.setAttribute("id","delete-Disc");
  New_div.setAttribute("dir","rtl");
  New_div.innerHTML = "            <div class=\"col-md-3 col-12\">              <div class=\"input-group mb-3\">                <span class=\"input-group-text rounded-3\" id=\"inputGroup-sizing-default\">قيمه الخصم</span>                                <div class=\"w-25 d-flex mx-5 justify-content-center rounded-pill exp-label\">                  <span class=\"text-center pt-1\" id=\"inputGroup-sizing-default\">30</span>                </div>              </div>            </div>            <div class=\"col-md-3 col-12\">              <div class=\"input-group mb-3\">                <select class=\"form-select rounded-pill\" aria-label=\"Default select example\">                  <option selected>نوع الخصم</option>                  <option value=\"1\">حفظه قران</option>                </select>              </div>            </div>            <div class=\"col-md-3 col-12\">              <div class=\"input-group mb-3\">                <span class=\"input-group-text rounded-3\" id=\"inputGroup-sizing-default-1\">الباقي</span>                <div class=\"w-25 d-flex mx-5 justify-content-center rounded-pill exp-label\">                  <span class=\"text-center pt-1\" id=\"inputGroup-sizing-default\">30</span>                </div>              </div>            </div>            <div class=\"col-md-3 col-12\">              <div class=\"input-group mb-3\">                <button onclick=\"addDiscount()\" class=\"btn btn-primary rounded-pill mx-2\">اضافه خصم اخر</button>                <button onclick=\"removeDiscount()\" class=\"btn btn-danger rounded-pill\"><i class=\"bi bi-trash2\"></i></button>              </div>            </div>";
  newExpenses.appendChild(New_div);
}
function removeDiscount(){
  document.getElementById("delete-Disc").remove();
}
function addAbsence(){
  let newExpenses = document.getElementById("newAbsence");
  let New_div = document.createElement("div");
  New_div.setAttribute("class","row my-3");
  New_div.setAttribute("id","delete-Absence");
  New_div.setAttribute("dir","rtl");
  New_div.innerHTML = "          <div class=\"col-md-4 col-12\">            <div class=\"input-group input-group mb-2 col-md-6 col-12\">              <span class=\"input-group-text\" id=\"inputGroup-sizing\">تاريخ الغياب:</span>              <input type=\"date\" class=\"form-control\" aria-label=\"Sizing example input\" aria-describedby=\"inputGroup-sizing-sm\">            </div>          </div>          <div class=\"col-md-4 col-12\">            <div class=\"input-group input-group mb-2 col-md-6 col-12\">              <select class=\"form-select\" aria-label=\"Default select example\">                <option selected>نوع الغياب</option>                <option value=\"1\"></option>                <option value=\"2\"></option>                <option value=\"2\"></option>              </select>            </div>          </div>          <div class=\"col-md-4 col-12\">            <button class=\"btn btn-primary mx-2\" onclick=\"addAbsence()\">اضافه غياب </button>            <button class=\"btn btn-danger\" onclick=\"removeAbsence()\"><i class=\"bi bi-x-lg\"></i></button>          </div>";
  newExpenses.appendChild(New_div);
}
function removeAbsence(){
  document.getElementById("delete-Absence").remove();
}
function delete_table_Absence(){
  document.getElementById("added-Absence").remove();
}