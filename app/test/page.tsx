export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-display font-bold text-cyber-glow animate-pulse">
          YUME Atelier
        </h1>
        <p className="text-cyber-text text-xl">
          Página de teste funcionando!
        </p>
        <div className="mt-8 space-y-2">
          <div className="w-64 h-64 mx-auto bg-cyber-light/30 border border-cyber-border rounded-lg flex items-center justify-center">
            <span className="text-cyber-textDim">Card de teste</span>
          </div>
        </div>
      </div>
    </div>
  )
}

