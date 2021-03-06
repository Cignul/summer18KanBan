let router = require('express').Router()
let Comments = require('../models/comment')

//GET by TaskID
router.get('/:taskId', (req, res, next) => {
  // @ts-ignore
  Comments.find({ taskId: req.params.taskId })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
      next()
    })
})

//POST
router.post('/', (req, res, next) => {
  // @ts-ignore
  req.body.authorId = req.session.uid
  Comments.create(req.body)
    .then(newComment => {
      res.send(newComment)
    })
    .catch(err => {
      console.log(err)
      next()
    })
})

//PUT
router.put('/:id', (req, res, next) => {
  Comments.findById(req.params.id)
    .then(comment => {
      // @ts-ignore
      if (!comment.authorId.equals(req.session.uid)) {
        return res.status(401).send("ACCESS DENIED!")
      }
      comment.update(req.body, (err) => {
        if (err) {
          console.log(err)
          next()
          return
        }
        res.send("Successfully Updated")
      });
    })
    .catch(err => {
      console.log(err)
      next()
    })
})

//DELETE
// @ts-ignore
//deletes a comment
router.delete('/:id', (req, res, next) => {
  Comments.findById(req.params.id)
    .then(comment => {
      // @ts-ignore
      if (!comment.authorId.equals(req.session.uid)) {
        return res.status(401).send("ACCESS DENIED!")
      }
      Comments.findByIdAndRemove(req.params.id)
        // @ts-ignore
        .then(data => {
          res.send('DELORTED')
        })
    })
})


module.exports = router