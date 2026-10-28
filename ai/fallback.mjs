function clean(value, limit) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ').slice(0, limit).trim() : '';
}

export function demoPrevalidation(text, condition) {
  const evidence = clean(text, 12000);
  const rule = clean(condition, 500);
  const gradeMatch = evidence.match(/(?:nota|calificaci[oó]n|grade)\s*[:=]?\s*(\d{1,2}(?:[,.]\d{1,2})?)/i);
  const dateMatch = evidence.match(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/);
  const subjectMatch = evidence.match(/(?:materia|asignatura|subject)\s*[:=]\s*([^\n,;]{2,80})/i);
  const nameMatch = evidence.match(/(?:estudiante|alumno|nombre|student)\s*[:=]\s*([^\n,;]{2,80})/i);
  const thresholdMatch = rule.match(/(?:nota|calificaci[oó]n)\s*(?:m[ií]nima\s*)?(?:de\s*)?(\d{1,2}(?:[,.]\d{1,2})?)/i);
  const grade = gradeMatch ? Number(gradeMatch[1].replace(',', '.')) : null;
  const threshold = thresholdMatch ? Number(thresholdMatch[1].replace(',', '.')) : null;
  const enough = evidence.length > 0 && grade !== null && threshold !== null && grade >= threshold;
  const below = evidence.length > 0 && grade !== null && threshold !== null && grade < threshold;
  return {
    suggestion: enough ? 'aprobar' : 'revisar',
    reason: enough
      ? `La evidencia incluye una nota ${grade}, que alcanza el mínimo de ${threshold} indicado para el hito. Confirmá identidad y documento original.`
      : below
        ? `La nota detectada (${grade}) no alcanza el mínimo indicado (${threshold}); hace falta revisión humana.`
        : 'No se pudo comparar con confianza una nota y un umbral explícitos. Revisá el documento original.',
    confidence: enough ? 0.72 : below ? 0.7 : 0.2,
    extracted: {
      nombre: nameMatch?.[1]?.trim() ?? null,
      materia: subjectMatch?.[1]?.trim() ?? null,
      nota: gradeMatch?.[1]?.replace(',', '.') ?? null,
      fecha: dateMatch?.[1] ?? null,
    },
    humanDecisionRequired: true,
    provider: 'demo',
    label: 'IA (modo demo)',
  };
}

export function demoReceiptExplanation({ amountSats, milestoneTitle, reservedSats }) {
  const amount = Number(amountSats).toLocaleString('es-AR');
  const reserved = Number(reservedSats).toLocaleString('es-AR');
  return {
    explanation: `En esta simulación, te llegaron ${amount} sats por aprobar “${clean(milestoneTitle, 100)}”. Quedan ${reserved} sats reservados; si no se usan, vuelven al sponsor. No hubo un pago real en Lightning.`,
    provider: 'demo',
    label: 'IA (modo demo)',
  };
}
