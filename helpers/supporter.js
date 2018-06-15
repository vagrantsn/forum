const Supporter = require('../database/models/supporter')

const getNextSupporter = async () => {
  let nextSupporter = await Supporter.findOneAndUpdate({is_active: 'true'}, {last_assign_date: new Date()}).sort({last_assign_date: 1})

  return nextSupporter
}

const getSupporterBySlackId = async (slack_id) => {
  let supporter = await Supporter.findOne({ slack_id })
  return supporter
}

module.exports = {
  getNextSupporter,
  getSupporterBySlackId
}
