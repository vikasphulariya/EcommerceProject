/* eslint-disable react/prop-types */
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { Button, Input, Modal, Placeholder } from "rsuite";

function ProfileInfoLabel({ title, value, property }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <h1 className="text-lg font-semibold text-gray-600">{title}</h1>
      <div className="bg-gray-400 px-2 py-1 text-ellipsis  rounded-md flex justify-between item-center ">
        <span className=" text-ellipsis  ">{value}</span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="hover:text-blue-500"
        >
          <BiEdit />
        </button>
      </div>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Update {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1 className="text-lg font-semibold text-gray-600">{title}</h1>

          <input
            value={value}
            className=" bg-gray-400 px-2 py-1  outline-none  border focus:border-black  rounded-md flex justify-between item-center flex-grow text-ellipsis  "
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Update
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfileInfoLabel;

