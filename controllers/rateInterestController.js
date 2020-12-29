var controller = {};

const { sequelize } = require("../models");
const models = require("../models");

controller.createRateInterest = async (body) => {
  return await sequelize
    .transaction((t) => {
      return models.RateInterest.create({ ...body });
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};
controller.addNewRateInterest = async (day,month,year, term, rateInterest) => {
  var newCode = makeCodeRate(day,month, year);
  const newRate = {
    term: term,
    rateInterest: rateInterest,
    day:day,
    month: month,
    year: year,
    isTall: false,
    codeRate: null,
  };
  const list = await models.RateInterest.findAll({
    where: { term: term },
  });
  if (list[0] == null) {
    newRate.isTall = true;
    return await models.RateInterest.create({ ...newRate });
  } else {
    var length = Object.size(list);
    var i;
    for (i = 0; i < length; i++) {
      list[i].dataValues.currentCode = makeCodeRate(
        list[i].day,
        list[i].month,
        list[i].year
      );
    }

    var last = [];
    var branhPut = [];
    var branhRoot = [];
    list.forEach((element) => {
      if (element.isTall == true) last = element.dataValues;
      if (element.dataValues.currentCode == newCode)
        branhPut = element.dataValues;
      if (element.codeRate == null) branhRoot = element.dataValues;
    });
    if (last.currentCode < newCode) {
      newRate.isTall = true;
      newRate.codeRate = last.currentCode;
      let getLast = await models.RateInterest.findOne({
        where: { isTall: true, term: term },
      });
      await getLast.update({
        isTall: false,
      });
      return await models.RateInterest.create({ ...newRate });
    }

    if (branhPut.currentCode == newCode) {
      var result = await putByTermAndCode(
        "" + branhPut.currentCode,
        term,
        rateInterest
      );
      return result;
      //return { state: "branh Put", data: result };
    }
    if (branhRoot.currentCode > newCode) {
      let getRoot = await models.RateInterest.findOne({
        where: { codeRate: null, term: term },
      });
      await getRoot.update({
        codeRate: newCode,
      });
      return await models.RateInterest.create({ ...newRate });
      //return "branh root";
    }
    var pre = -1;
    var next = 99999999;
    list.forEach((element) => {
      if (
        element.dataValues.currentCode > pre &&
        element.dataValues.currentCode < newCode
      )
        pre = element.dataValues.currentCode;
      if (
        element.dataValues.currentCode < next &&
        element.dataValues.currentCode > newCode
      )
        next = element.dataValues.currentCode;
    });
    let nextOjb = await getOjbByCode(next + "", term);
    await nextOjb.update({
      codeRate: newCode,
    });
    newRate.codeRate = parseInt(pre);
    return await models.RateInterest.create({ ...newRate });
    //return "branh 2";
  }
};
//req :  month, year, term , rateInterest %
//gen code
function makeCodeRate(day, month, year) {
  var temp = "" + parseInt(month);
  var temp2 = "" + parseInt(day);
  var str = "" + year;
  if (temp.length == 1) 
    str = str + "0" + temp;
  else 
    str = str + temp;
  if (temp2.length == 1) 
    str = str + "0" + temp2;
  else 
    str = str + temp2;
  return parseInt(str);
}
function deCodeMonth(code) {
  return parseInt(code.slice(4, 6));
}
function deCodeYear(code) {
  return parseInt(code.slice(0, 4));
}
function deCodeDay(code) {
  return parseInt(code.slice(6, 8));
}
Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
async function getOjbByCode(code, term) {
  var day= deCodeDay(code);
  var month = deCodeMonth(code);
  var year = deCodeYear(code);
  return await models.RateInterest.findOne({
    where: {
      term: term,
      day:day,
      month: month,
      year: year,
    },
  });
}
async function putByTermAndCode(code, term, rateInterest) {
  let getObj = await getOjbByCode(code, term);
  return await getObj.update({
    rateInterest: rateInterest,
  });
}

controller.getRateByDay = async (withdrawalDate, term) => {
  var codeStart = getCodeByDay(withdrawalDate);
  const list = await models.RateInterest.findAll({
    where: { term: term },
  });
  if (list[0] == null) {
    return "null list";
  }
  var length = Object.size(list);
  var pre = -1;
  var i;
  var currentCode;
  for (i = 0; i < length; i++) {
    currentCode = makeCodeRate(list[i].day,list[i].month, list[i].year);
    if (currentCode > pre && currentCode <= codeStart) pre = currentCode;
  }
  if (pre == -1) {
    return list.filter((x) => x.codeRate == null);
  }
  return getOjbByCode(pre + "", term);
};

function getCodeByDay(date) {
  //String format mm/dd/yyyy
  var Days = new Date(date);
  var day=Days.getUTCDate()+1;
  var month = Days.getUTCMonth() + 1;
  var year = Days.getFullYear();
  return makeCodeRate(day, month, year);
}

controller.deleteRateInterestById = async (id) => {
  return await models.RateInterest.destroy({
    where: { id: id },
  });
};
controller.updateRateInterest = async (rateInterest, body) => {
  return await rateInterest
    .update({
      ...body,
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
};
controller.FindAll = async () => {
  return await models.RateInterest.findAll();
};
controller.FindRateInterestByID = async (id) => {
  return await models.RateInterest.findOne({
    where: { id: id },
  });
};

module.exports = controller;
