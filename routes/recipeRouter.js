const express = require('express');
const Recipe = require('../models/recipe');
const authenticate = require('../authenticate')

const recipeRouter = express.Router();

recipeRouter.route('/')
.get((req, res, next) => {
    Recipe.find()
    // .populate('comments.author')
    .then(recipes => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(recipes);
    })
    .catch(err => next(err));
})

    .post(authenticate.verifyUser,(req, res, next) => {
        Recipe.create(req.body)
            .then(recipe => {
                console.log('recipe created', recipe);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(recipe)
            })

            .catch(err => next(err))
    })

    .put(authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /recipes');
    })

    .delete(authenticate.verifyUser,(req, res, next) => {
        Recipe.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(response)
            })
            .catch(err => next(err))
    });


    recipeRouter.route('/:recipeId')
    .get((req, res, next) => {
        Recipe.findById(req.params.recipeId)
        .populate('comments.author')
        .then(recipe => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(recipe);
        })
        .catch(err => next(err));
    })
    
    .post(authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end('post not supported')
    })

    .put(authenticate.verifyUser,(req, res, next) => {
        Recipe.findByIdAndUpdate(req.params.recipeId, {
            $set: req.body
        }, { new: true })
            .then(recipe => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(recipe)
            })
            .catch(err => next(err))
    })

    .delete(authenticate.verifyUser,(req, res, next) => {
        Recipe.findByIdAndDelete(requ.params.recipeId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(response)
            })
            .catch(err => next(err))
    })

    recipeRouter.route('/:recipeId/comments')
    .get((req, res, next) => {
        Recipe.findById(req.params.recipeId)
        .populate('comments.author')
        .then(recipe => {
            if (recipe) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(recipe.comments);
            } else {
                err = new Error(`Recipe ${req.params.recipeId} not found`);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Recipe.findById(req.params.recipeId)
        .then(recipe => {
            if (recipe) {
                req.body.author = req.user._id;
                recipe.comments.push(req.body);
    
                    recipe.save()
                        .then(recipe => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(recipe);
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`Recipe ${req.params.recipeId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /recipes/${req.params.recipeId}/comments`);
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Recipe.findById(req.params.recipeId)
            .then(recipe => {
                if (recipe) {
                    for (let i = (recipe.comments.length - 1); i >= 0; i--) {
                        recipe.comments.id(recipe.comments[i]._id).remove();
                    }
                    recipe.save()
                        .then(recipe => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(recipe);
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`Recipe ${req.params.recipeId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

    recipeRouter.route('/:recipeId/comments/:commentId')
    .get((req, res, next) => {
        Recipe.findById(req.params.recipeId)
        .populate('comments.author')
        .then(recipe => {
    
                if (recipe && recipe.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(recipe.comments.id(req.params.commentId));
                } else if (!recipe) {
                    err = new Error(`Recipe ${req.params.recipeId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /recipes/${req.params.recipeId}/comments/${req.params.commentId}`);
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        Recipe.findById(req.params.recipeId)
            .then(recipe => {
                if (recipe && recipe.comments.id(req.params.commentId)) {
                    if (req.body.rating) {
                        recipe.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.text) {
                        recipe.comments.id(req.params.commentId).text = req.body.text;
                    }
                    recipe.save()
                        .then(recipe => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(recipe);
                        })
                        .catch(err => next(err));
                } else if (!recipe) {
                    err = new Error(`Recipe ${req.params.recipeId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Recipe.findById(req.params.recipeId)
            .then(recipe => {
                if (recipe && recipe.comments.id(req.params.commentId)) {
                    recipe.comments.id(req.params.commentId).remove();
                    recipe.save()
                        .then(recipe => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(recipe);
                        })
                        .catch(err => next(err));
                } else if (!recipe) {
                    err = new Error(`Recipe ${req.params.recipeId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

module.exports = recipeRouter;


module.exports = recipeRouter;
