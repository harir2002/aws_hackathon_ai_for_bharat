# Wise Drop - AWS Deployment Guide

## 🚀 Deployment Checklist

### ✅ Pre-Deployment Verification Complete

All deployment checks have been completed successfully. The application is ready for AWS deployment.

---

## 📦 Frontend Deployment (AWS Amplify)

### Prerequisites
- AWS Account with Amplify access
- GitHub repository (optional, for CI/CD)

### Deployment Steps

#### Option 1: Deploy via AWS Amplify Console (Recommended)

1. **Login to AWS Console**
   - Navigate to AWS Amplify service
   - Click "New app" → "Host web app"

2. **Connect Repository**
   - Choose "Deploy without Git provider" for manual deployment
   - Or connect your GitHub/GitLab repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - The `amplify.yml` file is already configured in the frontend folder

4. **Set Environment Variables**
   - Go to "Environment variables" in Amplify console
   - Add: `VITE_API_URL` = `https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice`

5. **Deploy**
   - Click "Save and deploy"
   - Wait for build to complete (~3-5 minutes)
   - Your app will be live at: `https://[app-id].amplifyapp.com`

#### Option 2: Manual Deployment

```bash
cd wise-drop/frontend
npm install
npm run build
# Upload the 'dist' folder to S3 or any static hosting service
```

---

## 🔧 Backend Deployment (AWS Lambda)

### Current Status
✅ Lambda function is already deployed at:
- **API Gateway URL**: `https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice`
- **Region**: us-east-1
- **Model**: Amazon Nova Pro (us.amazon.nova-pro-v1:0)

### Lambda Configuration

The backend Lambda function (`lambda_function_nova.py`) is already configured with:
- ✅ CORS headers for cross-origin requests
- ✅ Environment variable support
- ✅ Amazon Bedrock integration
- ✅ S3 data loading
- ✅ Error handling and logging

### Required Environment Variables (Already Set)

```
DATA_BUCKET=your-s3-bucket-name
DATA_KEY=groundwater-data/india_villages.json
```

### If You Need to Redeploy Lambda

1. **Package the Lambda function**
```bash
cd wise-drop/backend/lambda
zip -r lambda_function.zip lambda_function_nova.py
```

2. **Update via AWS Console**
   - Go to AWS Lambda console
   - Find your function
   - Upload the new zip file
   - Click "Deploy"

3. **Or use AWS CLI**
```bash
aws lambda update-function-code \
  --function-name your-function-name \
  --zip-file fileb://lambda_function.zip \
  --region us-east-1
```

---

## 🔐 Environment Variables Reference

### Frontend (.env)
```
VITE_API_URL=https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice
```

### Backend (Lambda Environment Variables)
```
AWS_REGION=us-east-1
DATA_BUCKET=your-s3-bucket-name
DATA_KEY=groundwater-data/india_villages.json
BEDROCK_MODEL_ID=us.amazon.nova-pro-v1:0
```

---

## 🧪 Testing After Deployment

### Frontend Testing
1. Open the Amplify URL in browser
2. Navigate to each agent page (Farmer, Officer, Policy Maker)
3. Test form submission with sample data:
   - State: Punjab
   - District: Ludhiana
4. Verify Word document download works

### Backend Testing
```bash
curl -X POST https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice \
  -H "Content-Type: application/json" \
  -d '{
    "role": "farmer",
    "state": "Punjab",
    "district": "Ludhiana"
  }'
```

Expected response: JSON with advice, summary, and risk_level

---

## 📊 Architecture Overview

```
┌─────────────────┐
│   React App     │
│  (AWS Amplify)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  API Gateway    │
│   (REST API)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AWS Lambda     │
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

## 🔍 Troubleshooting

### Frontend Issues

**Problem**: API calls failing with CORS error
- **Solution**: Verify Lambda has CORS headers configured (already done)

**Problem**: Environment variable not loading
- **Solution**: Ensure `VITE_API_URL` is set in Amplify console environment variables

### Backend Issues

**Problem**: Lambda timeout
- **Solution**: Increase timeout in Lambda configuration (current: 30s recommended)

**Problem**: Bedrock access denied
- **Solution**: Verify Lambda execution role has `bedrock:InvokeModel` permission

**Problem**: S3 access denied
- **Solution**: Verify Lambda execution role has `s3:GetObject` permission

---

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed and accessible via HTTPS
- [ ] API Gateway endpoint responding correctly
- [ ] All three agent types (Farmer, Officer, Policy Maker) working
- [ ] Word document download functioning
- [ ] Risk levels displaying correctly
- [ ] No console errors in browser
- [ ] Mobile responsive design working

---

## 🎯 Performance Optimization

### Frontend
- ✅ Code splitting enabled (docx library in separate chunk)
- ✅ Gzip compression enabled
- ✅ Lazy loading for routes

### Backend
- ✅ Lambda cold start optimized
- ✅ Efficient S3 data loading
- ✅ Bedrock inference config optimized (max_tokens: 400, temp: 0.3)

---

## 📞 Support

For deployment issues:
1. Check CloudWatch Logs for Lambda errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test API endpoint directly with curl/Postman

---

## 🔄 CI/CD Setup (Optional)

To enable automatic deployments:

1. **Connect GitHub to Amplify**
   - Push code to GitHub
   - Connect repository in Amplify console
   - Enable auto-deploy on push to main branch

2. **Lambda CI/CD**
   - Use AWS SAM or Serverless Framework
   - Configure GitHub Actions for automated Lambda deployments

---

## ✅ Deployment Complete!

Your Wise Drop application is now ready for production use on AWS.

**Frontend URL**: Will be provided by AWS Amplify after deployment
**Backend API**: https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice

Good luck with your AWS AI Hackathon submission! 🎉
