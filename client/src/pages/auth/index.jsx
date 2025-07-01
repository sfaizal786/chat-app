import React from 'react';
import { useState} from 'react';
import background from '@/assets/logo.jpg';
import victory from '@/assets/meta.jpg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { Input } from "@/components/ui/input"
import {Button} from'@/components/ui/button.tsx'
import { toast } from 'sonner';
import {  apiClient } from '@/lib/api-client.js';
import { signup_route } from '@/utils/constant.js';
import { login_route } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import {  useAppStore} from '../../store';
function Auth()  {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
 const [empid, setEmpid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassworf] = useState("");
  const validatelogin = () => {
    if(!empid.length){
      toast.error("Employee Id is Required");
      return false;
    }
    if(!password.length){
      toast.error("Password is Required");
      return false;
    }
    return true;
  }
  const validatesignup= ()=>{
    if(!empid.length){
      toast.error("Employee Id is Required");
      return false;
    }
    if(!password.length){
      toast.error("Password is Required");
      return false;
    }
    if(password != confirmpassword){
      toast.error("Password and Confirm Password Should be Same.");
      return false;
    }
    return true;
  }
 const handlelogin = async () => {
  if (validatelogin()) {
    try {
      const response = await apiClient.post(
        login_route,
        { empid, password },
        { withCredentials: true }
      );

      if (response?.data?.user?.id) {
        setUserInfo(response.data.user);
        toast.success("login in successful!");

        if (response.data.user.profileSetup) {
          navigate('/chat');
        } else {
          navigate('/Profile');
        }
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      // If server returns 401 or another error
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please check your Employee ID and password."
      );
    }
  }
};

  const handlesignup = async ()=>{
    if(validatesignup()){
     const  response = await apiClient.post(
      signup_route,
      {empid , password},
      {withCredentials:true}
    );
    if(response.status === 201)
    {
       setUserInfo(response.data.user);
      navigate("/profile");
    }
      
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
    <div className='h-[80vh] bg-white broder-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vm] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
    <div className='flex flex-col gap-10 items-center justify-center '>
<div className='flex items-center justify-center flex-col '>
  <div className='flex items-center justify-center'>
    <h1 className='text-5xl font-bold md:text-6xl ml-1'>
Welcome
    </h1>
<img src={victory} alt="logo
" className='h-[8vh]' />
  </div>
<p className='font-medium text-center'>Enter Your Details on Meta-Insyt Private Chat Application!</p>
</div>
<div className="flex items-center justify-center w-full">
<Tabs className='w-3/4' defaultValue="login">
  <TabsList className='bg-transparent rounded-none w-full'>
    <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90
 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>
  <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90
 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Sign Up</TabsTrigger></TabsList>
  <TabsContent className=" flex flex-col gap-5" value='login'>
    <Input
    placeholder="Employee Id" 
    type='text' 
    className='rounded-full p-6'
     value={empid} 
     onChange={e=>setEmpid(e.target.value)}
/>
   <Input
    placeholder="Password" 
    type='password' 
    className='rounded-full p-6'
     value={password}
     onChange={e=>setPassword(e.target.value)}
/>
<Button className='rounded-full p-6' onClick={handlelogin}>Login </Button>
  </TabsContent>
  <TabsContent className=" flex flex-col gap-5 " value='signup'>
    <Input
    placeholder="Employee Id" 
    type='text' 
    className='rounded-full p-6'
     value={empid} 
     onChange={e=>setEmpid(e.target.value)}
/>
   <Input
    placeholder="Password" 
    type='password' 
    className='rounded-full p-6'
     value={password}
     onChange={e=>setPassword(e.target.value)}
/>
<Input
    placeholder="confirm Password" 
    type='password' 
    className='rounded-full p-6'
     value={confirmpassword}
     onChange={e=>setconfirmPassworf(e.target.value)}
/>
<Button className='rounded-full p-6' onClick={handlesignup}>Sign up</Button>
  </TabsContent>
</Tabs>
    </div>
    </div>
     <div className='hidden xl:flex justify-center items-center'>
    <img src={background} alt="background" className='h-[150px]' />
    </div>
    </div>
    </div>
  )
}

export default Auth