let mongoose = require('mongoose')
let { Schema } = mongoose

const SupporterSchema = new Schema({
  name: { type: String, required: true },
  user: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  slack_id: { type: String, required: true },
  is_active: { type: Boolean, default: false },
  last_assign_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('supporters', SupporterSchema)
