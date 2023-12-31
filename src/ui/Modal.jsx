import {
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useOutSideClick } from "../hooks/useOutSideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const onClose = () => setOpenName("");
  const onOpen = setOpenName;

  return (
    <ModalContext.Provider value={{ onClose, onOpen, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ opens: opensWindowName, children }) {
  const { onOpen } = useContext(ModalContext);

  // pretty advanced and uncommon react function
  // ! It should not be over used
  return cloneElement(children, {
    onClick: () => onOpen(opensWindowName),
  });
}

function Window({ name, children }) {
  const { openName, onClose } = useContext(ModalContext);
  const ref = useOutSideClick(onClose);

  if (name !== openName) {
    return null;
  }

  // why using createPortal ?
  // maybe some other developer using our code
  // place this components where the parent element has
  // "overflow: hidden" css property, so it creates conflict
  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={onClose}>X</Button>

        {/* it is necessary for styling ...
            don't ask why :(
         */}
        <div>
          {cloneElement(children, {
            onCloseModal: onClose,
          })}
        </div>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
