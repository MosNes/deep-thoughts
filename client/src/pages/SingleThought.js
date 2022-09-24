import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';
import ReactionForm from '../components/ReactionForm';
import Auth from '../utils/auth';

const SingleThought = (props) => {
	//get thoughtId from URL params
	const { id: thoughtId } = useParams();
	
	//use thoughtId to make a GraphQL query to the DB
	const { loading, data } = useQuery(QUERY_THOUGHT, {
		variables: { id: thoughtId },
	});

	//if the returned data contains a 'thought' property, return it. Otherwise return an empty object.
	const thought = data?.thought || {};
	console.log(thought);

	//if data returned from DB yet, render a 'loading' page
	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="card mb-3">
				<p className="card-header">
					<span style={{ fontWeight: 700 }} className="text-light">
						{thought.username}
					</span>{' '}
					thought on {thought.createdAt}
				</p>
				<div className="card-body">
					<p>{thought.thoughtText}</p>
				</div>
			</div>
			{thought.reactionCount > 0 && (
				<ReactionList reactions={thought.reactions} />
			)}
			{/* conditionally render the Reaction Form component if the user is logged in, and pass it thoughtId as a prop */}
			{Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
		</div>
	);
};

export default SingleThought;
