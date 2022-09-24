import React, { useState } from 'react';
import { ADD_REACTION } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

const ReactionForm = ({ thoughtId }) => {

    //---------------STATE-----------------------
    const [reactionBody, setBody] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    const [addReaction, { error }] = useMutation(ADD_REACTION);

    //tracks the # of characters added in the textarea field on the form
    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setBody(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            await addReaction({
                variables: {
                    reactionBody,
                    thoughtId
                }
            });
            //reset textarea field and char count
            setBody('');
            setCharacterCount(0);
        } catch (e) {
            console.error(e);
        }
       
    };

    //---------------COMPONENT---------------------

    return (
        <div>
            <p className='m-0'>
                Character Count: {characterCount}/280
            </p>
            <form
                className='flex-row justify-center justify-space-between-md align-stretch'
                onSubmit={handleFormSubmit}
            >
                <textarea
                    value={reactionBody}
                    placeholder='Leave a reaction to this thought...'
                    className='form-input col-12 col-md-9'
                    onChange={handleChange}
                ></textarea>

                <button className='btn col-12 col-md-3' type='submit'>
                    Submit
                </button>
            </form>
            {error && <span className='ml-2'>Something went wrong...</span>}
        </div>
    );
};

export default ReactionForm;