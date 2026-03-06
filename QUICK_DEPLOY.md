# 🚀 Quick Deploy - Wise Drop

## Frontend (AWS Amplify) - 5 Minutes

### Step 1: Login to AWS
```
https://console.aws.amazon.com/amplify
```

### Step 2: Create New App
- Click "New app" → "Host web app"
- Choose "Deploy without Git" (or connect GitHub)

### Step 3: Upload Build
```bash
cd wise-drop/frontend
npm install
npm run build
# Upload the 'dist' folder
```

### Step 4: Set Environment Variable
```
Key: VITE_API_URL
Value: https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice
```

### Step 5: Deploy
- Click "Save and deploy"
- Wait 3-5 minutes
- Done! ✅

---

## Backend (Already Deployed) ✅

Your Lambda function is already live at:
```
https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice
```

No action needed! 🎉

---

## Test Your Deployment

### Quick Test
```bash
curl -X POST https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice \
  -H "Content-Type: application/json" \
  -d '{"role":"farmer","state":"Punjab","district":"Ludhiana"}'
```

### Browser Test
1. Open your Amplify URL
2. Click "Farmer Agent"
3. Select: Punjab → Ludhiana
4. Click "Get AI Advice"
5. Download Word report

---

## That's It! 🎉

Your app is now live on AWS.

**Total Time**: ~10 minutes
**Cost**: Free tier eligible
**Scalability**: Automatic

For detailed instructions, see `DEPLOYMENT_GUIDE.md`
