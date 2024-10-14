import React from 'react';
import { toast } from 'react-toastify';

const LogoutConfirmationToast = ({ onConfirm, onCancel }) => {
  return (
    <div className="flex flex-col items-center rounded-lg">
      <p className='roboto-medium text-black mb-2'>Are you sure you want to log out?</p>
      <div className="flex gap-4 mt-2">
        <button
          className="bg-red-500 text-white roboto-medium  px-4 py-1 rounded-lg hover:bg-red-600"
          onClick={() => {
            onConfirm(); 
            toast.dismiss();
          }}
        >
          Yes
        </button>
        <button
          className="bg-gray-300 roboto-medium px-4 py-1 rounded-lg hover:bg-gray-400"
          onClick={() => {
            onCancel(); 
            toast.dismiss();
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default LogoutConfirmationToast;
