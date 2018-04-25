var mongoose = require('mongoose');

var schema = new mongoose.Schema({ 
    id: String,
    name: String,
    path: String,
    type: String,
    owner: String,
    lastModified: Date
 });
module.exports = mongoose.model('documentDetails', schema);

// module.exports = mongoose.model('documentDetails', {
//     name: String,
//     path: String,
//     type: String    
// });