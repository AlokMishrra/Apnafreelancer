import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Home, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StreamingAvatar() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const openInNewWindow = () => {
    // Create a new window with custom HTML that embeds the avatar cleanly
    const windowFeatures = 'width=1400,height=900,scrollbars=no,resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no';
    const newWindow = window.open('', 'ApnaFreelancerAvatar', windowFeatures);
    
    if (newWindow) {
      // Custom HTML with only avatar interface - no extra headers
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ApnaFreelancer Learning Avatar</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #000;
              overflow: hidden;
            }
            .avatar-container {
              height: 100vh;
              width: 100%;
              position: relative;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
            .loading {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              text-align: center;
              z-index: 10;
              background: rgba(0, 0, 0, 0.8);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            .logo {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #3B82F6, #8B5CF6);
              border-radius: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              margin: 0 auto 20px;
              animation: float 2s ease-in-out infinite;
            }
            .spinner {
              width: 40px;
              height: 40px;
              border: 4px solid rgba(255, 255, 255, 0.3);
              border-top: 4px solid white;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            .title {
              color: white;
              font-weight: 600;
              font-size: 20px;
              margin-bottom: 10px;
            }
            .subtitle {
              color: rgba(255, 255, 255, 0.7);
              font-size: 14px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            /* Hide Akool header and unnecessary UI */
            iframe {
              margin-top: -60px;
              height: calc(100% + 60px);
            }
          </style>
        </head>
        <body>
          <div class="avatar-container">
            <div class="loading" id="loading">
              <div class="logo">🤖</div>
              <div class="title">ApnaFreelancer</div>
              <div class="subtitle">Learning Avatar</div>
              <div class="spinner"></div>
              <p style="color: rgba(255, 255, 255, 0.8);">Connecting to AI Avatar...</p>
            </div>
            <iframe 
              src="https://akool.com/apps/streaming-avatar/share/zrbR0Bg4p3"
              onload="setTimeout(() => document.getElementById('loading').style.display='none', 2000)"
              allow="camera; microphone; fullscreen; autoplay"
              scrolling="no"
            ></iframe>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };  // Set a timeout to detect if iframe doesn't load properly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-700/30' 
          : 'bg-white/80 border-blue-200/40'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`backdrop-blur-sm rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'text-white hover:bg-white/10'
                      : 'text-slate-700 hover:bg-blue-100/60'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300/50"></div>
              <h1 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                🎥 ApnaFreelancer AI Avatar
              </h1>
            </div>

            {/* Right side - Logo */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                }`}>
                  ApnaFreelancer
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-80px)]">
        {/* Advanced ApnaFreelancer Loading Screen */}
        {(isLoading || hasError) && (
          <div className={`absolute inset-0 flex items-center justify-center z-10 ${
            isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
          }`}>
            <div className="text-center max-w-2xl mx-auto p-8">
              {/* ApnaFreelancer Logo Animation */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 animate-pulse">
                    <div className="text-4xl">🤖</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
                </div>
                
                <h1 className={`text-4xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                }`}>
                  ApnaFreelancer
                </h1>
                
                <p className={`text-xl font-medium ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-600'
                }`}>
                  Learning Avatar
                </p>
              </div>

              {/* Loading Content */}
              {isLoading && !hasError && (
                <>
                  <div className="space-y-4 mb-8">
                    <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto ${
                      isDarkMode ? 'border-white/30' : 'border-blue-500/30'
                    } border-t-blue-500`}></div>
                    
                    <p className={`text-lg font-medium ${
                      isDarkMode ? 'text-white' : 'text-slate-700'
                    }`}>
                      Initializing AI Learning Experience...
                    </p>
                    
                    <div className="space-y-2">
                      <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>
                        ✨ Loading interactive avatar interface
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>
                        🎤 Preparing camera and microphone access
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>
                        💬 Setting up real-time conversation
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Error Content - Clean Launch Button */}
              {hasError && (
                <>
                  <div className="mb-8">
                    <p className={`text-lg mb-4 ${
                      isDarkMode ? 'text-white/90' : 'text-slate-700'
                    }`}>
                      Ready for Enhanced AI Interaction
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-white/70' : 'text-slate-500'
                    }`}>
                      Your AI Avatar experience is optimized for a dedicated window with full access to camera and microphone features.
                    </p>
                  </div>
                  
                  <Button
                    onClick={openInNewWindow}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 px-10 py-4 text-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
                  >
                    <ExternalLink className="w-6 h-6 mr-3" />
                    Launch AI Avatar Experience
                  </Button>
                  
                  <div className={`text-xs mt-6 space-y-1 ${
                    isDarkMode ? 'text-white/60' : 'text-slate-400'
                  }`}>
                    <p>🚀 No registration required</p>
                    <p>⚡ Instant access • Real-time interaction</p>
                    <p>🔒 Secure • Private • Professional</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Streaming Avatar Iframe */}
        {!hasError && (
          <div className="w-full h-full">
            <iframe
              src="https://akool.com/apps/streaming-avatar/edit?avatar_id=dvp_Alinna_realisticbg_20241224&auto_open_camera=true&hide_header=true&hide_sidebar=true&minimal_ui=true"
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-modals allow-top-navigation-by-user-activation allow-downloads"
              title="ApnaFreelancer AI Avatar - Interactive Learning"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={`absolute bottom-4 left-4 right-4 pointer-events-none ${
        isLoading ? 'hidden' : 'block'
      }`}>
        <div className={`text-xs text-center backdrop-blur-sm rounded-lg px-3 py-2 max-w-md mx-auto ${
          isDarkMode 
            ? 'bg-slate-900/70 text-white/70 border border-slate-700/30' 
            : 'bg-white/70 text-slate-500 border border-blue-200/40'
        }`}>
          <p>🤖 ApnaFreelancer AI Avatar • Interactive Learning Experience</p>
        </div>
      </div>
    </div>
  );
}