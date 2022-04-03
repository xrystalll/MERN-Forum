
const { Schema, model, Types } = require('mongoose');


const GroupSchema = new Schema({
    user: { types: Types.ObjectId},
})

module.exports = model('Group', GroupSchema)