import React from 'react'

const Error = ({msg}) => {
  return (
    <div class="alert alert-danger" role="alert">
      {msg} 
    </div>
  );
}

export default Error