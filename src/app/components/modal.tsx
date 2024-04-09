import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import { useState, useEffect } from "react";
import closeIcon from '/public/images/closeIcon.png'
import Slide from '@mui/material/Slide';


interface ModalType {
  isOpen: boolean;
  onClose?: () => void; // 모달을 닫을 때 호출할 함수
  children: React.ReactNode;
  size: string
  modalheight?:string
  modalColor?:string;
}

const CustomModal = ({ isOpen, onClose, children,size,modalheight, modalColor }: ModalType) => {
  
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
      handleClose();
    
  };


const confirmPlace = (place:any) => {
    setSelected(place);
}

const handleInsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};



  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      closeAfterTransition 
      onClick={handleOutsideClick} 
      >
      <Slide direction="up" in={isOpen} timeout={600}>
      <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%', 
        }}
        >
        <Paper
          elevation={2}
          sx={{
            position: "absolute",
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            width: size,
            backgroundColor: modalColor || "white",
            maxWidth: "100%",
            maxHeight: "100%",
            overflowY: "auto",
          }}
          className={`h-[${modalheight}] sm:h-[100vh]`}
          onClick={handleInsideClick}
        >
          <Image
          src={closeIcon}
          alt="closeIcon"
          className="mr-6 mt-6 float-right cursor-pointer"
          onClick={handleClose}
        />
          {children}
        </Paper>
        </div>
      </Slide>
    </Modal>
  );
};

export default CustomModal;
