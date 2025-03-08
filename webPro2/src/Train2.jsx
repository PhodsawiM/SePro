import React from 'react';
import * as tf from '@tensorflow/tfjs';
import { useModel } from './ModelContext';

const Train = () => {
  const { setModel } = useModel();

  const trainModel = async () => {
    // Example model
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, inputShape: [10] }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    // Example data
    const xs = tf.randomNormal([100, 10]);
    const ys = tf.randomNormal([100, 10]);

    // Train the model
    await model.fit(xs, ys, { epochs: 5 });

    console.log('Model trained');

    // Save the trained model to context
    setModel(model);
    console.log('Model saved to context');
  };

  return (
    <div>
      <button onClick={trainModel}>Train Model</button>
    </div>
  );
};

export default Train;
