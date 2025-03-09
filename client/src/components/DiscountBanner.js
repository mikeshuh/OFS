import discountImage from "../assets/discount.png"; // Discount image

function DiscountBanner() {

  const styles = {
    // 🎉 Discount banner styles
    discountBanner: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#f8f9fa",
      padding: "10px 15px",
      borderRadius: "30px",
      margin: "10px auto",
      width: "80%",
      maxWidth: "750px",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      position: "relative",
      height: "60px"
    },
    discountImage: {
      height: "90px",
      position: "flex",
      left: "20px",
      top: "-10px"
    },
    // Make the text section horizontally aligned as a whole (left-right layout)
    discountTextContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      gap: "20px"
    },
    leftColumn: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: "10px",
      fontWeight: "bold",
      textAlign: "center",
      flex: 1
    },
    rightColumn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "30px",
      fontWeight: "bold",
      textAlign: "center",
      flex: 1
    },
    discountHighlight: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#000"
    },
    discountSubText: {
      fontSize: "15px",
      color: "#555"
    },
    discountRight: {
      fontSize: "25px",
      color: "#dc3545"
    },
    container: {
      textAlign: "center",
      padding: "50px"
    },
    claimButton: {
      backgroundColor: "white",
      color: "#dc3545",
      border: "2px solid #dc3545",
      fontWeight: "bold",
      padding: "10px 20px",
      borderRadius: "20px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease, color 0.3s ease"
    },
    discountCode: {
      fontSize: "30px",
      color: "#dc3545"
    },

  }
  return (
    <div style={styles.discountBanner}>
      <img src={discountImage} alt="Discount" style={styles.discountImage} />

      {/* Two columns */}
      <div style={styles.discountTextContainer}>
        {/* Left side：10% OFF & With First Order */}
        <div style={styles.leftColumn}>
          <span style={styles.discountHighlight}>10% OFF</span>
          <br />
          <span style={styles.discountSubText}>With First Order</span>
        </div>

        {/* Right side：Code: WELCOME */}
        <div style={styles.rightColumn}>
          <span style={styles.discountCode}>Code: WELCOME</span>
        </div>
      </div>

      <button style={styles.claimButton}
        onClick={() => alert("Discount claimed!")}
      >
        Claim NOW!!!
      </button>
    </div>
  );
};

export default DiscountBanner
