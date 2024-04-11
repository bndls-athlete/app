import React from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="modal modal-open">
        <div className="modal-box">
          {title && <h3 className="font-bold text-lg">{title}</h3>}
          <p className="py-4">{children}</p>
          <div className="modal-action">
            <Button onClick={onClose} theme="outline-primary">
              Cancel
            </Button>
            <Button onClick={onConfirm} theme="primary">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
