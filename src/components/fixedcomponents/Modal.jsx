import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({setModal, children}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className='bg-white p-3 rounded-sm w-[400px]'>
       {children}
      </div>
    </div>,
    document.getElementById('modal')
  );
};

export default Modal;
