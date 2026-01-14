

import React, { useEffect } from "react";
import Hello from '/assets/wave.png'
import Mock_details_image from '/assets/mock_details_background.png'
import { useProjectConfigStore } from "@/stores/useProjectConfigStore";

function mock_details() {
  const { config, isLoading, error, fetchConfig } = useProjectConfigStore()

  useEffect(() => {
    if (!config) {
      fetchConfig();
    }
  }, [config, fetchConfig]);
  return (
    <div
      className="relative top-0 left-0 flex items-center justify-center text-white w-full h-screen lg:h-full lg:block bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-slate-900 overflow-hidden"
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circle - Top Right */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        {/* Medium Circle - Bottom Left */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        {/* Small Circle - Center Right */}
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-violet-400/15 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Blended Foreground Image */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <img
          src={Mock_details_image}
          className="object-cover w-full h-full"
          alt="Blended Background"
        />
      </div>

      {/* Decorative Chat Bubbles - Floating Animation */}
      <div className="absolute top-20 right-16 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm transform rotate-12 animate-bounce delay-300"></div>
      <div className="absolute top-40 right-32 w-12 h-12 bg-white/15 rounded-xl backdrop-blur-sm transform -rotate-12 animate-bounce delay-700"></div>
      <div className="absolute bottom-32 left-20 w-14 h-14 bg-blue-300/20 rounded-2xl backdrop-blur-sm transform rotate-6 animate-bounce delay-1000"></div>
      <div className="absolute bottom-48 left-40 w-10 h-10 bg-violet-300/20 rounded-xl backdrop-blur-sm transform -rotate-6 animate-bounce delay-500"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Decorative Elements */}
      {/* <div className="absolute bottom-0">
        <img 
          src={IMAGES.ui.icons.google} // Replace with your curves image path in config
          className="2xl:w-[800px] 2xl:h-[800px] xl:w-[600px] xl:h-[600px]" 
          alt="Decorative curves"
        />
      </div> */}

      {/* Top Right Decor */}
      {/* <div className="absolute top-28 right-[-80px]">
        <img 
          src={IMAGES.ui.icons.github} // Replace with your top right image path
          className="w-56 h-56" 
          alt="Top right decoration"
        />
      </div> */}

      {/* Decorative Stars */}
      {/* <div className="absolute 2xl:top-72 2xl:left-20 lg:left-10 lg:bottom-96">
        <img 
          src={IMAGES.ui.icons.microsoft} // Replace with your star1 image path
          className="w-28 h-28" 
          alt="Decorative star 1"
        />
      </div>

      <div className="absolute 2xl:top-[350px] 2xl:right-[456px] lg:right-[200px] lg:bottom-[350px] xl:right-[250px]">
        <img 
          src={IMAGES.ui.avatar.default} // Replace with your star2 image path
          className="w-20 h-20" 
          alt="Decorative star 2"
        />
      </div> */}

      {/* <div className="absolute 2xl:bottom-[350px] 2xl:right-48 lg:right-20 lg:bottom-[250px]">
        <img 
          src={IMAGES.ui.avatar.placeholder} // Replace with your star3 image path
          className="w-16 h-16" 
          alt="Decorative star 3"
        />
      </div>  */}

      {/* Main Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 lg:px-12">
        {/* Icon/Logo Section */}
        <div className="mb-8 lg:mb-12">
          <div className="relative">
            {/* Large Chat Bubble Icon */}
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 lg:w-16 lg:h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            {/* Small accent bubble */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 bg-violet-400/80 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center lg:text-left max-w-lg">
          <div className="flex gap-3 place-items-center justify-center lg:justify-start mb-6">
            <h1 className="font-bold text-5xl lg:text-6xl xl:text-7xl font-poppins text-white drop-shadow-2xl">
              Hello
            </h1>
            <img src={Hello} alt="hello" className="w-10 h-10 lg:w-12 lg:h-12 animate-bounce" />
          </div>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-lg">
              Welcome to ConvoX
            </h2>
            <div className="space-y-2 text-white/90">
              <p className="text-lg lg:text-xl font-medium">
                Your powerful chat and messaging platform
              </p>
              <p className="text-base lg:text-lg text-white/80">
                for seamless communication and collaboration
              </p>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20">
              💬 Real-time Chat
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20">
              🔒 Secure & Private
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20">
              ⚡ Fast & Reliable
            </div>
          </div>
        </div>
      </div>


      {/* Footer Copyright */}
      <div className="absolute bottom-8 w-full text-center left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-white/70 text-sm font-medium">
          © {new Date().getFullYear()} ConvoX. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default mock_details;
