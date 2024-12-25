// Components
import { Modal } from "../Modal";
import { Loader } from "../../../Loader";
import { ProgressBar } from "../../../ProgressBar";

export const ModalProgress = () => {
  return (
    <Modal>
      <Loader />
      <ProgressBar />
    </Modal>
  );
};
