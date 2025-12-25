/**
 * Rule-based Crop Advisory
 * Aligned with ICAR / KVK common disease guidelines
 * NOTE: Pesticide info is indicative, not prescriptive
 */

const cropAdvisoryQuick = {

  /* ===================== TOMATO ===================== */
  tomato: {
    "late blight": {
      risk: "High",
      advisory:
        "Late blight spreads rapidly in cool, humid weather and can destroy the crop quickly.",
      pesticide: {
        name: "Mancozeb 75% WP",
        dosage: "2–2.5 g per litre of water",
        safety: "Wear gloves and mask. Avoid spraying during rainfall."
      }
    },
    "early blight": {
      risk: "Medium",
      advisory:
        "Early blight causes leaf spots and weakens the plant. Remove affected leaves and maintain field hygiene.",
      pesticide: {
        name: "Chlorothalonil 75% WP",
        dosage: "2 g per litre of water",
        safety: "Do not spray during strong winds."
      }
    },
    "bacterial wilt": {
      risk: "High",
      advisory:
        "Bacterial wilt causes sudden wilting. Avoid waterlogging and use disease-free seedlings.",
      pesticide: {
        name: "Copper Oxychloride",
        dosage: "3 g per litre of water",
        safety: "Avoid excessive application."
      }
    },
    "septoria leaf spot": {
  risk: "High",
  advisory:
    "Septoria leaf spot spreads rapidly in warm, humid conditions. Remove infected leaves and avoid overhead irrigation.",
  pesticide: {
    name: "Chlorothalonil 75% WP",
    dosage: "2 g per litre of water",
    safety:
      "Wear gloves and mask. Avoid spraying during windy conditions."
  }
}

  },

  /* ===================== RICE ===================== */
  rice: {
    "blast disease": {
      risk: "High",
      advisory:
        "Rice blast spreads rapidly in humid conditions. Avoid excess nitrogen fertilizer.",
      pesticide: {
        name: "Tricyclazole 75% WP",
        dosage: "0.6 g per litre of water",
        safety: "Use protective clothing while spraying."
      }
    },
    "brown spot": {
      risk: "Medium",
      advisory:
        "Brown spot occurs in nutrient-deficient fields. Apply balanced fertilizers.",
      pesticide: {
        name: "Mancozeb 75% WP",
        dosage: "2 g per litre of water",
        safety: "Do not mix with other chemicals unless advised."
      }
    },
    "bacterial leaf blight": {
      risk: "High",
      advisory:
        "Bacterial leaf blight spreads through irrigation water. Maintain proper field drainage.",
      pesticide: {
        name: "Copper Hydroxide",
        dosage: "2.5 g per litre of water",
        safety: "Avoid spraying near water bodies."
      }
    }
  },

  /* ===================== WHEAT ===================== */
  wheat: {
    "wheat rust": {
      risk: "High",
      advisory:
        "Wheat rust spreads via wind-borne spores. Early spraying is critical.",
      pesticide: {
        name: "Propiconazole 25% EC",
        dosage: "1 ml per litre of water",
        safety: "Avoid skin contact."
      }
    },
    "powdery mildew": {
      risk: "Medium",
      advisory:
        "Powdery mildew develops in cool and humid conditions. Ensure good air circulation.",
      pesticide: {
        name: "Sulfur 80% WP",
        dosage: "2 g per litre of water",
        safety: "Do not spray during high temperature."
      }
    },
    "karnal bunt": {
      risk: "High",
      advisory:
        "Karnal bunt affects grain quality. Use certified seeds and follow crop rotation.",
      pesticide: {
        name: "Carbendazim 50% WP",
        dosage: "2 g per kg seed (seed treatment)",
        safety: "Wear gloves during seed treatment."
      }
    }
  },

  /* ===================== MAIZE ===================== */
  maize: {
    "gray leaf spot": {
      risk: "High",
      advisory:
        "Gray leaf spot is a common fungal disease in maize. Avoid continuous maize cropping.",
      pesticide: {
        name: "Propiconazole 25% EC",
        dosage: "1 ml per litre of water",
        safety: "Use protective equipment while spraying."
      }
    },
    "leaf blight": {
      risk: "Medium",
      advisory:
        "Leaf blight reduces photosynthesis. Practice crop rotation and residue management.",
      pesticide: {
        name: "Mancozeb 75% WP",
        dosage: "2 g per litre of water",
        safety: "Avoid spraying during rain."
      }
    },
    "corn smut": {
      risk: "High",
      advisory:
        "Corn smut forms galls on plant parts. Remove infected plants immediately.",
      pesticide: {
        name: "Carbendazim 50% WP",
        dosage: "1 g per litre of water",
        safety: "Do not exceed recommended dosage."
      }
    }
  },

  /* ===================== POTATO ===================== */
  potato: {
    "late blight": {
      risk: "High",
      advisory:
        "Potato late blight spreads rapidly in moist conditions. Destroy infected foliage.",
      pesticide: {
        name: "Metalaxyl + Mancozeb",
        dosage: "2 g per litre of water",
        safety: "Avoid repeated use of same fungicide."
      }
    },
    "early blight": {
      risk: "Medium",
      advisory:
        "Early blight weakens plants. Ensure balanced fertilization.",
      pesticide: {
        name: "Chlorothalonil",
        dosage: "2 g per litre of water",
        safety: "Wash hands after spraying."
      }
    }
  },

  /* ===================== COTTON ===================== */
  cotton: {
    "bollworm": {
      risk: "High",
      advisory:
        "Bollworm damages cotton bolls and reduces yield. Regular monitoring is essential.",
      pesticide: {
        name: "Spinosad 45% SC",
        dosage: "0.3 ml per litre of water",
        safety: "Avoid spraying during flowering stage."
      }
    },
    "leaf curl virus": {
      risk: "High",
      advisory:
        "Leaf curl virus spreads through whiteflies. Control vector population.",
      pesticide: {
        name: "Imidacloprid 17.8% SL",
        dosage: "0.3 ml per litre of water",
        safety: "Avoid spraying during peak sunlight."
      }
    }
  },

  /* ===================== SUGARCANE ===================== */
  sugarcane: {
    "red rot": {
      risk: "High",
      advisory:
        "Red rot is a destructive disease. Use resistant varieties and destroy infected canes.",
      pesticide: {
        name: "Carbendazim 50% WP",
        dosage: "1 g per litre of water",
        safety: "Do not spray near water channels."
      }
    },
    "smut": {
      risk: "High",
      advisory:
        "Sugarcane smut spreads through infected seed material. Use disease-free setts.",
      pesticide: {
        name: "Propiconazole",
        dosage: "1 ml per litre of water",
        safety: "Wear protective gear while spraying."
      }
    }
  }
};

module.exports = cropAdvisoryQuick;