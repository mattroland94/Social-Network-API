const {User, Thought} = require('../models');
const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },
    getThoughtById({params}, res) {
        Thought.findOne({_id: params.id})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'Thought not found with id'});
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
    createThought({body}, res) {
        Thought.create(body)
            .then(({_id}) => {
                return User.findOneandUpdate(
                    {_id: body.userId},
                    {$push: {thoughts: _id}},
                    {new: true}
                )
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({message: 'User not found with id'});
                        return;
                    }
                    res.json(dbUserData);
                })
                .catch(err => res.json(err));
            })
    },
    updateThought({params, body}, res) {
        Thought.findOneandUpdate(
            {_id: params.id},
            body,
            {new: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'Thought not found with id'});
                return;
            }
            User.findOneandUpdate(
                {username: dbThoughtData.username},
                {$pull: {thoughts: params.id}}
            )
            .then(() => {
                res.json({message: 'Delete Success'})
            })
            .catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err));
    },
    deleteThought({params}, res) {
        Thought.findOneAndDelete({_id: params.id})
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'Thought not found with id'});
                    return;
                }
                User.findOneAndUpdate(
                    {username: dbThoughtData.username},
                    {$pull: {thoughts: params.id}}
                )
                .then(() => {
                    res.json({message: 'Thought Deleted'})
                })
                .catch(err => res.status(500).json(err))
            })
            .catch(err => res.status(500).json(err));
    },
    addReaction({params, body}, res) {
        Thought.findOneandUpdate(
            {_id: params.thoughtId},
            {$push: {reactions: body}},
            {new: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'Thought not found with id'})
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },
    deleteReaction({params}, res) {
        Thought.findOneandUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'Thought not found with id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    }
}

module.exports = thoughtController;