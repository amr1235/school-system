const db = require("../db/models/index");

const mapToJSON = payload => {
  return payload.map(item => item.toJSON());
};
// eslint-disable-next-line no-unused-vars
const getAllDepartments = () => {
  return db["Department"].findAll().then(mapToJSON);
};
// eslint-disable-next-line no-unused-vars
const getDepartmentByID = ID => {
  return db["Department"].findByPk(ID).then(dep => dep.toJSON());
};
// eslint-disable-next-line no-unused-vars
const updateDepartment = (depName, currentPassword, EditedPassword) => {
  db["Department"].findOne({
    where: {
      DepartmentName: depName
    }
  }).then(dep => dep.toJSON()).then(dep => {
    console.log(dep);
    if (currentPassword === dep["DepartmentPassword"]) {
      return db["Department"].update({DepartmentPassword: EditedPassword}, {
        where: {
          DepartmentName: depName
        }
      });
    } else {
      console.log("Not Equal");
      return null;
    }
  });
};
// getAllDepartments()
// getDepartmentByID(1).then(console.log);
// updateDepartment("Affairs", "123456789", "123123123");
