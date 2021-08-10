module.exports = {
  up: async (queryInterface, Sequelize) => {
    let records = [];
    for (let i = 1; i < 10; i++) {
      let nat_id = ''
      for (let j = 0; j < 14; j++){
          nat_id+=`${i}`
      }
      records.push({
        MotherNationalId: nat_id,
        MotherName: `Mother ${i}`,
        MotherAddress: `Address ${i}`
      })
    }
    await queryInterface.bulkInsert('Mother', records, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Mother', null, {});
  }
};
