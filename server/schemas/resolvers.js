const { User, Thought } = require('../models');

const resolvers = {
	Query: {
        //parent has to be passed as first param, so 2nd param can be accessed
		thoughts: async (parent, {username}) => {
            //if username exists, add it as property of params, else set params to empty object
            const params = username ? { username } : {};
            //find thought by params, and sort by createdAt time, descending (-1)
			return Thought.find(params).sort({ createdAt: -1 });
		},
	},
};

module.exports = resolvers;
