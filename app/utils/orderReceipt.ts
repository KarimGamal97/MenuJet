export function cleanOrderSize(size?: string): string {
  if (!size) return ''
  return size.replace(/\s*قطعة/g, '').trim()
}

export function printOrderReceipt(
  orderData: Record<string, any>,
  orderTypeLabel: string,
  paymentLabel?: string | null
) {
  const orderNumber = formatOrderNumber(orderData.order_number || orderData.id)
  const orderTime = new Date(orderData.created_at).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const printWindow = window.open('', '_blank', 'width=400,height=600')
  if (!printWindow) return

  const itemsHtml = (orderData.items || [])
    .map(
      (item: any) => `
    <div style="border-bottom: 1px dashed #eee; padding: 8px 0;">
      <div style="display: flex; justify-content: space-between; font-weight: bold;">
        <span>${item.quantity}x ${item.name} ${item.size ? `(${cleanOrderSize(item.size)})` : ''}</span>
        <span>${(item.basePrice || item.price) * item.quantity} جنيه</span>
      </div>
      ${
        item.selectedExtras?.length
          ? `<div style="font-size: 11px; color: #666; margin-top: 2px;">${item.selectedExtras.map((ex: any) => `+ ${ex.name}`).join(', ')}</div>`
          : ''
      }
      ${
        item.notes
          ? `<div style="font-size: 11px; color: #e67e22; background: #fffcf0; padding: 2px 5px; margin-top: 4px; border-radius: 4px;">ملاحظة: ${item.notes}</div>`
          : ''
      }
    </div>
  `
    )
    .join('')

  const html = `
    <html dir="rtl">
    <head>
      <title>طلب #${orderNumber}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; line-height: 1.4; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 15px; }
        .order-id { font-size: 24px; font-weight: 900; margin: 5px 0; }
        .info { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-bottom: 5px; }
        .total { margin-top: 15px; padding-top: 10px; border-top: 2px solid #333; font-size: 20px; font-weight: 900; display: flex; justify-content: space-between; }
        .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #999; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="font-size: 14px; font-weight: bold; color: #e67e22;">MenuJet</div>
        <div class="order-id">رقم الطلب #${orderNumber}</div>
        <div style="font-size: 13px; font-weight: bold; margin: 4px 0; color: #555;">
          نوع الطلب: ${orderTypeLabel} ${paymentLabel ? `(${paymentLabel})` : ''}
        </div>
        <div class="info">
          <span>الوقت: ${orderTime}</span>
          ${orderData.customer_phone ? `<span>الهاتف: ${orderData.customer_phone}</span>` : ''}
        </div>
        ${orderData.customer_name ? `<div style="font-size: 13px; margin-top: 3px;">العميل: ${orderData.customer_name}</div>` : ''}
        ${orderData.delivery_address ? `<div style="font-size: 13px; margin-top: 3px; font-weight: bold;">العنوان: ${orderData.delivery_address}</div>` : ''}
        ${orderData.table_number ? `<div style="font-weight: bold; margin-top: 5px;">طاولة رقم: ${orderData.table_number}</div>` : ''}
      </div>
      <div class="items">${itemsHtml}</div>
      <div class="total">
        <span>الإجمالي:</span>
        <span>${orderData.total_price} جنيه</span>
      </div>
      <div class="footer">طُبع بواسطة MenuJet</div>
      <script>window.onload = () => { window.print(); };<\/script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}
