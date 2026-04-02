/**
 * Google Apps Script — Booking Handler
 * Web3 Collective × AgentBase
 * 
 * INSTRUCCIONES DE DEPLOY:
 * 1. Ir a script.google.com → Nuevo proyecto
 * 2. Pegar todo este código
 * 3. Clic en "Implementar" → "Nueva implementación"
 * 4. Tipo: "Aplicación web"
 * 5. Ejecutar como: "Yo" (tu cuenta de Google)
 * 6. Quién tiene acceso: "Cualquier persona"
 * 7. Copiar la URL y pegarla en el index.html donde dice GAS_URL
 */

const CALENDAR_EMAIL = 'web3.collective.corp@gmail.com';
const FERNANDO_EMAIL = 'fernando.ferreira@fisconegociomx.com';
const TIMEZONE = 'America/Monterrey';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const { nombre, empresa, email, whatsapp, fecha, hora, isoDate, diagnostico } = data;
    
    // Construir fecha/hora del evento
    const [horaStr, minStr] = hora.split(':');
    const startDate = new Date(isoDate + 'T' + hora + ':00');
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hora
    
    // Crear evento en Google Calendar
    const calendar = CalendarApp.getCalendarById(CALENDAR_EMAIL);
    const event = calendar.createEvent(
      '🤖 Demo AgentBase — ' + empresa,
      startDate,
      endDate,
      {
        description: [
          'Prospecto: ' + nombre,
          'Empresa: ' + empresa,
          'Correo: ' + email,
          whatsapp ? 'WhatsApp: ' + whatsapp : '',
          '',
          'Diagnóstico:',
          diagnostico || 'No disponible'
        ].filter(Boolean).join('\n'),
        guests: email + ',' + FERNANDO_EMAIL,
        sendInvites: true
      }
    );
    
    // Correo de confirmación al prospecto
    GmailApp.sendEmail(
      email,
      '✅ Tu demo con Web3 Collective está confirmada',
      '',
      {
        htmlBody: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#080c18;color:#f1f5f9;padding:32px;border-radius:16px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="font-size:40px;margin-bottom:8px">🎉</div>
            <h1 style="font-size:22px;font-weight:900;color:#A78BFA;margin:0">Demo confirmada</h1>
          </div>
          <p style="font-size:15px;color:#cbd5e1">Hola <strong>${nombre}</strong>,</p>
          <p style="font-size:14px;color:#94a3b8;line-height:1.6">Tu demo personalizada con el equipo de Web3 Collective está agendada. Te compartimos los detalles:</p>
          <div style="background:#0d1122;border:1px solid rgba(139,92,246,.3);border-radius:12px;padding:20px;margin:20px 0">
            <div style="margin-bottom:10px;font-size:14px"><span style="color:#8B5CF6">📅</span> <strong>${fecha}</strong></div>
            <div style="margin-bottom:10px;font-size:14px"><span style="color:#8B5CF6">🕐</span> <strong>${hora} hrs</strong> (Hora de México)</div>
            <div style="margin-bottom:10px;font-size:14px"><span style="color:#8B5CF6">🏢</span> ${empresa}</div>
            <div style="font-size:14px"><span style="color:#8B5CF6">👤</span> ${nombre}</div>
          </div>
          <p style="font-size:13px;color:#94a3b8;line-height:1.6">Recibirás una invitación de calendario. Fernando se pondrá en contacto contigo antes de la sesión para confirmar los detalles.</p>
          <div style="text-align:center;margin-top:24px">
            <a href="https://agentbase.mx" style="background:#8B5CF6;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">Conocer más sobre AgentBase →</a>
          </div>
          <p style="font-size:11px;color:#3a4a6b;text-align:center;margin-top:20px">Web3 Collective · AgentBase × IA para negocios</p>
        </div>
        `
      }
    );
    
    // Notificación a Fernando por correo
    GmailApp.sendEmail(
      FERNANDO_EMAIL,
      '🔔 Nueva demo agendada — ' + empresa,
      '',
      {
        htmlBody: `
        <div style="font-family:Inter,sans-serif;max-width:480px">
          <h2 style="color:#7C3AED">Nueva demo agendada</h2>
          <p><strong>Prospecto:</strong> ${nombre}</p>
          <p><strong>Empresa:</strong> ${empresa}</p>
          <p><strong>Correo:</strong> ${email}</p>
          ${whatsapp ? '<p><strong>WhatsApp:</strong> ' + whatsapp + '</p>' : ''}
          <p><strong>Fecha:</strong> ${fecha}</p>
          <p><strong>Hora:</strong> ${hora} hrs</p>
          <hr/>
          <p><strong>Diagnóstico:</strong><br/>${diagnostico || 'N/A'}</p>
        </div>
        `
      }
    );
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test con GET (para verificar que el script está activo)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'Web3 Collective Booking' }))
    .setMimeType(ContentService.MimeType.JSON);
}
