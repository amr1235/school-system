module.exports = {
  up: async (queryInterface, Sequelize) => {
    let records = []
    for (let i = 0; i < 5; i++) {
      records.push({
        ClassCapacity: i*5,
        GradeNumber: i+1,
        StageName: "PRIMARY",
      });
    }
    for (let i = 0; i < 5; i++) {
      records.push({
        ClassCapacity: i*5,
        GradeNumber: i+1,
        StageName: "SECONDARY",
      });
    }
    for (let i = 0; i < 5; i++) {
      records.push({
        ClassCapacity: i*5,
        GradeNumber: i+1,
        StageName: "PREP",
      });
    }
    await queryInterface.bulkInsert('Class', records, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Class', null, {});
  }
};
