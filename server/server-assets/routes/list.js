let router = require('express').Router()
let Lists = require('../models/list')
let Tasks = require('../models/task')

//GET
router.get('/', (req, res, next) => {
  // @ts-ignore
  Lists.find({ authorId: req.session.uid })
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
  Lists.create(req.body)
    .then(newList => {
      res.send(newList)
    })
    .catch(err => {
      res.status(400).send(err)
      next()
    })
})

//PUT
router.put('/:id', (req, res, next) => {
  Lists.findById(req.params.id)
    .then(list => {
      // @ts-ignore
      if (!list.authorId.equals(req.session.uid)) {
        return res.status(401).send("ACCESS DENIED!")
      }
      list.update(req.body, (err) => {
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
//deletes a whole list
// @ts-ignore
router.delete('/:id', (req, res, next) => {
  Lists.findById(req.params.id)
    .then(list => {
      // @ts-ignore
      if (!list.authorId.equals(req.session.uid)) {
        return res.status(401).send("ACCESS DENIED!")
      }
      Lists.findByIdAndRemove(req.params.id)
        // @ts-ignore
        .then(data => {
          res.send('DELORTED')
        })
    })
})


//api/lists/listId/tasks
router.get('/:listId/tasks', (req, res, next) => {
  // @ts-ignore
  Tasks.find({ listId: req.params.listId })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
      next()
    })
})


module.exports = router