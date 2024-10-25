import React from 'react';

export default function LoginPage() {
  return (
    <div className="grid h-screen w-full">
      <div className="bg-custom-gradient animate-gradient
      flex flex-col justify-center p">
        { /* Breakpoints mixed with max-w handle different screen sizes in tailwinds mobile-first design */ }
        <form
          className="w-full mx-auto border-solid border-2 backdrop-blur-3xl py-10 px-6 rounded-xl 
          max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
          action=""
          noValidate
        >

        {/* Welcome Header */}
          <h1 className="text-5xl font-bold text-center py-6">Welcome!</h1>

          {/* Email Input Field */}
          <div className="flex flex-col py-2">
            <input
              type="email"
              required
              className="border-2 rounded-xl p-2 placeholder:italic placeholder:text-slate-800 outline-none border-gray-500 placeholder-gray-500"
              placeholder="Email"

            />
          </div>

          {/* Password Input Field */}
          <div className="flex flex-col py-2">
            <input
              className="border-2 rounded-xl p-2 placeholder:italic placeholder:text-slate-800 outline-none border-gray-500 placeholder-gray-500"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {/* Additional Options */}
          <div className="flex justify-between p-1">
            <p className="flex items-center">
              <input className="mr-2" type="checkbox" /> Remember Me
            </p>
            <a className='hover:underline' href="#">Forgot password?</a>
          </div>

        {/* Submit Button */}
        <button type="submit"
            className="border-none rounded-2xl w-full my-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white">
            Login
          </button>
        
        {/* Register link */}
          <div>
            <p className="text-center">
              Don't have an account? 
              <a className="font-bold hover:underline" href="#"> Register</a>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
