/**
 * RiskBadge Component
 * Displays risk score and category with color-coded styling
 */

export default function RiskBadge({ risk_score, risk_category }) {
  // Don't render if no risk data
  if (risk_score === undefined || risk_score === null || !risk_category) {
    return null;
  }

  // Color mapping for risk categories
  const getRiskStyles = (category) => {
    const styles = {
      'Critical': {
        backgroundColor: '#dc2626', // red-600
        color: '#ffffff'
      },
      'High Risk': {
        backgroundColor: '#f97316', // orange-500
        color: '#ffffff'
      },
      'Moderate Risk': {
        backgroundColor: '#facc15', // yellow-400
        color: '#000000'
      },
      'Low Risk': {
        backgroundColor: '#22c55e', // green-500
        color: '#ffffff'
      }
    };
    return styles[category] || styles['Moderate Risk'];
  };

  const styles = getRiskStyles(risk_category);

  return (
    <span
      className="risk-badge"
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.color
      }}
    >
      Risk Score: {risk_score}/100 — {risk_category}
    </span>
  );
}
