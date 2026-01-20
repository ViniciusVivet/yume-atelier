'use client'

import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { Category } from '@/lib/types'

type CategoriesContextValue = {
  categories: Category[]
  setCategories: (categories: Category[]) => void
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined)

export function CategoriesProvider({
  children,
  initialCategories,
}: {
  children: ReactNode
  initialCategories: Category[]
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories || [])

  const value = useMemo(
    () => ({
      categories,
      setCategories,
    }),
    [categories]
  )

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}

export function useCategories() {
  const ctx = useContext(CategoriesContext)
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider')
  return ctx
}


