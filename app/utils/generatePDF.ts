import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generatePDF = (project: any, profile: any) => {
  const doc = new jsPDF()
  const primaryColor = [34, 197, 94] 
  const darkColor = [15, 23, 42]

  // --- ENCABEZADO ---
  doc.setFontSize(22)
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('PRESUPUESTO', 14, 20)

  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setLineWidth(1.5)
  doc.line(14, 26, 40, 26)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  const date = new Date(project.created_at).toLocaleDateString('es-CL')
  doc.text(`Fecha: ${date}`, 195, 20, { align: 'right' })
  doc.text(`Ref: #${project.id.slice(0, 8).toUpperCase()}`, 195, 25, { align: 'right' })

  // --- DE: (TUS DATOS) ---
  doc.setFontSize(11)
  doc.setTextColor(60)
  doc.text('De:', 14, 45)

  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.setFont('helvetica', 'bold')
  
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

  // --- PARA: (DATOS DEL CLIENTE) ---
  doc.setFontSize(11)
  doc.setTextColor(60)
  doc.text('Para:', 110, 45)

  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.setFont('helvetica', 'bold')

  // 👇 AQUÍ ESTÁ LA MAGIA: LEEMOS LOS DATOS GUARDADOS DEL CLIENTE
  const clientData = project.details?.client || null

  const clientName = clientData ? clientData.name : 'Cliente Estimado'
  const clientRut = clientData?.rut ? `RUT: ${clientData.rut}` : ''
  const clientEmail = clientData?.email || ''

  doc.text(clientName, 110, 52)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80)
  
  // Si no hay cliente, mostramos el nombre del proyecto como antes
  if (!clientData) {
      doc.text(`Proyecto: ${project.name}`, 110, 57)
  } else {
      let yPos = 57
      if (clientRut) { doc.text(clientRut, 110, yPos); yPos += 5 }
      if (clientEmail) { doc.text(clientEmail, 110, yPos); yPos += 5 }
      // doc.text(`Ref Proyecto: ${project.name}`, 110, yPos + 5)
  }

  // --- TABLA ---
  const details = project.details || {}
  const serviceValue = (details.hours * details.rate) * (1 + (details.margin / 100))
  
  const tableBody = [
    [
        'Servicios Profesionales\n' + (details.hours > 0 ? `(${details.hours} horas estimadas)` : ''), 
        `$${Math.round(serviceValue).toLocaleString('es-CL')}`
    ],
  ]
  if (details.expenses > 0) {
    tableBody.push(['Gastos Operacionales', `$${Number(details.expenses).toLocaleString('es-CL')}`])
  }

  autoTable(doc, {
    startY: 85,
    head: [['Descripción', 'Valor']],
    body: tableBody,
    theme: 'grid',
    headStyles: { 
        fillColor: [15, 23, 42],
        textColor: 255,
        fontStyle: 'bold',
    },
    columnStyles: {
        1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    }
  })

  // --- TOTALES ---
  const finalY = (doc as any).lastAutoTable.finalY + 10
  
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('Subtotal Neto:', 140, finalY)
  doc.text(`$${Math.round(project.pocket_money).toLocaleString('es-CL')}`, 195, finalY, { align: 'right' })

  if (details.include_iva) {
    doc.text('IVA (19%):', 140, finalY + 6)
    doc.text(`$${Math.round(details.iva_amount).toLocaleString('es-CL')}`, 195, finalY + 6, { align: 'right' })
  }

  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(135, finalY + 12, 65, 12, 'F')

  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL A PAGAR', 140, finalY + 20)
  doc.text(`$${Math.round(project.total_price).toLocaleString('es-CL')}`, 195, finalY + 20, { align: 'right' })

  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.setFont('helvetica', 'normal')
  doc.text('Documento generado con PriceCalc', 105, pageHeight - 10, { align: 'center' })

  doc.save(`Presupuesto-${clientName}.pdf`)
}