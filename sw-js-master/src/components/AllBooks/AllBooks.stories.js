import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import AllBooks from '.';

import { imageObject } from '../Img/Img.stories.js';

setAddon(JSXAddon);

const stories = storiesOf('AllBooks', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;
  const numberOfBooks = number('Number of Books', 12, {
     range: true,
     min: 0,
     max: 12,
     step: 1,
  });

  const books = Array.apply(null, {length: numberOfBooks}).map((n, i) => {
    return {
      title: `The Elephant in the Room ${i}`,
      slug: `the-elephant-in-the-room-${i}`,
      coverImage: imageObject,
      language: 'English',
      level: Math.floor(Math.random() * 4 + 1),
      authors: [
        {name: 'Sam Wilson', slug: '/users/sam-wilson'},
        {name: 'Sam Wilson II', slug: '/users/sam-wilson-ii'}
      ],
      description: 'These stories talk about seasons in an Indian context, often linking the seasons to particular festivals which certain communities celebrate at that time of year, and particular foods which are eaten. You can use these books to talk about diversity across India, introduce the difference between ‘weather’ and ‘seasons’ and to encourage children to think about their immediate context in relation to wider contexts.',
      howToUse: 'This story is about this, which can be read to them…'
    };
  });

  return <AllBooks books={books} />
});
