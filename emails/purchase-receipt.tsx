import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

export interface PinItem {
  serialNumber: string;
  pinCode: string;
  examType?: string;
}

export interface PurchaseReceiptEmailProps {
  username: string;
  transactionRef: string;
  totalAmount: number;
  pins: PinItem[];
  date?: string;
}

export const PurchaseReceiptEmail = ({
  username,
  transactionRef = "TXN-123456789",
  totalAmount = 4500,
  pins,
  date = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
}: PurchaseReceiptEmailProps) => {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`;

  return (
    <Html>
      <Head />
      <Preview>Your EasyWAEC Scratch Card PIN Purchase Receipt</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.brandTitle}>EasyWAEC</Heading>
            <Text style={styles.subtitle}>Instant WAEC Result Checker PIN Delivery</Text>
          </Section>

          <Hr style={styles.divider} />

          {/* Greeting */}
          <Text style={styles.greeting}>Hi, {username},</Text>
          <Text style={styles.paragraph}>
            Thank you for your purchase! Your payment was successful and your WAEC Scratch Card PINs are ready below.
          </Text>

          {/* Transaction Metadata */}
          <Section style={styles.metaContainer}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ fontSize: "14px" }}>
              <tbody>
                <tr>
                  <td style={styles.metaLabel}>Transaction Ref:</td>
                  <td style={styles.metaValue}>
                    <strong>{transactionRef}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={styles.metaLabel}>Date:</td>
                  <td style={styles.metaValue}>{date}</td>
                </tr>
                <tr>
                  <td style={styles.metaLabel}>Total Amount:</td>
                  <td style={styles.metaValue}>
                    <strong>₦{totalAmount.toLocaleString()}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* PINs Table */}
          <Section style={styles.tableSection}>
            <Heading as="h3" style={styles.tableHeading}>
              Your Purchased PINs ({pins.length})
            </Heading>
            <table width="100%" cellPadding="8" cellSpacing="0" style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Exam Type</th>
                  <th style={styles.th}>Serial Number</th>
                  <th style={styles.th}>PIN Code</th>
                </tr>
              </thead>
              <tbody>
                {pins.map((pin, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.td}>{pin.examType || "WAEC Direct"}</td>
                    <td style={{ ...styles.td, fontFamily: "monospace" }}>{pin.serialNumber}</td>
                    <td style={{ ...styles.td, fontFamily: "monospace", fontWeight: "bold" }}>
                      {pin.pinCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* CTA Button */}
          <Section style={styles.ctaContainer}>
            <Button style={styles.button} href={dashboardUrl}>
              View in Dashboard
            </Button>
          </Section>

          <Hr style={styles.divider} />

          {/* Security Notice */}
          <Section style={styles.securityBox}>
            <Text style={styles.securityTitle}>🔒 Security Notice</Text>
            <Text style={styles.securityText}>
              Please treat your PINs like cash. Do not share them with unauthorized persons. EasyWAEC staff will never ask you for your PIN code via phone or social media.
            </Text>
          </Section>

          {/* Footer */}
          <Text style={styles.footer}>
            If you have any questions or did not authorize this purchase, please contact support immediately at support@easywaec.com.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PurchaseReceiptEmail;

// Inline CSS Styles for universal email client compatibility
const styles = {
  main: {
    backgroundColor: "#f4f6f8",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "20px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    maxWidth: "580px",
    margin: "0 auto",
    padding: "32px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  header: {
    textAlign: "center" as const,
  },
  brandTitle: {
    color: "#059669",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "14px",
    margin: "4px 0 0 0",
  },
  divider: {
    borderColor: "#e5e7eb",
    margin: "24px 0",
  },
  greeting: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#111827",
  },
  paragraph: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.5",
  },
  metaContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    padding: "16px",
    margin: "20px 0",
  },
  metaLabel: {
    color: "#6b7280",
    padding: "4px 0",
    width: "40%",
  },
  metaValue: {
    color: "#111827",
    padding: "4px 0",
    textAlign: "right" as const,
  },
  tableSection: {
    margin: "24px 0",
  },
  tableHeading: {
    fontSize: "16px",
    color: "#111827",
    marginBottom: "12px",
  },
  table: {
    borderCollapse: "collapse" as const,
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    overflow: "hidden",
  },
  tableHeaderRow: {
    backgroundColor: "#059669",
    color: "#ffffff",
  },
  th: {
    fontSize: "12px",
    textAlign: "left" as const,
    padding: "10px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    fontSize: "13px",
    color: "#1f2937",
    padding: "10px",
  },
  ctaContainer: {
    textAlign: "center" as const,
    margin: "28px 0",
  },
  button: {
    backgroundColor: "#059669",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "14px",
    textDecoration: "none",
    display: "inline-block",
  },
  securityBox: {
    backgroundColor: "#fffbeb",
    borderLeft: "4px solid #f59e0b",
    padding: "12px 16px",
    borderRadius: "4px",
    margin: "20px 0",
  },
  securityTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#b45309",
    margin: "0 0 4px 0",
  },
  securityText: {
    fontSize: "12px",
    color: "#92400e",
    margin: "0",
    lineHeight: "1.4",
  },
  footer: {
    fontSize: "12px",
    color: "#9ca3af",
    textAlign: "center" as const,
    marginTop: "24px",
  },
};