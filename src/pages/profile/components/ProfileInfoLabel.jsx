/* eslint-disable react/prop-types */
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { Button, Modal } from "rsuite";
import {
  updateEmailOfUser,
  updatePassOfUser,
  updateUserInfo,
} from "../../../app/firebase/userMange";

function ProfileInfoLabel({ title, value, property }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valueToEdit, setValueToEdit] = useState(value);
  const intialValue = value;
  const updateInfo = async () => {
    let response;
    if (property === "email") {
      response = await updateEmailOfUser(valueToEdit);
    } else if (property === "password") {

      response = await updatePassOfUser(valueToEdit);
    } else {
      response = await updateUserInfo(property, valueToEdit);
    }
  
    if (response === "true") {
      handleClose();
    }
  };

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
            value={valueToEdit}
            onChange={(e) => setValueToEdit(e.target.value)}
            className=" bg-gray-400 px-2 py-1 mb-2  outline-none  border focus:border-black  rounded-md flex justify-between item-center flex-grow text-ellipsis  "
          />
          {(property === "email" || property === "password") && (
            <span className=" text-gray-400">
              To update your {property} you must be signed in recently. For
              security reasons.
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={intialValue === valueToEdit}
            onClick={updateInfo}
            appearance="primary"
          >
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

