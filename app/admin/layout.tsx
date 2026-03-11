import AdminAuthGuard from '@/components/admin/AdminAuthGuard'

/**
 * Protecao do admin feita no client para evitar que o server nao veja
 * a sessao na primeira requisicao apos login (cookie ainda nao no request).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>
}
