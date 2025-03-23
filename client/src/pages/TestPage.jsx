import React from 'react';
import Navbar from '../components/Navbar';

const TestPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Test Page</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-800 mb-4">
            This is a simple test page to verify that React rendering is working correctly.
          </p>

          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Test Button 1
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Test Button 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
