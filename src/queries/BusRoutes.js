const db = require("../db/models/index");
const { mapToJSON } = require("./utlis");

const getBusRoutes = () => {
    return db["BusRoute"].findAll().then(mapToJSON);
};

const updateBusRoutes = (newRoutes,deletedRoutes,goingToUpdateroutes) => {
    return db.sequelize.transaction((t) => {
        // add new ones
        let proms = []; 
        proms.push(db["BusRoute"].bulkCreate(newRoutes,{transaction : t}));
        // delete
        deletedRoutes.forEach(route => {
            proms.push(db["BusRoute"].destroy({
                where : {
                    BusRouteId : route.BusRouteId
                }
            }));
        });
        // update 
        goingToUpdateroutes.forEach(route => {
            proms.push(db["BusRoute"].update(route.newData,{
                where : {
                    BusRouteId : route.BusRouteId
                }
            }))
        });
        return Promise.all(proms);
    });
}; 
module.exports = {
    getBusRoutes,
    updateBusRoutes
};