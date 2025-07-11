import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { Avatar, AvatarImage } from '@/components/ui/Avatar.jsx'
import { getColor, colors } from '@/lib/utils.js';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { useAppStore } from '../../store'
import { Button } from '@/components/ui/button.tsx'
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client.js';

import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGES_ROUTE, UPDATE_PROFILE_ROUTE } from '../../utils/constant.js';

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [image, setImage] = useState("");
  const [hovered, sethovered] = useState(false);
  const [selectedcolor, setselectedcolor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setfirstName(userInfo.firstName || "");
      setlastName(userInfo.lastName || "");
      setselectedcolor(userInfo.color ?? 0);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    } else {
      setImage("");
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is Required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is Required");
      return false;
    }
    return true;
  }

  const saveChange = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedcolor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully");
          navigate('/chat');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please Setup Profile");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
     if (response.status === 200 && response.data.image) {
  setUserInfo({ ...userInfo, ...response.data }); // ✅ merge instead of replacing
  toast.success("Image Updated Successfully");
}

    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGES_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Profile Image Removed Successfully");
        setImage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10'>
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className='text-4xl lg:text-6xl text-white/90 cursor-pointer' />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32  md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => sethovered(true)}
            onMouseLeave={() => sethovered(false)}
          >
            <Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden'>
              {image ? (
                <AvatarImage src={image} alt="profile" className='object-cover w-full h-full bg-black' />
              ) : (
                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full  ${getColor(selectedcolor)}`}>
                  {firstName ? firstName.charAt(0) : userInfo.empid.charAt(0)}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className='absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full'
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className='text-white text-3xl cursor-pointer' />
                ) : (
                  <FaPlus className='text-white text-3xl cursor-pointer' />
                )}
              </div>
            )}
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              onChange={handleImageChange}
              name='profile-image'
              accept='.png, .jpg, .jpeg, .svg, .webp'
            />
          </div>
          <div className='flex min-w-22 md:min-w-64 flex-col gap-5 text-white items-center justify-center'>
            <div className='w-full'>
              <input
                placeholder='Employee Id'
                type="text"
                disabled
                value={userInfo.empid || ""}
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
              />
            </div>
            <div className='w-full'>
              <input
                placeholder='First Name'
                type="text"
                onChange={(e) => setfirstName(e.target.value)}
                value={firstName}
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
              />
            </div>
            <div className='w-full'>
              <input
                placeholder='Last Name'
                type="text"
                onChange={(e) => setlastName(e.target.value)}
                value={lastName}
                className='rounded-lg p-6 bg-[#2c2e3b] border-none'
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                  ${selectedcolor === index ? "outline outline-white/50" : ""}`}
                  key={index}
                  onClick={() => setselectedcolor(index)}
                ></div>
              ))}
            </div>
          </div>
          <div className="w-full">
            <Button
              className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={saveChange}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Profile;
