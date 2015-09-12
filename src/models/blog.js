var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  msg: String,
  created: { type: Date, default: Date.now },
  _userId: Schema.Types.ObjectId,
  user: String
});

var blogSchema = new Schema({
  title:  { type: String, index: true },
  slug: { type: String, index: { unique: true } },
  sub: String,
  body: String,
  user: String,
  _userId: { type: Schema.Types.ObjectId, index: true },
  comments: [commentSchema],
  created: { type: Date, default: Date.now, index: true },
  hidden: Boolean,
  tags: { type: [String], index: true },
  cover: String,
  draft: Boolean,
  meta: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  }
}
// it is recommended this behavior be disabled in production since index creation can cause a significant performance impact
//{ autoIndex: false }
);

blogSchema.static('allNonDraft', function (callback) {
  return this.find({ draft: { $ne: true } }, callback);
});

blogSchema.static('all', function (callback) {
  return this.find({}, callback);
});

// Compound index
//blogSchema.index({ title: 1, user: 1, _userId: 1 }); // schema level

module.exports = mongoose.model('Blog', blogSchema);
