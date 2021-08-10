module.exports = {
  up: async (queryInterface, Sequelize) => {
    let records = [];
    for (let i = 1; i < 10; i++) {
      let stud_nat_id = ''
      let father_nat_id = ''
      let mother_nat_id = ''
      for (let j = 0; j < 14; j++){
          stud_nat_id+=`${i}`
          father_nat_id+=`${i-1}`
          mother_nat_id+=`${i-1}`
      }
      records.push({
        StudentNationalId: stud_nat_id,
        StudentFatherNationalId: father_nat_id,
        StudentMotherNationalId: mother_nat_id,
        StudentName: `Student ${i}`,
        StudentBirthDate: `9-9-2009`,
        StudentBirthGovernorateId: i,
        StudentBirthDistrictId: i,
        StudentRegisterDate: `10-10-2010`,
        StudentClassId: i,
        RemainingCost: i*100,
        StudentAddress: `Address ${i}`
      })
    }
    await queryInterface.bulkInsert('Student', records, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Student', null, {});
  }
};
