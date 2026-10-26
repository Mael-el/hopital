/**
 * Notifications e-mail de l'hôpital.
 *
 * L'envoi utilise l'API HTTP de Resend si la clé RESEND_API_KEY est
 * configurée (variable d'environnement secrète, jamais exposée au
 * navigateur). Sans clé, les notifications sont simplement journalisées :
 * le back-office reste pleinement fonctionnel.
 */

type MailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendMail(input: MailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? "Hôpital La Croix de Zinvié <contact@hlacroixzinvie.bj>";

  if (!apiKey) {
    console.info(
      `[mail] mode simulation — « ${input.subject} » → ${Array.isArray(input.to) ? input.to.join(", ") : input.to}`,
    );
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[mail] échec d'envoi :", await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[mail] erreur réseau :", error);
    return false;
  }
}

function layout(title: string, rows: { label: string; value: string }[]): string {
  return `
    <div style="font-family:Georgia,'Times New Roman',serif;color:#20363d;max-width:640px">
      <div style="border-bottom:3px solid #a62a23;padding-bottom:12px;margin-bottom:20px">
        <h1 style="margin:0;font-size:20px">Hôpital « La Croix » de Zinvié</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1.5px">
          Centre de Santé à Vocation Humanitaire — Yêvié, Route de Zinvié
        </p>
      </div>
      <h2 style="margin:0 0 16px;font-size:17px">${title}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            (row) => `<tr>
              <td style="padding:8px 12px 8px 0;color:#64748b;white-space:nowrap;vertical-align:top">${row.label}</td>
              <td style="padding:8px 0;font-weight:600">${row.value}</td>
            </tr>`,
          )
          .join("")}
      </table>
      <p style="margin-top:24px;font-size:12px;color:#64748b;border-top:1px solid #e9e6e0;padding-top:14px">
        Message automatique de l'espace d'administration de l'hôpital « La Croix » de Zinvié.
      </p>
    </div>`;
}

export async function notifyNewConsultationRequest(data: {
  reference: string;
  fullName: string;
  phone: string;
  serviceLabel: string;
  preferredDate: string | null;
  reason: string;
}) {
  const to = process.env.MAIL_TO_ADMIN ?? "direction@hlacroixzinvie.bj";
  await sendMail({
    to,
    subject: `Nouvelle demande de consultation — ${data.fullName} (${data.serviceLabel})`,
    html: layout("Nouvelle demande de consultation", [
      { label: "Référence", value: data.reference },
      { label: "Patient", value: data.fullName },
      { label: "Téléphone", value: data.phone },
      { label: "Service demandé", value: data.serviceLabel },
      {
        label: "Date préférée",
        value: data.preferredDate ?? "Non précisée",
      },
      { label: "Motif", value: data.reason },
    ]),
    text: `Demande ${data.reference} — ${data.fullName} (${data.phone}) — ${data.serviceLabel} — ${data.reason}`,
  });
}

export async function notifyNewContactMessage(data: {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const to = process.env.MAIL_TO_ADMIN ?? "direction@hlacroixzinvie.bj";
  await sendMail({
    to,
    subject: `Nouveau message de contact — ${data.subject}`,
    html: layout("Nouveau message via le formulaire de contact", [
      { label: "Expéditeur", value: data.fullName },
      { label: "E-mail", value: data.email },
      { label: "Téléphone", value: data.phone || "Non communiqué" },
      { label: "Objet", value: data.subject },
      { label: "Message", value: data.message },
    ]),
    text: `${data.subject} — ${data.fullName} (${data.email}) : ${data.message}`,
  });
}

export async function notifyNewDonation(data: {
  reference: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  purpose: string;
}) {
  const to = process.env.MAIL_TO_ADMIN ?? "direction@hlacroixzinvie.bj";
  await sendMail({
    to,
    subject: `Nouveau don — ${data.amount} FCFA (${data.reference})`,
    html: layout("Nouveau don enregistré", [
      { label: "Référence", value: data.reference },
      { label: "Donateur", value: data.donorName || "Anonyme" },
      { label: "E-mail", value: data.donorEmail || "Non communiqué" },
      { label: "Montant", value: `${data.amount} FCFA` },
      { label: "Affectation", value: data.purpose || "Fonds libres" },
    ]),
    text: `Don ${data.reference} — ${data.amount} FCFA — ${data.donorName || "anonyme"}`,
  });
}
