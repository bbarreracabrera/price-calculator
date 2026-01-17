import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generatePDF = (project: any, profile: any) => {
  const doc = new jsPDF()
  
  // Encabezado simple
  doc.setFontSize(20)
  doc.text('Cotización de Proyecto', 14, 22)
  doc.setFontSize(10)
  doc.text(profile?.company_name || 'Freelance', 14, 28)

  const rows = [
    ['Concepto', 'Monto'],
    ['Costo del Servicio', `$${project.pocket_money.toLocaleString('es-CL')}`],
  ]

  if (project.details?.include_iva) {
    rows.push(['IVA (19%)', `$${project.details.iva_amount.toLocaleString('es-CL')}`])
  }
  if (project.details?.include_retention) {
    rows.push(['Retención (13.75%)', `$${project.details.retention_amount.toLocaleString('es-CL')}`])
  }

  // Total Final
  rows.push(['TOTAL A COBRAR', `$${Number(project.total_price).toLocaleString('es-CL')}`])

  autoTable(doc, {
    startY: 35,
    head: [['Descripción', 'Valor']],
    body: rows,
  })

  doc.save(`Presupuesto_${project.name}.pdf`)
}