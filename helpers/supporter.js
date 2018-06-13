const Supporter = require('../database/models/supporter')

const getNextSupporter = async () => {
    let nextSupporter = await Supporter.findOneAndUpdate({is_active: 'true'}, {last_assign_date: new Date()}).sort({last_assign_date: 1})

    if( nextSupporter ) {
        return nextSupporter
    }
    return false
}

module.exports = {
    getNextSupporter
}