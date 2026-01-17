import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generatePDF = (project: any, profile: any) => {
  const doc = new jsPDF()

  // Colores
  const primaryColor = [34, 197, 94] // Verde PriceCalc
  const darkColor = [15, 23, 42]     // Slate 950

  // --- ENCABEZADO SUPERIOR ---
  // Título
  doc.setFontSize(22)
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('PRESUPUESTO', 14, 20)

  // Línea verde de acento
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setLineWidth(1.5)
  doc.line(14, 26, 40, 26) // Línea corta decorativa

  // Datos de Referencia (Derecha)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  const date = new Date(project.created_at).toLocaleDateString('es-CL')
  doc.text(`Fecha: ${date}`, 195, 20, { align: 'right' })
  doc.text(`Ref: #${project.id.slice(0, 8).toUpperCase()}`, 195, 25, { align: 'right' })

  // --- BLOQUE PROVEEDOR (Tus datos) ---
  doc.setFontSize(11)
  doc.setTextColor(60)
  doc.text('De:', 14, 45)

  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.setFont('helvetica', 'bold')
  
  // Usamos los datos del perfil o valores por defecto
  const myName = profile?.full_name || 'Freelancer Profesional'
  const myProfession = profile?.profession || 'Servicios Profesionales'
  const myRut = profile?.rut ? `RUT: ${profile.rut}` : ''
  const myEmail = profile?.email || ''
  const myPhone = profile?.phone || ''

  doc.text(myName, 14, 52)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80)
  doc.text(myProfession, 14, 57)
  if (myRut) doc.text(myRut, 14, 62)
  doc.text(myEmail, 14, 67)
  if (myPhone) doc.text(myPhone, 14, 72)

  // --- BLOQUE CLIENTE (Genérico) ---
  // Aquí en el futuro podrías poner los datos reales del cliente si los pides en la calculadora
  doc.setFontSize(11)
  doc.setTextColor(60)
  doc.text('Para:', 110, 45)

  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.setFont('helvetica', 'bold')
  doc.text('Cliente Estimado', 110, 52)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80)
  doc.text(`Proyecto: ${project.name}`, 110, 57)

  // --- TABLA DE DETALLES ---
  const details = project.details || {}
  
  // Cálculo del ítem principal
  // Nota: Mostramos el valor cobrado (costo + margen), no revelamos el margen interno.
  const serviceValue = (details.hours * details.rate) * (1 + (details.margin / 100))
  
  const tableBody = [
    [
        'Servicios Profesionales\n' + (details.hours > 0 ? `(${details.hours} horas estimadas)` : ''), 
        `$${Math.round(serviceValue).toLocaleString('es-CL')}`
    ],
  ]

  if (details.expenses > 0) {
    tableBody.push([
        'Gastos Operacionales / Insumos', 
        `$${Number(details.expenses).toLocaleString('es-CL')}`
    ])
  }

  autoTable(doc, {
    startY: 85,
    head: [['Descripción del Servicio', 'Valor']],
    body: tableBody,
    theme: 'grid', // Tema limpio
    headStyles: { 
        fillColor: [15, 23, 42], // Fondo oscuro
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left'
    },
    columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    },
    styles: {
        cellPadding: 6,
        fontSize: 10
    }
  })

  // --- TOTALES ---
  const finalY = (doc as any).lastAutoTable.finalY + 10
  
  // Subtotal
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('Subtotal Neto:', 140, finalY)
  doc.text(`$${Math.round(project.pocket_money).toLocaleString('es-CL')}`, 195, finalY, { align: 'right' })

  // IVA
  if (details.include_iva) {
    doc.text('IVA (19%):', 140, finalY + 6)
    doc.text(`$${Math.round(details.iva_amount).toLocaleString('es-CL')}`, 195, finalY + 6, { align: 'right' })
  }

  // TOTAL FINAL (Caja Verde)
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(135, finalY + 12, 65, 12, 'F') // Caja de fondo

  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255) // Texto blanco
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL A PAGAR', 140, finalY + 20)
  doc.text(`$${Math.round(project.total_price).toLocaleString('es-CL')}`, 195, finalY + 20, { align: 'right' })

  // --- PIE DE PÁGINA ---
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.setFont('helvetica', 'normal')
  doc.text('Este documento es un presupuesto estimativo, no es un documento tributario.', 105, pageHeight - 15, { align: 'center' })
  doc.text('Generado con PriceCalc', 105, pageHeight - 10, { align: 'center' })

  // Guardar
  doc.save(`Presupuesto-${project.name.replace(/\s+/g, '_')}.pdf`)
}