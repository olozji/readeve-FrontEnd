import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";

interface ModalType {
  isOpen: boolean;
  onClose?: () => void; // 모달을 닫을 때 호출할 함수
  children: React.ReactNode;
}

const CustomModal = ({ isOpen, onClose, children }: ModalType) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 모달 외부를 클릭했을 때 모달을 닫음
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

//   const handleConfirmation = (selected:any) => {
//     if(selected) {
//         onConfirm(selected);
//     }
//     setOpen(false);
// }

const confirmPlace = (place:any) => {
    setSelected(place);
}


  return (
    <Modal open={open} onClose={handleClose}>
      <div onClick={handleOutsideClick}>
        <Paper
          elevation={2}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            maxWidth: "100%",
            maxHeight: "90%",
            overflowY: "auto",
          }}
        >
          {children}
        </Paper>
      </div>
    </Modal>
  );
};

export default CustomModal;
