function byScore(a, b){
  return (b.data.score - a.data.score) || (b.data.created_utc - a.data.created_utc)
}
function  byDate(a, b){
  return (b.data.created_utc - a.data.created_utc) || (b.data.score - a.data.score)
}
function  byComments(a, b){
  if (a.data.num_comments && b.data.num_comments) {
    return (b.data.num_comments - a.data.num_comments) || (b.data.score - a.data.score)
  } if (a.data.num_comments) {
    return -1
  } else if (b.data.num_comments) {
    return 1
  } else {
    return (b.data.score - a.data.score) || (b.data.created_utc - a.data.created_utc)
  }
}
function  byHot(a, b){
  return (getHot(b) - getHot(a)) || (b.data.score - a.data.score) || (b.data.created_utc - a.data.created_utc)
}

function getHot(post){
  var s = post.data.score
  var order = Math.log10((Math.max(Math.abs(s), 1)))
  var sign = s > 0 ? 1 : (s == 0 ? 0 : -1)
  var seconds = post.data.created_utc - 1134028003
  return sign * order + seconds / 45000
}
