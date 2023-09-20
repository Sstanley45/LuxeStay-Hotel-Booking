import React from 'react'

const Success = ({msg}) => {
  return (
    <div class="alert alert-success" role="alert">
      <h2>{msg}</h2>
    </div>
  );
}

export default Success