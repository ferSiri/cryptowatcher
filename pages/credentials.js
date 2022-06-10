import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUp } from 'next-auth-sanity/client';
import userSchema from '../validations/userSchema';
import TextInput from '../components/TextInput';

const Credentials = () => {
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);
  const [ verificationError, setVerificationError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      password: "",
      email:""
    },
    resolver: yupResolver(userSchema),
    context: { showSignUp },
    mode: 'onSubmit'
  });

  const submit = async (data) => {
    const { password, email, name } = data;
    const user = await signUp({
      email,
      password,
      name
    });

    await signIn('sanity-login', {
      redirect: false,
      password,
      email
    }).then(res=> router.push('/'));
  };

  const submitSignIn = async (data) => {
    const { password, email, name } = data;
    await signIn('sanity-login', {
      redirect: false,
      email,
      password
    }).then(res=>res.error ? setVerificationError(res.error) : router.push('/'));
  };
  
  const passwordVerificationError = verificationError === "Password Invalid" && verificationError;
  const emailVerificationError = verificationError === "Email does not exist" && verificationError;
  
  return (
    <div className="bg-gradient-to-r from-pink-800 to-indigo-900 flex justify-center items-center w-full h-full">       
      <div className='flex flex-col p-5 w-96 items-center justify-between bg-white shadow h-96 rounded'>
        <form className='flex flex-col w-96 items-center justify-between' onSubmit={handleSubmit(showSignUp ? submit : submitSignIn)}>
          <h1 className="mb-5 font-bold text-xl">{showSignUp ? "Sign Up" : "Login"}</h1>
          <div className='flex flex-col items-center'>
            {showSignUp && <TextInput placeholder='Name' type="text" {...register("name")} />}
            {showSignUp &&<div className="h-6 text-sm text-red-600">{errors.name?.message}</div>}
            <TextInput placeholder='Example@email.com' type="text" {...register("email", { required: true })} />
            <div className="h-6 text-sm text-red-600">{errors.email?.message || emailVerificationError}</div>
            <TextInput placeholder='Password' type="password" {...register("password", { required: true })} />
            <div className="h-6 text-sm text-red-600">{errors.password?.message || passwordVerificationError}</div>
            <input className="bg-pink-600 rounded h-8 w-20 text-white font-semibold cursor-pointer" type="submit" value={showSignUp ? "Sign Up" : "Login"}/>
          </div>
        </form>
        <button onClick={()=>setShowSignUp(prev=>!prev)} className="text-xs font-semibold cursor-pointer align-bottom mt-12">{!showSignUp ? "Sign Up" : "Login"}</button>
      </div>
    </div>
  );
};

export default Credentials;