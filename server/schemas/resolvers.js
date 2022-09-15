//import auth error handling from Apollo Server
const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');

const resolvers = {
	Query: {
        //get all thoughts, or all thoughts by a specific user
        //parent has to be passed as first param, so 2nd param can be accessed
		thoughts: async (parent, {username}) => {
            //if username exists, add it as property of params, else set params to empty object
            const params = username ? { username } : {};
            //find thought by params, and sort by createdAt time, descending (-1)
			return Thought.find(params).sort({ createdAt: -1 });
		},

        //get thought by ID
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id })
        },

        //get all users
        users: async () => {
            return User.find()
                //do not return versin or password
                .select('-__v -password')
                //also return user's friends and thoughts
                .populate('friends')
                .populate('thoughts');
        },

        //get user by username
        user: async (parent, {username}) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        }
	},
    
    Mutation: {
        //adds new user to db
        addUser: async (parent, args) => {
            const user = await User.create(args);
            return user;
        },

        //user logs in and receives token
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Email or Password incorrect!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Email or Password incorrect!');
            }

            return user;
        }
    }
};

module.exports = resolvers;
