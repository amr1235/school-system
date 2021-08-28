const db = require("../db/models/index");
// eslint-disable-next-line no-unused-vars
const addPayment = (paymentName, cost) => {
  db["Category"].create({
    CategoryName: paymentName,
    CategoryCost: cost
  });
};
// eslint-disable-next-line no-unused-vars
const updatePayment = (paymentName, updatedCost) => {
  db["Category"].update({CategoryCost: updatedCost},{
    where: {
      CategoryName: paymentName
    }
  });
};
// eslint-disable-next-line no-unused-vars
const deletePayment = paymentName => {
  db["Category"].destroy({
    where: {
      CategoryName: paymentName
    }
  });
};
