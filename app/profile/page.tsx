'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
// ❌ Borramos el import de Navbar aquí porque ya está en el Layout global

export default function ProfilePage() {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    rut: '',
    profession: '',
    phone: '',
    email: ''
  })

  // Cargar datos
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login' // Redirigir si no hay usuario
        return
      }
      setUserId(session.user.id)
      setFormData(prev => ({ ...prev, email: session.user.email || '' }))

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setFormData(prev => ({
          ...prev,
          full_name: profile.full_name || '',
          rut: profile.rut || '',
          profession: profile.profession || '',
          phone: profile.phone || '',
        }))
      }
      setLoading(false)
    }
    loadProfile()
  }, [supabase])

  // Guardar datos
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: formData.full_name,
        rut: formData.rut,
        profession: formData.profession,
        phone: formData.phone,
      })
      .eq('id', userId)

    if (!error) {
      alert('✅ Perfil actualizado correctamente')
    } else {
      alert('Error al guardar')
    }
    setSaving(false)
  }

  return (
    // ❌ Quitamos <Navbar /> de aquí
    <main className="min-h-screen bg-black px-6 py-12 flex justify-center pt-24"> 
      {/* Agregamos pt-24 para que no se pegue al navbar fijo de arriba */}
      <div className="w-full max-w-2xl">
        
        <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil Profesional</h1>
        <p className="text-zinc-400 mb-8">Estos datos aparecerán automáticamente en tus presupuestos PDF.</p>

        <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-xl">
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Nombre o Razón Social</label>
              <input 
                type="text" 
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none transition-colors"
                placeholder="Ej: Juan Pérez Diseño"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Profesión / Rubro</label>
              <input 
                type="text" 
                value={formData.profession}
                onChange={e => setFormData({...formData, profession: e.target.value})}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none transition-colors"
                placeholder="Ej: Consultor Marketing"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">RUT / ID Fiscal</label>
              <input 
                type="text" 
                value={formData.rut}
                onChange={e => setFormData({...formData, rut: e.target.value})}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none transition-colors"
                placeholder="Ej: 12.345.678-9"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Teléfono (Para el PDF)</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none transition-colors"
                placeholder="+56 9 ..."
              />
            </div>
          </div>

          <div className="space-y-2 opacity-50">
            <label className="text-sm font-medium text-zinc-300">Email (De tu cuenta)</label>
            <input 
              type="text" 
              value={formData.email}
              disabled
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-zinc-500 cursor-not-allowed"
            />
          </div>

          <hr className="border-zinc-800 my-4"/>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Datos del Perfil'}
          </button>

        </form>
      </div>
    </main>
  )
}