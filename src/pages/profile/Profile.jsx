import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useSelector } from "react-redux";
import ProfileInfoLabel from "./components/ProfileInfoLabel";
import { Button, Modal, Placeholder } from "rsuite";
import { auth } from "../../app/firebase/firebase";
function Profile() {
  const currentEmail = auth.currentUser.email;
  const user = useSelector((state) => state.user.user);
  return (
    <div className=" h-screen gap-3 items-center flex flex-col">
      <h1 style={{ fontSize: "clamp(1.25rem,3vw,3rem)" }}>Profile</h1>
      <div className="profile pic overflow-hidden rounded-full p-1 border-2 w-20 h-20 ">
        {user.profileUrl ? (
          <img src={user.profileUrl} />
        ) : (
          <div
            className="bg-red-400 w-full h-full rounded-full grid place-items-center"
            style={{ fontSize: "clamp(1.5rem,3vw,3.25rem)" }}
          >
            {user.name[0]}{" "}
          </div>
        )}
      </div>
      <div className="user-info  max-w-3xl grid-cols-1 sm:grid-cols-2  justify-between  gap-2 grid w-full  ">
        <ProfileInfoLabel title={"Name"} value={user.name} property={"name"} />
        <ProfileInfoLabel
          title={"Email"}
          value={user.email}
          property={"email"}
        />
        <ProfileInfoLabel
          title={"Mobile"}
          value={user.mobile}
          property={"mobile"}
        />
        <ProfileInfoLabel
          title={"Password"}
          value={"**********"}
          property={"password"}
        />
        <ProfileInfoLabel
          title={"Address"}
          value={!user.address ? "NA" : user.address}
          property={"address"}
        />
      </div>
    </div>
  );
}

export default Profile;

