import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

const Signup = () => {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });

  //creates the addUser function from the ADD_USER GraphQL query, to be called later
  const [addUser, { error }] = useMutation(ADD_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form, async due to it having to interact with the DB
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // use try/catch instead of promises for error handling
    try {
      //execute addUser mutation adn pass in variable data from form
      const {data} = await addUser({
        //spreads out all the properties of formState to use them as variables for the query, since the properties have the same name as the expected variables
        variables: {...formState}
      });
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className='flex-row justify-center mb-4'>
      <div className='col-12 col-md-6'>
        <div className='card'>
          <h4 className='card-header'>Sign Up</h4>
          <div className='card-body'>
            <form onSubmit={handleFormSubmit}>
              <input
                className='form-input'
                placeholder='Your username'
                name='username'
                type='username'
                id='username'
                value={formState.username}
                onChange={handleChange}
              />
              <input
                className='form-input'
                placeholder='Your email'
                name='email'
                type='email'
                id='email'
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className='form-input'
                placeholder='******'
                name='password'
                type='password'
                id='password'
                value={formState.password}
                onChange={handleChange}
              />
              <button className='btn d-block w-100' type='submit'>
                Submit
              </button>
              {/* display error if error exists */}
              {error && <div>Sign Up Failed</div>}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
