//import auth error handling from Apollo Server
const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		//get all thoughts, or all thoughts by a specific user
		//parent has to be passed as first param, so 2nd param can be accessed
		thoughts: async (parent, { username }) => {
			//if username exists, add it as property of params, else set params to empty object
			const params = username ? { username } : {};
			//find thought by params, and sort by createdAt time, descending (-1)
			return Thought.find(params).sort({ createdAt: -1 });
		},

		//get thought by ID
		thought: async (parent, { _id }) => {
			return Thought.findOne({ _id });
		},

		//get all users
		users: async () => {
			return (
				User.find()
					//do not return versin or password
					.select('-__v -password')
					//also return user's friends and thoughts
					.populate('friends')
					.populate('thoughts')
			);
		},

		//get user by username
		user: async (parent, { username }) => {
			return User.findOne({ username })
				.select('-__v -password')
				.populate('friends')
				.populate('thoughts');
		},

		//authenticate a user
		me: async (parent, args, context) => {
			// if request contains a valid user object inside of the context (i.e. the auth middleware succeeded)
			if (context.user) {
				const userData = await User.findOne({})
					.select('-__v -password')
					.populate('thoughts')
					.populate('friends');

				return userData;
			}

			// else throw an auth error
			throw new AuthenticationError('Not Logged In');
		},
	},

	Mutation: {
		//adds new user to db
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);
			return { token, user };
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

			const token = signToken(user);

			return { token, user };
		},

		//adds new thought
		addThought: async (parent, args, context) => {
			if (context.user) {
				//creates the new thought
				const thought = await Thought.create({
					...args,
					username: context.user.username,
				});

				//adds the thought to the User's thought array
				await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $push: { thoughts: thought._id } },
					{ new: true }
				);

				return thought;
			}

			throw new AuthenticationError('You need to be logged in!');
		},

		//adds new reaction
		addReaction: async (parent, { thoughtId, reactionBody }, context) => {
			if (context.user) {
				const updatedThought = await Thought.findOneAndUpdate(
					{ _id: thoughtId },
					{
						$push: {
							reactions: {
								reactionBody,
								username: context.user.username,
							},
						},
					},
					{ new: true, runValidators: true }
				);

				return updatedThought;
			}

			throw new AuthenticationError('You need to be logged in!');
		},

        //adds new friend to friends array
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    //use addToSet instead of push to prevent the same user from being added twice to the friends list
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }

        
	},
};

module.exports = resolvers;
