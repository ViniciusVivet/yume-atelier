export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyber-border border-t-cyber-glow rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyber-glowAlt rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <h1 className="text-2xl font-display font-bold text-cyber-glow animate-pulse">
          YUME Atelier
        </h1>
      </div>
    </div>
  )
}

