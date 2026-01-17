'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
// 1. IMPORTAMOS TOAST
import toast from 'react-hot-toast'

export default function ClientsPage() {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Formulario nuevo cliente
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    email: '',
    phone: ''
  })

  // 1. Cargar Clientes
  const loadClients = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    
    if (data) setClients(data)
    setLoading(false)
  }

  useEffect(() => {
    loadClients()
  }, [])

  // 2. Guardar Cliente (Con Toast)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('clients').insert({
      user_id: user.id,
      ...formData
    })

    if (!error) {
      setFormData({ name: '', rut: '', email: '', phone: '' })
      setShowForm(false)
      loadClients()
      toast.success('Cliente agregado correctamente') // 🟢 ÉXITO
    } else {
      toast.error('Error al guardar cliente') // 🔴 ERROR
    }
    setSaving(false)
  }

  // 3. Borrar Cliente (Con Toast Interactivo "Jefe Final")
  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium text-white">¿Eliminar este cliente?</span>
        <span className="text-xs text-zinc-400">Esta acción no se puede deshacer.</span>
        <div className="flex gap-2 mt-2">
          
          {/* Botón SÍ (Borrar) */}
          <button
            onClick={async () => {
              toast.dismiss(t.id) // Cerrar la pregunta
              
              const { error } = await supabase.from('clients').delete().eq('id', id)
              
              if (!error) {
                setClients(prev => prev.filter(c => c.id !== id))
                toast.success('Cliente eliminado')
              } else {
                toast.error('No se pudo eliminar')
              }
            }}
            className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-600 transition"
          >
            Sí, eliminar
          </button>

          {/* Botón NO (Cancelar) */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-zinc-700 text-white px-3 py-1.5 rounded text-xs hover:bg-zinc-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 5000, // Tiempo para decidir
      style: {
        background: '#18181b', // Fondo oscuro
        color: '#fff',
        border: '1px solid #27272a',
        minWidth: '280px'
      }
    })
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 pt-32 relative overflow-hidden">
      
      {/* Luces de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-1">Mis Clientes</h1>
            <p className="text-zinc-400">Gestiona tu agenda para cotizar más rápido.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95 flex items-center gap-2"
          >
            {showForm ? 'Cancelar' : '＋ Nuevo Cliente'}
          </button>
        </div>

        {/* Formulario Desplegable */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-700 p-6 rounded-2xl space-y-4 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-bold text-white mb-2">Datos del Cliente</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input 
                placeholder="Nombre / Razón Social *" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-black border border-zinc-700 p-3 rounded-lg text-white w-full focus:border-green-500 outline-none placeholder:text-zinc-600"
              />
              <input 
                placeholder="RUT (Opcional)" 
                value={formData.rut}
                onChange={e => setFormData({...formData, rut: e.target.value})}
                className="bg-black border border-zinc-700 p-3 rounded-lg text-white w-full focus:border-green-500 outline-none placeholder:text-zinc-600"
              />
              <input 
                placeholder="Email Contacto" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-black border border-zinc-700 p-3 rounded-lg text-white w-full focus:border-green-500 outline-none placeholder:text-zinc-600"
              />
              <input 
                placeholder="Teléfono" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="bg-black border border-zinc-700 p-3 rounded-lg text-white w-full focus:border-green-500 outline-none placeholder:text-zinc-600"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-white hover:bg-zinc-200 text-black px-8 py-2.5 rounded-xl font-bold transition disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cliente'}
              </button>
            </div>
          </form>
        )}

        {/* Lista de Clientes */}
        {loading ? (
          <div className="space-y-4">
             <div className="h-24 bg-zinc-900 rounded-xl animate-pulse"></div>
             <div className="h-24 bg-zinc-900 rounded-xl animate-pulse delay-75"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-3xl">📇</div>
            <div>
                <p className="text-zinc-300 font-medium text-lg">Tu agenda está vacía</p>
                <p className="text-zinc-500 text-sm">Agrega tu primer cliente para usarlo en la calculadora.</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 pb-24">
            {clients.map(client => (
              <div key={client.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-green-500/50 hover:bg-zinc-900 transition-all group relative">
                {/* Botón Eliminar (ahora llama a handleDelete con toast) */}
                <button 
                  onClick={() => handleDelete(client.id)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-500/10 rounded-lg"
                  title="Eliminar cliente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                
                <h3 className="font-bold text-xl text-white mb-3">{client.name}</h3>
                
                <div className="space-y-2 text-sm text-zinc-400">
                  {client.rut && (
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600">🆔</span> {client.rut}
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600">📧</span> {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600">📞</span> {client.phone}
                    </div>
                  )}
                  {!client.rut && !client.email && !client.phone && (
                      <span className="text-zinc-600 italic">Sin datos de contacto adicionales</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}