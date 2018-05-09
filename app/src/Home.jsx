import React from 'react';

import './home.css';

import GlobalBookList from './GlobalBookList';

const Home = props => (
  <div className='home'>
    <GlobalBookList { ...props } />
  </div>
);

export default Home;
