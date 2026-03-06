/**
 * AlertBanner Component
 * Displays active alerts with color-coded styling based on alert type
 */

export default function AlertBanner({ alerts }) {
  // Don't render if no alerts
  if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
    return null;
  }

  // Color mapping for alert types
  const getAlertStyles = (type) => {
    const styles = {
      danger: {
        borderColor: '#dc2626', // red-600
        backgroundColor: '#fef2f2', // red-50
        badgeColor: '#dc2626'
      },
      warning: {
        borderColor: '#eab308', // yellow-500
        backgroundColor: '#fefce8', // yellow-50
        badgeColor: '#eab308'
      },
      info: {
        borderColor: '#60a5fa', // blue-400
        backgroundColor: '#eff6ff', // blue-50
        badgeColor: '#60a5fa'
      }
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="alert-banner-container">
      <h3 className="alert-banner-title">🔔 Active Alerts</h3>
      <div className="alert-cards-grid">
        {alerts.map((alert, index) => {
          const styles = getAlertStyles(alert.type);
          return (
            <div
              key={index}
              className="alert-card"
              style={{
                borderLeftColor: styles.borderColor,
                backgroundColor: styles.backgroundColor
              }}
            >
              <div className="alert-header">
                <span className="alert-icon">{alert.icon}</span>
                <h4 className="alert-title">{alert.title}</h4>
              </div>
              <p className="alert-message">{alert.message}</p>
              {alert.action && (
                <span
                  className="alert-action-badge"
                  style={{ backgroundColor: styles.badgeColor }}
                >
                  {alert.action}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
