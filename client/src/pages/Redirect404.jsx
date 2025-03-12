import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect404 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/404'); // Redirect to 404 page
  }, [navigate]);

  return <div>error</div>;
};

export default Redirect404;
