var mongoose = require('mongoose');
var mongoTypes = require('mongoose-types');
var configs = require('../website-configs');
mongoTypes.loadTypes(mongoose, 'url');

var Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var AppSchema = new Schema({}, {collection: 'PROJECT'});

AppSchema.statics.getBundles = function(fn){
    PROJECT.aggregate([
        {$unwind: '$value.sections'},
        {$group: {_id: '$value.sections'}},
        {$match: {'_id.type': 'bundlelist_horizontal'}},
        {$unwind: '$_id.bundles'},
        {$group: {_id: '$_id.bundles'}}
    ], function(err, res){
        if(err) console.error(err);

        var result = [];

        res.forEach(function(item){
            result.push(item._id);
        });

        fn(null, result);
    });
};

PROJECT = mongoose.model('PROJECT', AppSchema);

module.exports = PROJECT;
