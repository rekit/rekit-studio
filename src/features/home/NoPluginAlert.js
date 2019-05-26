import React from 'react';

export default ({ plugin }) => (
  <div className="home-no-plugin-alert">
    <p>The current application type requires plugin <b>{plugin}</b> but not found.</p>
    <p>Please manually install it via plugin manager or command line:</p>
    <code>&gt; rekit install rekit-plugin-{plugin}</code>
    <p>After installation, restart Rekit Studio to apply it.</p>
  </div>
);
