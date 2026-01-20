// Layout para página de login - não usa o layout do admin
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cyber-dark">
      {children}
    </div>
  )
}

