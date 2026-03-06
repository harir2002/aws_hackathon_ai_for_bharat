# 💧 Wise Drop - AI-Powered Groundwater Intelligence

[![AWS](https://img.shields.io/badge/AWS-Amplify-orange)](https://aws.amazon.com/amplify/)
[![Bedrock](https://img.shields.io/badge/Amazon-Bedrock-blue)](https://aws.amazon.com/bedrock/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)](https://www.python.org/)

> AI-powered groundwater intelligence platform for India with multi-agent architecture serving farmers, village officers, and policymakers. Built for AWS AI for Bharat Hackathon 2026.

**Live Demo**: [Coming Soon - Deploy via AWS Amplify]

---

## 🌟 Features

### Multi-Agent AI System
- **Farmer Agent**: Practical irrigation advice and crop suggestions
- **Village Officer Agent**: SDG 6 compliance tracking and risk assessment
- **Policy Maker Agent**: Strategic insights and economic impact projections

### Key Capabilities
- ✅ Real-time groundwater risk assessment (Critical/High/Moderate/Low)
- ✅ Amazon Bedrock Nova Pro AI integration
- ✅ Professional Word document report generation
- ✅ Interactive groundwater risk dashboard (11 districts)
- ✅ SDG 6 (Clean Water) compliance tracking
- ✅ Serverless architecture (AWS Lambda + API Gateway)

---

## 🏗️ Architecture

```
┌─────────────────┐
│   React App     │  ← AWS Amplify (Frontend)
│   (Vite + TW)   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  API Gateway    │  ← REST API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AWS Lambda     │  ← Python Backend
│  (Python 3.12)  │
└────┬───────┬────┘
     │       │
     ▼       ▼
┌────────┐ ┌──────────────┐
│   S3   │ │   Bedrock    │
│  Data  │ │  Nova Pro    │
└────────┘ └──────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- AWS Account with Bedrock access

### Frontend Setup

```bash
cd wise-drop/frontend
npm install
npm run dev
```

Open http://localhost:5173

### Backend Setup

The backend is already deployed as AWS Lambda.

API Endpoint: `https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice`

---

## 📦 Deployment

### Deploy Frontend to AWS Amplify

#### Option 1: Connect GitHub (Recommended)

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" → "Host web app"
3. Connect this GitHub repository
4. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` = `https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice`
6. Deploy!

#### Option 2: Manual Deploy

```bash
cd wise-drop/frontend
npm run build
# Upload 'dist' folder to Amplify
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2 with Vite
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router 7
- **Document Generation**: docx + file-saver
- **Hosting**: AWS Amplify

### Backend
- **Runtime**: Python 3.12 (AWS Lambda)
- **AI Model**: Amazon Bedrock Nova Pro
- **API**: AWS API Gateway (REST)
- **Data Storage**: Amazon S3
- **Region**: us-east-1

---

## 📊 Project Structure

```
wise-drop/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Agent pages
│   │   ├── services/       # API integration
│   │   └── utils/          # Utilities
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── amplify.yml         # AWS Amplify config
├── backend/
│   ├── lambda/
│   │   └── lambda_function_nova.py
│   ├── prompts/            # AI prompts
│   └── requirements.txt
├── DEPLOYMENT_GUIDE.md
├── AWS_DEPLOYMENT_AUDIT.md
└── README.md
```

---

## 🌍 Coverage

### States & Districts
- **Punjab**: Ludhiana, Amritsar, Patiala, Bathinda
- **Rajasthan**: Jaipur, Jodhpur, Bikaner, Barmer
- **Tamil Nadu**: Madurai, Chennai, Coimbatore, Trichy
- **Andhra Pradesh**: Guntur, Kurnool, Anantapur, Nellore
- **Maharashtra**: Latur, Aurangabad, Nashik, Pune
- **Uttar Pradesh**: Agra, Varanasi, Meerut, Allahabad

---

## 🎯 Use Cases

### For Farmers
- Get personalized irrigation advice
- Receive crop recommendations based on water availability
- Learn simple water conservation techniques

### For Village Officers
- Monitor SDG 6 compliance status
- Track contamination risks
- Generate official compliance reports

### For Policy Makers
- Simulate policy interventions
- Assess economic impact (₹ crores)
- Plan long-term water management strategies

---

## 📄 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice
```

### Backend (Lambda)
```env
AWS_REGION=us-east-1
DATA_BUCKET=your-s3-bucket-name
DATA_KEY=groundwater-data/india_villages.json
BEDROCK_MODEL_ID=us.amazon.nova-pro-v1:0
```

---

## 🧪 Testing

### Test API Endpoint
```bash
curl -X POST https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice \
  -H "Content-Type: application/json" \
  -d '{
    "role": "farmer",
    "state": "Punjab",
    "district": "Ludhiana"
  }'
```

### Run Frontend Tests
```bash
cd wise-drop/frontend
npm run build  # Should complete without errors
```

---

## 📈 Performance

- **Frontend Bundle**: 596 KB (split into 2 chunks)
  - Main: 243 KB (gzipped: 70 KB)
  - Docx vendor: 352 KB (gzipped: 102 KB)
- **API Response Time**: 3-5 seconds (including AI inference)
- **Cold Start**: ~2-3 seconds
- **Warm Response**: ~500-800ms

---

## 🎓 SDG Alignment

This project directly addresses **UN Sustainable Development Goal 6**:
- 6.3: Improve water quality
- 6.4: Increase water-use efficiency
- 6.5: Implement integrated water resources management

---

## 🤝 Contributing

This is a hackathon project. For issues or suggestions, please open an issue.

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Team

Built for AWS AI for Bharat Hackathon 2026

---

## 🙏 Acknowledgments

- Amazon Web Services for Bedrock Nova Pro
- AWS AI for Bharat Hackathon organizers
- Open-source community

---

## 📞 Support

For deployment help, see:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- [AWS_DEPLOYMENT_AUDIT.md](./AWS_DEPLOYMENT_AUDIT.md) - Deployment audit report
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick reference guide

---

**Built with ❤️ for sustainable water management in India** 🇮🇳
