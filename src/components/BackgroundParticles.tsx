export default function BackgroundParticles() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-float-slow -top-1/3 -left-1/3"></div>
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-float-slower top-1/4 left-3/4"></div>
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-3xl animate-float-slowest top-2/3 left-1/4"></div>
    </div>
  );
}
