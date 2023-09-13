const agg = [
  {
    '$match': {
      'product': new ObjectId('64b7ecf29f163973bcdc5da0')
    }
  }, {
    '$group': {
      '_id': null,
      'avarageRating': {
        '$avg': '$rating'
      },
      'numOfReviews': {
        '$sum': 1
      }
    }
  }
]