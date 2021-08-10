module.exports = {
  up: async (queryInterface, Sequelize) => {
    let records = [];
    for (let i = 1; i < 30; i++) {
      records.push({
        AcademicDegreeId: i,
        AcademicDegreeName: `AcademicDegree ${i}`,
      })
    }
    await queryInterface.bulkInsert('AcademicDegree', records, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AcademicDegree', null, {});
  }
};
