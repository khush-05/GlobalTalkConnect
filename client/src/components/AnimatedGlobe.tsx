export default function AnimatedGlobe() {
  return (
    <div className="relative">
      <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-2xl float-animation relative overflow-hidden">
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 spin-slow">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
          {/* Continents/Landmasses */}
          <div className="absolute top-8 left-12 w-16 h-12 bg-green-400 rounded-full opacity-80"></div>
          <div className="absolute top-20 right-8 w-12 h-16 bg-green-400 rounded-full opacity-80"></div>
          <div className="absolute bottom-16 left-8 w-20 h-8 bg-green-400 rounded-full opacity-80"></div>
          <div className="absolute bottom-8 right-12 w-14 h-10 bg-green-400 rounded-full opacity-80"></div>
        </div>
        {/* Floating Connection Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
      </div>
      {/* Orbital Rings */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30 spin-slow" style={{ animationDuration: "30s" }}></div>
      <div className="absolute inset-8 rounded-full border border-white/20 spin-slow" style={{ animationDuration: "25s", animationDirection: "reverse" }}></div>
    </div>
  );
}
