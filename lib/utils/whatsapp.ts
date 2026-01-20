/**
 * WhatsApp Utility Functions
 * Generate WhatsApp links with pre-filled messages
 */

export function generateWhatsAppLink(
  phoneNumber: string,
  productName: string,
  messageTemplate: string = 'Salve! Tenho interesse na peça {PRODUCT_NAME} do YUME Atelier.'
): string {
  // Remove any non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  
  // Replace template variables
  const message = messageTemplate.replace('{PRODUCT_NAME}', productName)
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message)
  
  // Generate WhatsApp link
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function openWhatsApp(
  phoneNumber: string,
  productName: string,
  messageTemplate?: string
): void {
  const link = generateWhatsAppLink(phoneNumber, productName, messageTemplate)
  window.open(link, '_blank')
}

