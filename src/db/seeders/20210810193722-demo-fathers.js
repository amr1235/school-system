module.exports = {
  up: async (queryInterface, Sequelize) => {
    let records = [];
    for (let i = 1; i < 10; i++) {
      let nat_id = ''
      for (let j = 0; j < 14; j++){
          nat_id+=`${i}`
      }
      records.push({
        FatherNationalId: nat_id,
        FatherName: `Father ${i}`,
        FatherAddress: `Address ${i}`
      })
    }
    await queryInterface.bulkInsert('Father', records, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Father', null, {});
  }
};
