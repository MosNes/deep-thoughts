import React from 'react';
import { Link } from 'react-router-dom';

const ThoughtList = ({ thoughts, title }) => {

	if (!thoughts.length) {
		return <h3>No Thoughts Yet</h3>;
	}

	return (
		<div>
			<h3>{title}</h3>
			{/* if thoughts are present */}
			{thoughts &&
				// map through each thought and render it as an element on the page
				thoughts.map((thought) => (
					//create key for react to reference
					<div key={thought._id} className="card mb-3">
						<p className="card-header">
							<Link
								to={`/profile/${thought.username}`}
								style={{ fontWeight: 700 }}
								className="text-light"
							>
								{thought.username}
							</Link>{' '}
							thought on {thought.createdAt}
						</p>
						<div className="card-body">
							<Link to={`/thought/${thought._id}`}>
								<p>{thought.thoughtText}</p>
								<p className="mb-0">
									Reactions: {thought.reactionCount} || Click to{' '}
									{/* if thought has reactions, use 'see', else use 'start' */}
									{thought.reactionCount ? 'see' : 'start'} the
									discussion!
								</p>
							</Link>
						</div>
					</div>
				))}
		</div>
	);
};

export default ThoughtList;