import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect404 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Some condition to redirect to 404
    const isPageValid = false;
    if (!isPageValid) {
      navigate('/404'); // Redirect to 404 page
    }
  }, [navigate]);

  return <div>error</div>;
};

export default Redirect404;
