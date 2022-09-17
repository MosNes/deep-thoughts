import React from 'react';

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
							{thought.username}
							thought on {thought.createdAt}
						</p>
						<div className="card-body">
							<p>{thought.thoughtText}</p>
							<p className="mb-0">
								Reactions: {thought.reactionCount} || Click to{' '}
                                {/* if thought has reactions, use 'see', else use 'start' */}
								{thought.reactionCount ? 'see' : 'start'} the
								discussion!
							</p>
						</div>
					</div>
				))}
		</div>
	);
};
